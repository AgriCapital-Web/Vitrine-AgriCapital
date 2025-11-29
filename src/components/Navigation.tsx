import { useState } from "react";
import { Menu, X, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import logo from "@/assets/logo.png";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === "fr" ? "en" : "fr");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection("accueil")}>
            <img src={logo} alt="AgriCapital" className="h-12" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => scrollToSection("accueil")}
              className="text-foreground hover:text-primary transition-smooth font-medium"
            >
              {t.nav.home}
            </button>
            <button
              onClick={() => scrollToSection("apropos")}
              className="text-foreground hover:text-primary transition-smooth font-medium"
            >
              {t.nav.about}
            </button>
            <button
              onClick={() => scrollToSection("approche")}
              className="text-foreground hover:text-primary transition-smooth font-medium"
            >
              {t.nav.approach}
            </button>
            <button
              onClick={() => scrollToSection("impact")}
              className="text-foreground hover:text-primary transition-smooth font-medium"
            >
              {t.nav.impact}
            </button>
            <button
              onClick={() => scrollToSection("partenariat")}
              className="text-foreground hover:text-primary transition-smooth font-medium"
            >
              {t.nav.partnership}
            </button>
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 text-foreground hover:text-primary transition-smooth font-medium"
              aria-label="Toggle language"
            >
              <Globe size={18} />
              <span className="uppercase">{language}</span>
            </button>
            <Button
              onClick={() => scrollToSection("contact")}
              className="bg-gradient-accent border-0 text-white hover:opacity-90 transition-smooth"
            >
              {t.nav.contact}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              <button
                onClick={() => scrollToSection("accueil")}
                className="text-foreground hover:text-primary transition-smooth font-medium text-left"
              >
                {t.nav.home}
              </button>
              <button
                onClick={() => scrollToSection("apropos")}
                className="text-foreground hover:text-primary transition-smooth font-medium text-left"
              >
                {t.nav.about}
              </button>
              <button
                onClick={() => scrollToSection("approche")}
                className="text-foreground hover:text-primary transition-smooth font-medium text-left"
              >
                {t.nav.approach}
              </button>
              <button
                onClick={() => scrollToSection("impact")}
                className="text-foreground hover:text-primary transition-smooth font-medium text-left"
              >
                {t.nav.impact}
              </button>
              <button
                onClick={() => scrollToSection("partenariat")}
                className="text-foreground hover:text-primary transition-smooth font-medium text-left"
              >
                {t.nav.partnership}
              </button>
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 text-foreground hover:text-primary transition-smooth font-medium"
              >
                <Globe size={18} />
                <span className="uppercase">{language}</span>
              </button>
              <Button
                onClick={() => scrollToSection("contact")}
                className="bg-gradient-accent border-0 text-white hover:opacity-90 transition-smooth w-full"
              >
                {t.nav.contact}
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
