import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import gatheringImage1 from "@/assets/community-meeting-1.jpg";
import gatheringImage2 from "@/assets/community-meeting-2.jpg";
import gatheringImage3 from "@/assets/community-meeting-3.png";
import gatheringImage4 from "@/assets/community-meeting-4.jpg";
import gatheringImage5 from "@/assets/community-meeting-5.jpg";
import gatheringImage6 from "@/assets/community-meeting-6.jpg";
import gatheringImage7 from "@/assets/community-meeting-7.jpg";
import gatheringImage8 from "@/assets/community-meeting-8.jpg";
import { useLanguage } from "@/contexts/LanguageContext";

const Impact = () => {
  const { t } = useLanguage();
  
  const results = [
    { number: t.impact.results.communities.title, label: t.impact.results.communities.desc },
    { number: t.impact.results.land.title, label: t.impact.results.land.desc },
    { number: t.impact.results.localities.title, label: t.impact.results.localities.desc },
    { number: t.impact.results.years.title, label: t.impact.results.years.desc },
  ];

  const timeline = [
    { date: t.impact.timeline.launch.date, description: t.impact.timeline.launch.desc, icon: "🚀" },
    { date: t.impact.timeline.plantation.date, description: t.impact.timeline.plantation.desc, icon: "🌱" },
    { date: t.impact.timeline.official.date, description: t.impact.timeline.official.desc, icon: "📈" },
  ];

  return (
    <section id="impact" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t.impact.title}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t.impact.subtitle}
          </p>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16">
          {results.map((result, index) => (
            <Card key={index} className="bg-gradient-primary border-0">
              <CardContent className="p-4 md:p-6 text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
                  {result.number}
                </div>
                <p className="text-xs sm:text-sm md:text-base text-white/90 font-medium leading-tight break-words">
                  {result.label}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Study Results */}
        <div className="mb-16 bg-secondary/30 rounded-2xl p-6 md:p-8 lg:p-12">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
            {t.impact.results.title}
          </h3>
          <div className="space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed">
            <p>{t.impact.results.description1}</p>
            <p className="font-semibold text-foreground">
              {t.impact.results.description2}
            </p>
          </div>
        </div>

        {/* Community Gatherings Gallery */}
        <div className="mb-16">
          <h4 className="text-xl md:text-2xl font-bold text-foreground mb-6 text-center">
            {t.impact.galleryTitle}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-2xl overflow-hidden shadow-medium">
              <img
                src={gatheringImage1}
                alt={t.impact.galleryTitle + " 1"}
                className="w-full h-[300px] object-cover"
                loading="lazy"
              />
            </div>
            <div className="rounded-2xl overflow-hidden shadow-medium">
              <img
                src={gatheringImage2}
                alt={t.impact.galleryTitle + " 2"}
                className="w-full h-[300px] object-cover"
                loading="lazy"
              />
            </div>
            <div className="rounded-2xl overflow-hidden shadow-medium">
              <img
                src={gatheringImage3}
                alt={t.impact.galleryTitle + " 3"}
                className="w-full h-[300px] object-cover"
                loading="lazy"
              />
            </div>
            <div className="rounded-2xl overflow-hidden shadow-medium">
              <img
                src={gatheringImage4}
                alt={t.impact.galleryTitle + " 4"}
                className="w-full h-[300px] object-cover"
                loading="lazy"
              />
            </div>
            <div className="rounded-2xl overflow-hidden shadow-medium">
              <img
                src={gatheringImage5}
                alt={t.impact.galleryTitle + " 5"}
                className="w-full h-[300px] object-cover"
                loading="lazy"
              />
            </div>
            <div className="rounded-2xl overflow-hidden shadow-medium">
              <img
                src={gatheringImage6}
                alt={t.impact.galleryTitle + " 6"}
                className="w-full h-[300px] object-cover"
                loading="lazy"
              />
            </div>
            <div className="rounded-2xl overflow-hidden shadow-medium">
              <img
                src={gatheringImage7}
                alt={t.impact.galleryTitle + " 7"}
                className="w-full h-[300px] object-cover"
                loading="lazy"
              />
            </div>
            <div className="rounded-2xl overflow-hidden shadow-medium">
              <img
                src={gatheringImage8}
                alt={t.impact.galleryTitle + " 8"}
                className="w-full h-[300px] object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-12 text-center">
            {t.impact.timeline.title}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {timeline.map((item, index) => (
              <Card key={index} className="bg-card border-border hover:shadow-medium transition-smooth">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-start gap-4">
                    <span className="text-4xl md:text-5xl flex-shrink-0">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-accent mb-2">
                        {item.date}
                      </div>
                      <p className="text-foreground text-base md:text-lg leading-relaxed break-words">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Impact;
