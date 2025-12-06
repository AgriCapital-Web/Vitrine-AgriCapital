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
import { useLanguage } from "@/contexts/LanguageContext";

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

const HomePage = () => {
  const { lang, section } = useParams();
  const location = useLocation();
  const { setLanguage } = useLanguage();

  useEffect(() => {
    // Handle language from URL parameter
    if (lang && ['fr', 'en', 'ar', 'es', 'de', 'zh'].includes(lang)) {
      setLanguage(lang as any);
    }
  }, [lang, setLanguage]);

  useEffect(() => {
    // Determine section from URL
    let targetSection: string | null = null;
    
    // Check if section is passed via params
    if (section) {
      targetSection = sectionMap[section.toLowerCase()];
    } else {
      // Extract section from pathname (e.g., /impact, /a-propos)
      const pathSection = location.pathname.split('/').filter(Boolean)[0];
      if (pathSection && sectionMap[pathSection.toLowerCase()]) {
        targetSection = sectionMap[pathSection.toLowerCase()];
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
