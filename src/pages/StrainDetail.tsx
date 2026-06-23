import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { ChevronLeft, Cannabis, Sun, CircleDashed, Leaf, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchStrainById } from "@/services/strainService";
import { generateStrainImage } from "@/services/strain/strainImageService";
import StrainReviews from "@/components/StrainReviews";

const StrainDetail: React.FC = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const { data: strain, error, isLoading } = useQuery({
    queryKey: ['strain', id],
    queryFn: () => fetchStrainById(id || '')
  });

  const handleGenerateImage = async () => {
    if (!strain || !id) return;
    setIsGeneratingImage(true);
    try { await generateStrainImage(id, strain.name); }
    catch (err) { console.error("Error generating image:", err); }
    finally { setIsGeneratingImage(false); }
  };

  const getTypeIcon = (type: string, large = false) => {
    const cls = large ? "h-16 w-16 text-white/90" : "h-5 w-5";
    switch (type) {
      case "Indica": return <Cannabis className={cls + " text-purple-300"} aria-hidden="true" />;
      case "Sativa": return <Sun className={cls + " text-amber-300"} aria-hidden="true" />;
      default: return <CircleDashed className={cls + " text-emerald-300"} aria-hidden="true" />;
    }
  };

  const getTypeGradient = (type: string) => {
    switch (type) {
      case "Indica": return "from-purple-900 via-purple-700 to-purple-500";
      case "Sativa": return "from-amber-800 via-amber-600 to-yellow-500";
      default: return "from-teal-900 via-teal-700 to-emerald-500";
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "Indica": return "bg-purple-700 text-white";
      case "Sativa": return "bg-amber-600 text-white";
      default: return "bg-teal-600 text-white";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background" aria-live="polite" aria-label={t('common.loading') || 'Chargement...'}>
        <div className="h-8 w-8 border-t-2 border-primary rounded-full animate-spin" role="status" />
      </div>
    );
  }

  if (error || !strain) {
    return (
      <div className="container px-4 py-6 mb-20 bg-background text-foreground">
        <h1 className="text-2xl font-bold mb-4">{t('strains.strainNotFound')}</h1>
        <p className="text-muted-foreground mb-2">{t('strains.errorLoadingStrain')}</p>
        <p className="text-muted-foreground mb-6">{t('strains.requestedStrainNotFound')}</p>
        <Link to="/strains">
          <Button variant="outline">
            <ChevronLeft className="mr-2 h-4 w-4" aria-hidden="true" />
            {t('strains.backToAllStrains')}
          </Button>
        </Link>
      </div>
    );
  }

  const displayEffects = strain.effects
    .filter(e => e && e.effect && e.effect !== "Unknown")
    .sort((a, b) => b.intensity - a.intensity)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <main className="container px-4 py-8 max-w-5xl mx-auto mb-20" role="main">
        {/* Back button */}
        <div className="mb-6">
          <Link to="/strains" aria-label={t('strains.backToAllStrains')}>
            <Button variant="outline" size="sm" className="flex items-center gap-1 border-border text-foreground hover:bg-accent/20">
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              {t('strains.backToAllStrains')}
            </Button>
          </Link>
        </div>

        {/* Main card */}
        <section className="bg-card rounded-xl overflow-hidden border border-border shadow-lg mb-6" aria-label={strain.name}>
          <div className="flex flex-col md:flex-row">
            {/* Image / gradient placeholder */}
            <div className="md:w-1/3 h-56 md:h-auto relative">
              {/* Gradient background always visible */}
              <div className={"absolute inset-0 bg-gradient-to-br " + getTypeGradient(strain.type) + " flex items-center justify-center"}>
                {getTypeIcon(strain.type, true)}
              </div>
              {/* Real image overlaid */}
              {isGeneratingImage ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
                  <Loader2 className="h-12 w-12 animate-spin mb-2 text-white" aria-hidden="true" />
                  <p className="text-sm text-white" aria-live="polite">Generating image...</p>
                </div>
              ) : strain.img_url ? (
                <img src={strain.img_url} alt={strain.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
              ) : (
                <Button onClick={handleGenerateImage} variant="secondary" size="sm"
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs bg-white/20 hover:bg-white/30 text-white border border-white/30">
                  Generate Image
                </Button>
              )}
            </div>

            {/* Strain details */}
            <div className="md:w-2/3 p-6">
              <div className="flex justify-between items-start mb-4 gap-3">
                <h1 className="text-2xl font-bold text-card-foreground">{strain.name}</h1>
                <Badge className={"shrink-0 flex items-center gap-1 px-3 py-1 text-sm " + getTypeBadge(strain.type)}>
                  {getTypeIcon(strain.type)}
                  <span>{strain.type}</span>
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-muted rounded-lg p-3">
                  <span className="text-xs text-muted-foreground block mb-1">THC Level</span>
                  <p className="text-sm font-semibold text-card-foreground">
                    {strain.thc_level ? strain.thc_level + "%" : t('strains.unknown')}
                  </p>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <span className="text-xs text-muted-foreground block mb-1">Dominant Terpene</span>
                  <p className="text-sm font-semibold text-card-foreground">
                    {strain.most_common_terpene || t('strains.unknown')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Effects section */}
        <section className="mb-6" aria-label="Effects">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-foreground">
            <Leaf className="h-5 w-5 text-primary" aria-hidden="true" />
            Effects
          </h2>
          <div className="bg-card rounded-xl border border-border p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {displayEffects.length > 0 ? displayEffects.map((effect, index) => (
                <div key={"effect-" + index} className="bg-muted/50 rounded-xl px-4 py-3">
                  <h3 className="text-sm font-semibold mb-2 text-card-foreground">{effect.effect}</h3>
                  <div className="w-full bg-muted rounded-full h-1.5 mb-1">
                    <div className={"h-1.5 rounded-full " + (index === 0 ? 'bg-primary' : index === 1 ? 'bg-strain-indica' : 'bg-strain-sativa')}
                      style={{ width: effect.intensity + "%" }}
                      role="progressbar" aria-valuenow={effect.intensity} aria-valuemin={0} aria-valuemax={100}
                      aria-label={effect.effect + ": " + effect.intensity + "%"} />
                  </div>
                  <p className="text-right text-xs font-medium text-muted-foreground">{effect.intensity}%</p>
                </div>
              )) : Array.from({ length: 3 }).map((_, i) => (
                <div key={"ph-" + i} className="bg-muted/50 rounded-xl px-4 py-3">
                  <h3 className="text-sm font-semibold mb-2 text-muted-foreground">{t('strains.noData')}</h3>
                  <div className="w-full bg-muted rounded-full h-1.5 mb-1">
                    <div className="bg-muted/50 h-1.5 rounded-full w-1/2" />
                  </div>
                  <p className="text-right text-xs text-muted-foreground">{t('strains.unknown')}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Description */}
        <section className="mb-6" aria-label="Description">
          <h2 className="text-xl font-bold mb-4 text-foreground">Description</h2>
          <div className="bg-card rounded-xl border border-border p-4 md:p-6">
            <p className="text-card-foreground whitespace-pre-line leading-relaxed">
              {strain.description || t('strains.noDescriptionAvailable')}
            </p>
          </div>
        </section>

        {/* Reviews */}
        <div className="mb-20">
          <StrainReviews strainId={id || '1'} strainName={strain.name} />
        </div>
      </main>
    </div>
  );
};

export default StrainDetail;
