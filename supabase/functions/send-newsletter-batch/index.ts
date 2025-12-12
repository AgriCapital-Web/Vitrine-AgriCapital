import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NewsletterRequest {
  subject: string;
  html: string;
  includeTestimonials?: boolean;
}

const sendEmail = async (apiKey: string, to: string, subject: string, html: string) => {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "AgriCapital <onboarding@resend.dev>",
      to: [to],
      subject,
      html,
    }),
  });
  return response.ok;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify admin access
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Non autorisé" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Non autorisé" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { subject, html, includeTestimonials }: NewsletterRequest = await req.json();

    // Get all active subscribers
    const { data: subscribers, error: subError } = await supabase
      .from('newsletter_subscribers')
      .select('email')
      .eq('is_active', true);

    if (subError) throw subError;

    // Get testimonial emails if requested
    let testimonialEmails: string[] = [];
    if (includeTestimonials) {
      const { data: testimonials } = await supabase
        .from('testimonials')
        .select('email')
        .not('email', 'is', null);
      
      if (testimonials) {
        testimonialEmails = testimonials.map(t => t.email).filter(Boolean) as string[];
      }
    }

    // Combine and deduplicate emails
    const allEmails = [...new Set([
      ...(subscribers?.map(s => s.email) || []),
      ...testimonialEmails,
    ])];

    if (allEmails.length === 0) {
      return new Response(JSON.stringify({ error: "Aucun destinataire trouvé" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Format HTML with branding
    const formattedHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #166534, #14532d); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">🌴 AgriCapital</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 5px 0 0;">Le partenaire idéal des producteurs agricoles</p>
        </div>
        <div style="padding: 30px; background: #ffffff;">
          ${html}
        </div>
        <div style="background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e5e5e5;">
          <p style="color: #666; font-size: 12px; margin: 0;">
            AgriCapital - Côte d'Ivoire<br/>
            <a href="https://agricapital.ci" style="color: #166534;">www.agricapital.ci</a> | 
            <a href="tel:+22505655517" style="color: #166534;">05 65 55 17 17</a>
          </p>
        </div>
      </div>
    `;

    let successCount = 0;
    let failCount = 0;

    // Send emails in batches
    for (const email of allEmails) {
      try {
        const sent = await sendEmail(RESEND_API_KEY, email, subject, formattedHtml);
        if (sent) successCount++;
        else failCount++;
      } catch {
        failCount++;
      }
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`Newsletter sent: ${successCount} success, ${failCount} failed`);

    return new Response(JSON.stringify({ 
      success: true, 
      totalSent: successCount,
      totalFailed: failCount,
      totalRecipients: allEmails.length,
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error sending newsletter:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
