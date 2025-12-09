import { useEffect, useState } from "react";
import { X, Sprout, Users, TrendingUp, Shield } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Language } from "@/lib/translations";

interface PopupTranslation {
  title: string;
  subtitle: string;
  description: string;
  features: { icon: string; text: string }[];
  cta: string;
  close: string;
}

const popupTranslations: Record<Language, PopupTranslation> = {
  fr: {
    title: "Bienvenue chez AgriCapital",
    subtitle: "Le partenaire idéal des producteurs agricoles",
    description: "Découvrez notre modèle innovant d'accompagnement agricole qui permet à tous d'accéder à la filière palmier à huile sans barrière financière.",
    features: [
      { icon: "sprout", text: "Pépinière de 500 000 plants" },
      { icon: "users", text: "Accompagnement personnalisé" },
      { icon: "trending", text: "Garantie de rachat 20 ans" },
      { icon: "shield", text: "Sans apport initial" },
    ],
    cta: "Découvrir notre projet",
    close: "Fermer",
  },
  en: {
    title: "Welcome to AgriCapital",
    subtitle: "The ideal partner for agricultural producers",
    description: "Discover our innovative agricultural support model that enables everyone to access the oil palm industry without financial barriers.",
    features: [
      { icon: "sprout", text: "500,000 plant nursery" },
      { icon: "users", text: "Personalized support" },
      { icon: "trending", text: "20-year buyback guarantee" },
      { icon: "shield", text: "No initial investment" },
    ],
    cta: "Discover our project",
    close: "Close",
  },
  ar: {
    title: "مرحبًا بكم في أجري كابيتال",
    subtitle: "الشريك المثالي للمنتجين الزراعيين",
    description: "اكتشف نموذجنا المبتكر للدعم الزراعي الذي يمكّن الجميع من الوصول إلى صناعة زيت النخيل دون حواجز مالية.",
    features: [
      { icon: "sprout", text: "مشتل ٥٠٠٬٠٠٠ شتلة" },
      { icon: "users", text: "دعم مخصص" },
      { icon: "trending", text: "ضمان إعادة الشراء ٢٠ عامًا" },
      { icon: "shield", text: "بدون استثمار أولي" },
    ],
    cta: "اكتشف مشروعنا",
    close: "إغلاق",
  },
  es: {
    title: "Bienvenido a AgriCapital",
    subtitle: "El socio ideal de los productores agrícolas",
    description: "Descubra nuestro innovador modelo de apoyo agrícola que permite a todos acceder a la industria del aceite de palma sin barreras financieras.",
    features: [
      { icon: "sprout", text: "Vivero de 500.000 plantas" },
      { icon: "users", text: "Acompañamiento personalizado" },
      { icon: "trending", text: "Garantía de recompra 20 años" },
      { icon: "shield", text: "Sin inversión inicial" },
    ],
    cta: "Descubrir nuestro proyecto",
    close: "Cerrar",
  },
  de: {
    title: "Willkommen bei AgriCapital",
    subtitle: "Der ideale Partner für landwirtschaftliche Produzenten",
    description: "Entdecken Sie unser innovatives landwirtschaftliches Unterstützungsmodell, das allen den Zugang zur Palmölindustrie ohne finanzielle Barrieren ermöglicht.",
    features: [
      { icon: "sprout", text: "Baumschule mit 500.000 Pflanzen" },
      { icon: "users", text: "Persönliche Betreuung" },
      { icon: "trending", text: "20-Jahres-Rückkaufgarantie" },
      { icon: "shield", text: "Ohne Anfangsinvestition" },
    ],
    cta: "Unser Projekt entdecken",
    close: "Schließen",
  },
  zh: {
    title: "欢迎来到农业资本",
    subtitle: "农业生产者的理想合作伙伴",
    description: "探索我们创新的农业支持模式，使每个人都能无金融障碍地进入油棕产业。",
    features: [
      { icon: "sprout", text: "五十万株苗圃" },
      { icon: "users", text: "个性化支持" },
      { icon: "trending", text: "二十年回购保证" },
      { icon: "shield", text: "无需初始投资" },
    ],
    cta: "了解我们的项目",
    close: "关闭",
  },
};

const getIcon = (iconName: string) => {
  const iconClass = "w-5 h-5 text-agri-green";
  switch (iconName) {
    case "sprout": return <Sprout className={iconClass} />;
    case "users": return <Users className={iconClass} />;
    case "trending": return <TrendingUp className={iconClass} />;
    case "shield": return <Shield className={iconClass} />;
    default: return <Sprout className={iconClass} />;
  }
};

const WelcomePopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();
  const t = popupTranslations[language] || popupTranslations.fr;
  const isRTL = language === "ar";

  useEffect(() => {
    const hasVisited = sessionStorage.getItem("hasVisitedAgriCapital");
    
    if (!hasVisited) {
      setIsOpen(true);
      sessionStorage.setItem("hasVisitedAgriCapital", "true");
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-[100000] flex items-center justify-center p-2 sm:p-4 animate-fade-in"
      onClick={() => setIsOpen(false)}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div 
        className="relative bg-gradient-to-br from-background via-background to-secondary/30 rounded-2xl shadow-2xl w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-lg animate-scale-in overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-agri-green to-agri-green-dark p-6 text-white relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full" />
          <div className="absolute -bottom-5 -left-5 w-20 h-20 bg-white/10 rounded-full" />
          
          <button
            onClick={() => setIsOpen(false)}
            className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-all hover:scale-110 active:scale-95 z-10`}
            aria-label={t.close}
          >
            <X className="w-5 h-5" strokeWidth={3} />
          </button>
          
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">{t.title}</h2>
            <p className="text-white/90 text-sm sm:text-base">{t.subtitle}</p>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-5">
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            {t.description}
          </p>
          
          {/* Features grid */}
          <div className="grid grid-cols-2 gap-3">
            {t.features.map((feature, index) => (
              <div 
                key={index}
                className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg"
              >
                {getIcon(feature.icon)}
                <span className="text-xs sm:text-sm font-medium text-foreground">{feature.text}</span>
              </div>
            ))}
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => setIsOpen(false)}
              className="flex-1 py-3 bg-agri-orange hover:bg-agri-orange/90 text-white font-semibold rounded-lg transition-all active:scale-98 shadow-lg hover:shadow-xl"
            >
              {t.cta}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="sm:hidden py-2.5 border border-border text-muted-foreground font-medium rounded-lg hover:bg-secondary transition-all flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              {t.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePopup;
