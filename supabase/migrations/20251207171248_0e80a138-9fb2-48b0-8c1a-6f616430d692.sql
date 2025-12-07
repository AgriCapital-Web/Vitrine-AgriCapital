-- Table for site content management
CREATE TABLE public.site_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL DEFAULT 'text',
  content_fr TEXT,
  content_en TEXT,
  content_ar TEXT,
  content_es TEXT,
  content_de TEXT,
  content_zh TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for pages management
CREATE TABLE public.site_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title_fr TEXT NOT NULL,
  title_en TEXT,
  title_ar TEXT,
  title_es TEXT,
  title_de TEXT,
  title_zh TEXT,
  description_fr TEXT,
  description_en TEXT,
  description_ar TEXT,
  description_es TEXT,
  description_de TEXT,
  description_zh TEXT,
  meta_title_fr TEXT,
  meta_title_en TEXT,
  meta_title_ar TEXT,
  meta_title_es TEXT,
  meta_title_de TEXT,
  meta_title_zh TEXT,
  meta_description_fr TEXT,
  meta_description_en TEXT,
  meta_description_ar TEXT,
  meta_description_es TEXT,
  meta_description_de TEXT,
  meta_description_zh TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_home BOOLEAN NOT NULL DEFAULT false,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for sections management
CREATE TABLE public.site_sections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id UUID REFERENCES public.site_pages(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'content',
  content_fr TEXT,
  content_en TEXT,
  content_ar TEXT,
  content_es TEXT,
  content_de TEXT,
  content_zh TEXT,
  settings JSONB DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for media/images
CREATE TABLE public.site_media (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  alt_text_fr TEXT,
  alt_text_en TEXT,
  type TEXT NOT NULL DEFAULT 'image',
  category TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for site settings (logo, favicon, OG, etc)
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  type TEXT NOT NULL DEFAULT 'text',
  category TEXT NOT NULL DEFAULT 'general',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for forms management
CREATE TABLE public.site_forms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  fields JSONB NOT NULL DEFAULT '[]',
  settings JSONB DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for form submissions
CREATE TABLE public.form_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  form_id UUID REFERENCES public.site_forms(id) ON DELETE CASCADE,
  data JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for menu/navigation items
CREATE TABLE public.site_menu (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_id UUID REFERENCES public.site_menu(id) ON DELETE CASCADE,
  label_fr TEXT NOT NULL,
  label_en TEXT,
  label_ar TEXT,
  label_es TEXT,
  label_de TEXT,
  label_zh TEXT,
  url TEXT,
  target TEXT DEFAULT '_self',
  is_active BOOLEAN NOT NULL DEFAULT true,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for contact messages (already may exist)
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_menu ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Public read access for site content
CREATE POLICY "Public can read active content" ON public.site_content FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read active pages" ON public.site_pages FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read active sections" ON public.site_sections FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read active media" ON public.site_media FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public can read active forms" ON public.site_forms FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read active menu" ON public.site_menu FOR SELECT USING (is_active = true);

-- Public can submit forms
CREATE POLICY "Public can submit forms" ON public.form_submissions FOR INSERT WITH CHECK (true);

-- Public can submit contact messages
CREATE POLICY "Public can submit contact" ON public.contact_messages FOR INSERT WITH CHECK (true);

-- Admin full access (using has_role function)
CREATE POLICY "Admin full access site_content" ON public.site_content FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access site_pages" ON public.site_pages FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access site_sections" ON public.site_sections FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access site_media" ON public.site_media FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access site_settings" ON public.site_settings FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access site_forms" ON public.site_forms FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access form_submissions" ON public.form_submissions FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access site_menu" ON public.site_menu FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access contact_messages" ON public.contact_messages FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Triggers for updated_at
CREATE TRIGGER update_site_content_updated_at BEFORE UPDATE ON public.site_content FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_site_pages_updated_at BEFORE UPDATE ON public.site_pages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_site_sections_updated_at BEFORE UPDATE ON public.site_sections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_site_forms_updated_at BEFORE UPDATE ON public.site_forms FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_site_menu_updated_at BEFORE UPDATE ON public.site_menu FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default settings
INSERT INTO public.site_settings (key, value, type, category, description) VALUES
  ('site_name', 'AgriCapital', 'text', 'general', 'Nom du site'),
  ('site_slogan_fr', 'Le partenaire idéal des producteurs agricoles', 'text', 'general', 'Slogan FR'),
  ('site_slogan_en', 'The ideal partner for agricultural producers', 'text', 'general', 'Slogan EN'),
  ('site_slogan_ar', 'الشريك المثالي للمنتجين الزراعيين', 'text', 'general', 'Slogan AR'),
  ('site_slogan_es', 'El socio ideal de los productores agrícolas', 'text', 'general', 'Slogan ES'),
  ('site_slogan_de', 'Der ideale Partner für landwirtschaftliche Produzenten', 'text', 'general', 'Slogan DE'),
  ('site_slogan_zh', '农业生产者的理想合作伙伴', 'text', 'general', 'Slogan ZH'),
  ('logo_url', '/favicon.png', 'image', 'branding', 'Logo principal'),
  ('favicon_url', '/favicon.png', 'image', 'branding', 'Favicon'),
  ('og_image_url', '/og-image.png', 'image', 'seo', 'Image Open Graph'),
  ('primary_color', '#22c55e', 'color', 'design', 'Couleur principale'),
  ('secondary_color', '#f97316', 'color', 'design', 'Couleur secondaire'),
  ('contact_email', 'contact@agricapital.ci', 'text', 'contact', 'Email de contact'),
  ('contact_phone', '+225 05 64 55 17 17', 'text', 'contact', 'Téléphone'),
  ('contact_address', 'Daloa, Région du Haut-Sassandra, Côte d''Ivoire', 'text', 'contact', 'Adresse'),
  ('facebook_url', '', 'url', 'social', 'Facebook'),
  ('twitter_url', '', 'url', 'social', 'Twitter'),
  ('linkedin_url', '', 'url', 'social', 'LinkedIn'),
  ('whatsapp_number', '+22505645517 17', 'text', 'social', 'WhatsApp');