import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Language } from "@/lib/translations";

interface SEOData {
  title: string;
  description: string;
  keywords: string;
}

const seoTranslations: Record<Language, SEOData> = {
  fr: {
    title: "AgriCapital - Le partenaire idéal des producteurs agricoles en Côte d'Ivoire",
    description: "AgriCapital propose un modèle innovant d'accompagnement agricole permettant aux petits producteurs et propriétaires terriens d'accéder à la filière palmier à huile sans barrière financière. Basé à Daloa, Haut-Sassandra.",
    keywords: "AgriCapital, Côte d'Ivoire, Daloa, Haut-Sassandra, SARL, modèle innovant, innovation agricole, accompagnement agricole, services intégrés, débouché commercial, garantie rachat, petits producteurs agricoles, propriétaires terriens, palmier à huile, filière palmier à huile, création de plantations, gestion de terres, valorisation de terres agricoles, encadrement technique agricole, développement rural, agriculture durable, pépinière palmier à huile, suivi technique plantations, Inocent KOFFI",
  },
  en: {
    title: "AgriCapital - The ideal partner for agricultural producers in Côte d'Ivoire",
    description: "AgriCapital offers an innovative agricultural support model enabling small producers and landowners to access the oil palm industry without financial barriers. Based in Daloa, Haut-Sassandra.",
    keywords: "AgriCapital, Côte d'Ivoire, Daloa, Haut-Sassandra, innovative model, agricultural innovation, agricultural support, integrated services, commercial outlet, buyback guarantee, small agricultural producers, landowners, oil palm, oil palm industry, plantation creation, land management, agricultural land development, technical agricultural supervision, rural development, sustainable agriculture, oil palm nursery, plantation technical monitoring, Inocent KOFFI",
  },
  ar: {
    title: "أجري كابيتال - الشريك المثالي للمنتجين الزراعيين في كوت ديفوار",
    description: "تقدم أجري كابيتال نموذجًا مبتكرًا للدعم الزراعي يمكّن صغار المنتجين وأصحاب الأراضي من الوصول إلى صناعة زيت النخيل دون حواجز مالية. مقرها في دالوا، أعالي ساساندرا.",
    keywords: "أجري كابيتال، كوت ديفوار، دالوا، أعالي ساساندرا، نموذج مبتكر، ابتكار زراعي، دعم زراعي، خدمات متكاملة، منفذ تجاري، ضمان إعادة الشراء، صغار المنتجين الزراعيين، أصحاب الأراضي، زيت النخيل، صناعة زيت النخيل، إنشاء المزارع، إدارة الأراضي، تطوير الأراضي الزراعية، الإشراف الفني الزراعي، التنمية الريفية، الزراعة المستدامة، مشتل زيت النخيل، إينوسنت كوفي",
  },
  es: {
    title: "AgriCapital - El socio ideal de los productores agrícolas en Costa de Marfil",
    description: "AgriCapital ofrece un modelo innovador de apoyo agrícola que permite a los pequeños productores y propietarios de tierras acceder a la industria del aceite de palma sin barreras financieras. Con sede en Daloa, Haut-Sassandra.",
    keywords: "AgriCapital, Costa de Marfil, Daloa, Haut-Sassandra, modelo innovador, innovación agrícola, apoyo agrícola, servicios integrados, salida comercial, garantía de recompra, pequeños productores agrícolas, propietarios de tierras, aceite de palma, industria del aceite de palma, creación de plantaciones, gestión de tierras, desarrollo de tierras agrícolas, supervisión técnica agrícola, desarrollo rural, agricultura sostenible, vivero de palma de aceite, Inocent KOFFI",
  },
  de: {
    title: "AgriCapital - Der ideale Partner für landwirtschaftliche Produzenten in der Elfenbeinküste",
    description: "AgriCapital bietet ein innovatives landwirtschaftliches Unterstützungsmodell, das Kleinbauern und Landbesitzern den Zugang zur Palmölindustrie ohne finanzielle Barrieren ermöglicht. Mit Sitz in Daloa, Haut-Sassandra.",
    keywords: "AgriCapital, Elfenbeinküste, Daloa, Haut-Sassandra, innovatives Modell, landwirtschaftliche Innovation, landwirtschaftliche Unterstützung, integrierte Dienstleistungen, kommerzieller Absatz, Rückkaufgarantie, kleine landwirtschaftliche Produzenten, Landbesitzer, Palmöl, Palmölindustrie, Plantagen-Erstellung, Landmanagement, landwirtschaftliche Landentwicklung, technische landwirtschaftliche Überwachung, ländliche Entwicklung, nachhaltige Landwirtschaft, Palmöl-Baumschule, Inocent KOFFI",
  },
  zh: {
    title: "农业资本 - 科特迪瓦农业生产者的理想合作伙伴",
    description: "农业资本提供创新的农业支持模式，使小型生产者和土地所有者能够无需金融障碍进入油棕产业。总部位于达洛阿，上萨桑德拉地区。",
    keywords: "农业资本, 科特迪瓦, 达洛阿, 上萨桑德拉, 创新模式, 农业创新, 农业支持, 综合服务, 商业出口, 回购保证, 小型农业生产者, 土地所有者, 油棕, 油棕产业, 种植园创建, 土地管理, 农业土地开发, 农业技术监督, 农村发展, 可持续农业, 油棕苗圃, 伊诺森特·科菲",
  },
};

