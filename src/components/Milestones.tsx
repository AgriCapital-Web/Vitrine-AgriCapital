import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import jalonImage1 from "@/assets/jalon-1.jpg";
import jalonImage2 from "@/assets/jalon-2.jpg";
import jalonImage3 from "@/assets/jalon-3.jpg";
import jalonImage4 from "@/assets/jalon-4.jpg";
import jalonImage5 from "@/assets/jalon-5.jpg";
import jalonImage6 from "@/assets/jalon-6.jpg";
import jalonImage7 from "@/assets/jalon-7.jpg";

const Milestones = () => {
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const galleryImages = [
    jalonImage1,
    jalonImage2,
    jalonImage3,
    jalonImage4,
    jalonImage5,
    jalonImage6,
    jalonImage7,
  ];

  return (
    <section id="jalons" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t.milestones.title}
          </h2>
        </div>

        <Card className="bg-card border-border mb-8">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-agri-green mb-4">
              {t.milestones.eventTitle}
            </h3>
            
            <div className="prose max-w-none text-muted-foreground space-y-4">
              <p>{t.milestones.description1}</p>
              <p>{t.milestones.description2}</p>
              <p>{t.milestones.description3}</p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-12">
          <h4 className="text-xl font-bold text-foreground mb-6 text-center">
            {t.milestones.galleryTitle}
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className="cursor-pointer overflow-hidden rounded-lg hover:shadow-medium transition-smooth"
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={image}
                  alt={`Lancement ${index + 1}`}
                  className="w-full h-48 object-cover hover:scale-105 transition-smooth"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Agrandir"
              className="w-full h-auto"
            />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Milestones;
