import { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import WelcomePopup from "@/components/WelcomePopup";
import Ambitions from "@/components/Ambitions";
import About from "@/components/About";
import Approach from "@/components/Approach";
import Impact from "@/components/Impact";
import IvoryCoastMap from "@/components/IvoryCoastMap";
import Milestones from "@/components/Milestones";
import Founder from "@/components/Founder";
import Partnership from "@/components/Partnership";
import TestimonialsDisplay from "@/components/TestimonialsDisplay";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { useLanguage, Language } from "@/contexts/LanguageContext";

const sectionMap: Record<string, string> = {
  'accueil': 'accueil',
  'home': 'accueil',
  'a-propos': 'apropos',
  'about': 'apropos',
  'apropos': 'apropos',
  'notre-approche': 'approche',
  'approach': 'approche',
  'approche': 'approche',
  'impact': 'impact',
  'jalons': 'jalons',
  'milestones': 'jalons',
  'fondateur': 'fondateur',
  'founder': 'fondateur',
  'partenariat': 'partenariat',
  'partnership': 'partenariat',
  'temoignages': 'temoignages',
  'testimonials': 'temoignages',
  'contact': 'contact',
};

const supportedLanguages: Language[] = ['fr', 'en', 'ar', 'es', 'de', 'zh'];

const HomePage = () => {
  const { lang, section } = useParams();
  const location = useLocation();
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    // Handle language from URL parameter - this is critical for SEO
    const pathParts = location.pathname.split('/').filter(Boolean);
    const firstPart = pathParts[0];
    
    // Check if first part is a language code
    if (firstPart && supportedLanguages.includes(firstPart as Language)) {
      if (language !== firstPart) {
        setLanguage(firstPart as Language);
      }
    } else if (lang && supportedLanguages.includes(lang as Language)) {
      if (language !== lang) {
        setLanguage(lang as Language);
      }
    }
  }, [lang, location.pathname, setLanguage, language]);

  useEffect(() => {
    // Determine section from URL
    let targetSection: string | null = null;
    
    // Check if section is passed via params
    if (section) {
      targetSection = sectionMap[section.toLowerCase()];
    } else {
      // Extract section from pathname (e.g., /impact, /a-propos)
      const pathParts = location.pathname.split('/').filter(Boolean);
      // Skip language code if present
      const sectionPart = supportedLanguages.includes(pathParts[0] as Language) 
        ? pathParts[1] 
        : pathParts[0];
      
      if (sectionPart && sectionMap[sectionPart.toLowerCase()]) {
        targetSection = sectionMap[sectionPart.toLowerCase()];
      }
    }

    if (targetSection) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        const element = document.getElementById(targetSection!);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [section, location.pathname]);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden max-w-full">
      <SEOHead />
      <WelcomePopup />
      <Navigation />
      <Hero />
      <Ambitions />
      <About />
      <Approach />
      <Impact />
      <IvoryCoastMap />
      <Milestones />
      <Founder />
      <Partnership />
      <TestimonialsDisplay />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
};

export default HomePage;
