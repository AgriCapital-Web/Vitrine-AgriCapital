import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import founderImage from "@/assets/founder-inocent-koffi.jpg";

const Founder = () => {
  const { t } = useLanguage();

  return (
    <section id="fondateur" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t.founder.title}
          </h2>
          <p className="text-xl text-agri-orange font-semibold">
            {t.founder.subtitle}
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-12">
          <p className="text-muted-foreground text-lg leading-relaxed mb-4">
            {t.founder.intro}
          </p>
          <p className="text-muted-foreground text-lg leading-relaxed">
            {t.founder.mission}
          </p>
        </div>

        <Card className="max-w-5xl mx-auto bg-card border-border">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-3 gap-8 items-start">
              <div className="md:col-span-1 flex justify-center">
                <div className="relative">
                  <img
                    src={founderImage}
                    alt={t.founder.name}
                    className="w-64 h-64 object-cover rounded-lg shadow-lg"
                    loading="lazy"
                  />
                </div>
              </div>

              <div className="md:col-span-2 space-y-4">
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold text-foreground mb-1">
                    {t.founder.name}
                  </h3>
                  <p className="text-lg text-agri-orange font-semibold mb-2">
                    {t.founder.position}
                  </p>
                  <p className="text-sm text-muted-foreground italic mb-4">
                    {t.founder.signature}
                  </p>
                </div>

                <div className="border-l-4 border-agri-green pl-6 py-2">
                  <blockquote className="text-muted-foreground italic space-y-3 text-base leading-relaxed">
                    <p>{t.founder.quote.part1}</p>
                    <p>{t.founder.quote.part2}</p>
                    <p>{t.founder.quote.part3}</p>
                    <p className="font-bold text-foreground not-italic">
                      {t.founder.quote.part4}
                    </p>
                  </blockquote>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Founder;