const localeMap: Record<Language, string> = {
  fr: "fr_FR",
  en: "en_US",
  ar: "ar_SA",
  es: "es_ES",
  de: "de_DE",
  zh: "zh_CN",
};

const languages: Language[] = ["fr", "en", "ar", "es", "de", "zh"];

const SEOHead = () => {
  const { language } = useLanguage();
  
  useEffect(() => {
    const seo = seoTranslations[language] || seoTranslations.fr;
    const locale = localeMap[language] || "fr_FR";
    const baseUrl = "https://agricapital.ci";
    const currentUrl = language === "fr" ? baseUrl : `${baseUrl}/${language}`;
    
    // Update document title
    document.title = seo.title;
    
    // Update or create meta tags
    const updateMeta = (name: string, content: string, property = false) => {
      const attr = property ? "property" : "name";
      let meta = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };
    
    // Update or create link tags
    const updateLink = (rel: string, href: string, hreflang?: string) => {
      const selector = hreflang 
        ? `link[rel="${rel}"][hreflang="${hreflang}"]` 
        : `link[rel="${rel}"]`;
      let link = document.querySelector(selector) as HTMLLinkElement;
      if (!link) {
        link = document.createElement("link");
        link.rel = rel;
        if (hreflang) link.hreflang = hreflang;
        document.head.appendChild(link);
      }
      link.href = href;
    };
    
    // Primary meta tags
    updateMeta("title", seo.title);
    updateMeta("description", seo.description);
    updateMeta("keywords", seo.keywords);
    
    // Open Graph
    updateMeta("og:title", seo.title, true);
    updateMeta("og:description", seo.description, true);
    updateMeta("og:url", currentUrl, true);
    updateMeta("og:locale", locale, true);
    updateMeta("og:image", `${baseUrl}/og-image.png`, true);
    
    // Twitter
    updateMeta("twitter:title", seo.title);
    updateMeta("twitter:description", seo.description);
    updateMeta("twitter:url", currentUrl);
    updateMeta("twitter:image", `${baseUrl}/og-image.png`);
    
    // Update canonical
    updateLink("canonical", currentUrl);
    
    // Update hreflang tags dynamically
    languages.forEach((lang) => {
      const langUrl = lang === "fr" ? baseUrl : `${baseUrl}/${lang}`;
      updateLink("alternate", langUrl, lang);
    });
    updateLink("alternate", baseUrl, "x-default");
    
    // Update html lang attribute
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    
  }, [language]);
  
  return null;
};

export default SEOHead;
