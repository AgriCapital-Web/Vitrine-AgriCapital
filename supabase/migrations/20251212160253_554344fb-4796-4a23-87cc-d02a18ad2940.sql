-- Tables pour les logs AI et emails
CREATE TABLE IF NOT EXISTS public.ai_chat_logs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT NOT NULL,
    user_message TEXT NOT NULL,
    assistant_response TEXT NOT NULL,
    language TEXT DEFAULT 'fr',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.email_logs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    recipient_email TEXT NOT NULL,
    recipient_name TEXT,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    sent_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    template_id UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.email_templates (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    variables JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.email_signatures (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    content TEXT NOT NULL,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.email_recipients (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL,
    name TEXT,
    group_name TEXT DEFAULT 'general',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.partnerships (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    description TEXT,
    benefits TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    partner_count INTEGER DEFAULT 0,
    logo_url TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ai_chat_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partnerships ENABLE ROW LEVEL SECURITY;

-- Policies for ai_chat_logs (public insert, admin read)
CREATE POLICY "Public can insert chat logs" ON public.ai_chat_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can view chat logs" ON public.ai_chat_logs FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admin can delete chat logs" ON public.ai_chat_logs FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Policies for email_logs (admin full access)
CREATE POLICY "Admin full access email_logs" ON public.email_logs FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Policies for email_templates (admin full access)
CREATE POLICY "Admin full access email_templates" ON public.email_templates FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Policies for email_signatures (admin full access)
CREATE POLICY "Admin full access email_signatures" ON public.email_signatures FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Policies for email_recipients (admin full access)
CREATE POLICY "Admin full access email_recipients" ON public.email_recipients FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Policies for partnerships (public read active, admin full)
CREATE POLICY "Public can read active partnerships" ON public.partnerships FOR SELECT USING (status = 'active');
CREATE POLICY "Admin full access partnerships" ON public.partnerships FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Triggers for updated_at
CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON public.email_templates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_email_signatures_updated_at BEFORE UPDATE ON public.email_signatures FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_partnerships_updated_at BEFORE UPDATE ON public.partnerships FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default partnerships data
INSERT INTO public.partnerships (name, type, description, benefits, status, partner_count) VALUES
('Propriétaires Terriens', 'Partenaire Foncier', 'Mise à disposition de terres agricoles pour la création de plantations de palmiers à huile.', 'Revenus passifs, valorisation du patrimoine foncier, développement local', 'active', 150),
('Petits Producteurs', 'Partenaire Agricole', 'Accompagnement technique et financier pour la production de palmier à huile.', 'Formation, financement, garantie de rachat, encadrement technique', 'active', 200),
('Investisseurs', 'Partenaire Financier', 'Participation au financement des projets agricoles avec retour sur investissement.', 'Rentabilité attractive, impact social, diversification de portefeuille', 'active', 50),
('Organismes de Développement', 'Partenaire Institutionnel', 'Collaboration avec les institutions pour le développement rural.', 'Impact communautaire, développement durable, formation professionnelle', 'active', 5);