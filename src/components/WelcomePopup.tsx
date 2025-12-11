import { useEffect, useState } from "react";
import { X, Phone, Mail, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Language } from "@/lib/translations";
import posterImage from "@/assets/poster-agricapital.png";

interface PopupTranslation {
  line1: string;
  line2: string;
  line3: string;
  line4: string;
  line5: string;
  tagline: string;
  description: string;
  prosperity: string;
  hectare: string;
  cta: string;
  slogan: string;
}

const popupTranslations: Record<Language, PopupTranslation> = {
  fr: {
    line1: "Avec nous",
    line2: "vos",
    line3: "TERRES",
    line4: "Reprennent",
    line5: "vie",
    tagline: "Avec AgriCapital,",
    description: "devenez planteur de palmier à huile et faisons pousser votre",
    prosperity: "prospérité",
    hectare: "hectare après hectare",
    cta: "NOUS CONTACTER",
    slogan: "Le partenaire idéal des producteurs agricoles"
  },
  en: {
    line1: "With us",
    line2: "your",
    line3: "LANDS",
    line4: "Come back",
    line5: "to life",
    tagline: "With AgriCapital,",
    description: "become an oil palm grower and let us grow your",
    prosperity: "prosperity",
    hectare: "hectare after hectare",
    cta: "CONTACT US",
    slogan: "The ideal partner for agricultural producers"
  },
  ar: {
    line1: "معنا",
    line2: "أراضيكم",
    line3: "تعود",
    line4: "إلى",
    line5: "الحياة",
    tagline: "مع أجريكابيتال،",
    description: "كن مزارع نخيل زيت ودعنا ننمي",
    prosperity: "ازدهارك",
    hectare: "هكتار بعد هكتار",
    cta: "اتصل بنا",
    slogan: "الشريك المثالي للمنتجين الزراعيين"
  },
  es: {
    line1: "Con nosotros",
    line2: "sus",
    line3: "TIERRAS",
    line4: "Vuelven",
    line5: "a la vida",
    tagline: "Con AgriCapital,",
    description: "conviértase en cultivador de palma aceitera y hagamos crecer su",
    prosperity: "prosperidad",
    hectare: "hectárea tras hectárea",
    cta: "CONTÁCTENOS",
    slogan: "El socio ideal de los productores agrícolas"
  },
  de: {
    line1: "Mit uns",
    line2: "erwachen Ihre",
    line3: "LÄNDER",
    line4: "wieder",
    line5: "zum Leben",
    tagline: "Mit AgriCapital,",
    description: "werden Sie Ölpalmen-Pflanzer und lassen Sie uns Ihren",
    prosperity: "Wohlstand",
    hectare: "Hektar für Hektar",
    cta: "KONTAKT",
    slogan: "Der ideale Partner für Landwirtschaftsproduzenten"
  },
  zh: {
    line1: "与我们一起",
    line2: "您的",
    line3: "土地",
    line4: "重获",
    line5: "新生",
    tagline: "与AgriCapital一起，",
    description: "成为油棕种植者，让我们一起培育您的",
    prosperity: "繁荣",
    hectare: "一公顷接一公顷",
    cta: "联系我们",
    slogan: "农业生产者的理想合作伙伴"
  }
};

const WelcomePopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();
  const t = popupTranslations[language] || popupTranslations.fr;
  const isRTL = language === "ar";

  useEffect(() => {
    // Use a new key to force showing the updated popup
    const hasVisited = sessionStorage.getItem("agricapital_popup_v2");
    
    if (!hasVisited) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem("agricapital_popup_v2", "true");
      }, 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const scrollToContact = () => {
    setIsOpen(false);
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 z-[100000] flex items-center justify-center p-2 sm:p-4 animate-fade-in backdrop-blur-sm"
      onClick={() => setIsOpen(false)}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div 
        className="relative w-full max-w-[95vw] sm:max-w-md md:max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-scale-in"
        style={{
          background: 'linear-gradient(135deg, #166534 0%, #14532d 50%, #0f3d1f 100%)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'} z-20 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all hover:scale-110`}
          aria-label="Fermer"
        >
          <X className="w-5 h-5 text-white" strokeWidth={3} />
        </button>

        {/* Decorative golden curve */}
        <div 
          className="absolute top-0 right-0 w-1/2 h-full pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(218, 165, 32, 0.35) 0%, rgba(218, 165, 32, 0.1) 100%)',
            clipPath: 'ellipse(100% 80% at 100% 50%)'
          }}
        />

        <div className="relative z-10 p-5 sm:p-6 md:p-8">
          {/* Logo & Slogan */}
          <div className={`flex items-center gap-2 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="flex items-center gap-1">
              <span className="text-xl sm:text-2xl">🌴</span>
              <div className="flex items-baseline">
                <span className="text-white font-bold text-base sm:text-lg">Agri</span>
                <span className="text-amber-400 font-bold text-base sm:text-lg">Capital</span>
              </div>
            </div>
            <span className="text-white/70 text-[10px] sm:text-xs ml-1 hidden sm:block max-w-[140px] leading-tight">
              {t.slogan}
            </span>
          </div>

          {/* Main headline - matching poster design */}
          <div className={`mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
            <p 
              className="text-white text-2xl sm:text-3xl md:text-4xl font-bold leading-tight"
              style={{ fontFamily: 'Georgia, Times New Roman, serif' }}
            >
              {t.line1}
            </p>
            <p className="text-white text-lg sm:text-xl md:text-2xl font-medium mt-1">
              {t.line2}
            </p>
            <p 
              className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-wide mt-1"
              style={{ 
                color: '#22c55e',
                textShadow: '2px 2px 4px rgba(0,0,0,0.4)'
              }}
            >
              {t.line3}
            </p>
            <p 
              className="text-xl sm:text-2xl md:text-3xl font-bold italic mt-1"
              style={{ 
                color: '#9ca3af',
                fontFamily: 'Georgia, Times New Roman, serif'
              }}
            >
              {t.line4}
            </p>
            <p 
              className="text-2xl sm:text-3xl md:text-4xl font-extrabold mt-1"
              style={{ 
                color: '#f59e0b',
                textShadow: '2px 2px 4px rgba(0,0,0,0.4)'
              }}
            >
              {t.line5}
            </p>
          </div>

          {/* Dark tagline box - matching poster */}
          <div 
            className="rounded-xl p-3 sm:p-4 mb-4"
            style={{ 
              background: 'linear-gradient(135deg, rgba(55, 65, 81, 0.97) 0%, rgba(31, 41, 55, 0.97) 100%)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
            }}
          >
            <p className="text-white font-bold text-sm sm:text-base mb-1">{t.tagline}</p>
            <p className="text-white/90 text-xs sm:text-sm leading-relaxed">
              {t.description} <span className="text-amber-400 font-semibold">{t.prosperity}</span>, {t.hectare}
            </p>
          </div>

          {/* Image - poster PNG */}
          <div className="flex justify-center mb-4">
            <img 
              src={posterImage} 
              alt="AgriCapital"
              className="w-40 sm:w-48 md:w-56 h-auto object-contain drop-shadow-2xl"
              loading="eager"
            />
          </div>

          {/* CTA Button - matching poster style */}
          <button
            onClick={scrollToContact}
            className="w-full py-3 text-sm sm:text-base font-bold rounded-full transition-all hover:scale-[1.02] active:scale-[0.98] text-white flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #374151 0%, #1f2937 100%)',
              border: '2px solid rgba(255,255,255,0.2)',
              boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
            }}
          >
            {t.cta} <span className="text-lg">→</span>
          </button>

          {/* Contact info - matching poster */}
          <div className="mt-4 flex flex-wrap justify-center gap-2 sm:gap-4 text-white/90 text-[10px] sm:text-xs">
            <div className="flex items-center gap-1">
              <Phone className="w-3 h-3 text-amber-400" />
              <span>05 65 55 17 17</span>
            </div>
            <div className="flex items-center gap-1">
              <Mail className="w-3 h-3 text-amber-400" />
              <span>contact@agricapital.ci</span>
            </div>
            <div className="flex items-center gap-1">
              <Globe className="w-3 h-3 text-amber-400" />
              <span>www.agricapital.ci</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePopup;
