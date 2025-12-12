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
- AGRICAPITAL SARL est immatriculée au RCCM CI-DAL-01-2025-B12-13435 avec un capital de 5 000 000 FCFA
- Entreprise ivoirienne basée à Gonaté, Daloa, Côte d'Ivoire
- Mission: Accompagner les propriétaires terriens et petits exploitants dans la création et le développement de plantations de palmier à huile sans barrière financière
- Modèle intégré: plants certifiés, intrants, encadrement technique, formation, suivi régulier et garantie de rachat sur 20 ans
- Valeurs: Revenus durables, inclusion rurale, pratiques agricoles responsables
- Contact: 05 65 55 17 17 | contact@agricapital.ci | www.agricapital.ci
- Localisation: Gonaté, Daloa, Côte d'Ivoire

OFFRES PRINCIPALES:

1. PalmElite - Offre Intégrale Premium
   - Pour qui: Planteur propriétaire de terre agricole
   - Droit d'accès: 20 000F/ha (ancien prix: 30 000F/ha)
   - Abonnement modulable: 65F/ha/jour | 1 900F/mois | 5 500F/trimestre | 20 000F/ha/an
   - Avantage: 100% propriétaire de votre plantation

2. PalmInvest - Investissement Sans Terre
   - Pour qui: Salarié public/privé, artisan, commerçant sans terre agricole
   - Droit d'accès: 30 000F/ha (ancien prix: 45 000F/ha)
   - Abonnement modulable: 120F/ha/jour | 3 400F/ha/mois | 9 500F/ha/trimestre | 35 400F/ha/an
   - Avantages: Diversification financière intelligente, 50% de la plantation à l'entrée en production

3. TerraPalm - Valorisation Foncière Sans Effort
   - Pour qui: Propriétaire de terre agricole souhaitant pas exploiter lui-même
   - Droit d'accès: 10 000F/ha (ancien prix: 15 000F/ha) - Paiement unique
   - Avantages: Gestion complète assurée par AgriCapital et l'exploitant avant l'entrée en production, 50% de la plantation dès l'entrée en production

SERVICES INCLUS:
- Plants certifiés de palmiers à huile de haute qualité
- Fourniture d'intrants agricoles
- Encadrement technique par des experts
- Formation des planteurs
- Suivi régulier des plantations
- Garantie de rachat sur 20 ans

AVANTAGES CLÉS:
- Aucune barrière financière pour démarrer
- Rendement garanti sur le long terme
- Expertise technique reconnue
- Accompagnement personnalisé
- Transparence totale dans la gestion
- Modèle de partenariat gagnant-gagnant

PROCESSUS D'INSCRIPTION:
1. Contact initial via téléphone, email ou site web
2. Évaluation des besoins et choix de l'offre adaptée
3. Signature du contrat de partenariat
4. Mise en place de la plantation
5. Suivi et accompagnement continu

INSTRUCTIONS POUR L'ASSISTANT:
- Réponds toujours de manière professionnelle et amicale
- Propose de mettre en contact avec l'équipe AgriCapital pour les questions complexes
- Si tu ne connais pas une information spécifique, dis-le et propose de contacter l'équipe
- Utilise la langue de l'utilisateur (français par défaut)
- Termine souvent en proposant de l'aide supplémentaire ou de contacter l'équipe
- Mets en avant les avantages des offres selon le profil du visiteur
- Encourage les visiteurs à rejoindre le programme de partenariat
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