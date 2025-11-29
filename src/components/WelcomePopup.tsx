import { useEffect, useState } from "react";
import { X } from "lucide-react";
import posterImage from "@/assets/poster-agricapital.jpg";

const WelcomePopup = () => {
  const [isOpen, setIsOpen] = useState(false);

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
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={() => setIsOpen(false)}
    >
      <div 
        className="relative bg-background rounded-lg shadow-2xl max-w-3xl w-full animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute -top-3 -right-3 bg-agri-orange text-white rounded-full p-2 hover:bg-agri-orange/90 transition-smooth shadow-lg z-10"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="overflow-hidden rounded-lg">
          <img
            src={posterImage}
            alt="Bienvenue chez AgriCapital"
            className="w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default WelcomePopup;
