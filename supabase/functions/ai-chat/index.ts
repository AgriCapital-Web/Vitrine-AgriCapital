import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Site content for AI context
const SITE_CONTEXT = `
Tu es KAPITA, l'assistant virtuel intelligent d'AgriCapital. Tu es professionnel, chaleureux et expert en agriculture, particulièrement en culture de palmiers à huile en Côte d'Ivoire.

À PROPOS D'AGRICAPITAL:
- AgriCapital est une entreprise spécialisée dans la plantation et l'exploitation de palmiers à huile en Côte d'Ivoire
- Mission: Transformer les terres agricoles en sources de prospérité durable
- Services: Mise en valeur de terres, partenariat agricole, plantation clé en main
- Contact: 05 65 55 17 17 | contact@agricapital.ci | www.agricapital.ci
- Localisation: Côte d'Ivoire

OFFRES PRINCIPALES:
1. Partenariat Agricole: Devenez planteur de palmiers à huile sans effort
2. Mise en Valeur de Terres: Transformez vos terres inexploitées en plantations rentables
3. Gestion Complète: AgriCapital gère tout (plantation, entretien, récolte, commercialisation)

AVANTAGES:
- Rendement garanti sur le long terme
- Expertise technique reconnue
- Accompagnement personnalisé
- Transparence totale dans la gestion

INSTRUCTIONS:
- Réponds toujours de manière professionnelle et amicale
- Propose de mettre en contact avec l'équipe AgriCapital pour les questions complexes
- Si tu ne connais pas une information spécifique, dis-le et propose de contacter l'équipe
- Utilise la langue de l'utilisateur (français par défaut)
- Termine souvent en proposant de l'aide supplémentaire ou de contacter l'équipe
`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, visitorId, language = 'fr' } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Store chat in database for reporting
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const systemPrompt = SITE_CONTEXT + `\n\nLangue de l'utilisateur: ${language}\nID visiteur: ${visitorId || 'anonymous'}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requêtes atteinte. Veuillez réessayer." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Crédits épuisés. Veuillez contacter l'équipe." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Erreur du service IA" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Log chat interaction
    try {
      const lastUserMessage = messages.filter((m: any) => m.role === 'user').pop();
      if (lastUserMessage) {
        await supabase.from('ai_chat_logs').insert({
          visitor_id: visitorId || 'anonymous',
          message: lastUserMessage.content,
          language: language,
        });
      }
    } catch (logError) {
      console.error("Error logging chat:", logError);
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Erreur inconnue" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
