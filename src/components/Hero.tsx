import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import heroImage from "@/assets/palm-oil-production.jpg";

const Hero = () => {
  const { t } = useLanguage();
  
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="accueil" className="relative min-h-screen flex items-center justify-center pt-20">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Plantation de palmiers à huile en production"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-hero"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block px-6 py-3 bg-accent/20 backdrop-blur-sm rounded-full mb-6">
            <p className="text-agri-orange font-semibold text-sm md:text-base">{t.hero.badge}</p>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            {t.hero.title}
          </h1>
          
          <p className="text-base md:text-lg text-white/80 mb-10 max-w-3xl mx-auto">
            {t.hero.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={() => scrollToSection("approche")}
              className="bg-white hover:bg-white/90 text-agri-green border-0 shadow-medium transition-smooth group w-full sm:w-auto"
            >
              {t.hero.btnApproach}
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              onClick={() => scrollToSection("partenariat")}
              className="bg-accent hover:bg-accent/90 text-white border-0 shadow-medium transition-smooth w-full sm:w-auto"
            >
              {t.hero.btnPartner}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
