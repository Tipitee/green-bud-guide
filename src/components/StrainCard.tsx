import React from "react";
import { Strain } from "@/types/strain";
import { Cannabis, Sun, CircleDashed } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useTranslation } from "react-i18next";

interface StrainCardProps {
  strain: Strain;
}

const StrainCard: React.FC<StrainCardProps> = ({ strain }) => {
  const { t } = useTranslation();

  const getTypeIcon = () => {
    switch (strain.type) {
      case "Indica": return <Cannabis className="h-16 w-16 text-white/90 drop-shadow-md" />;
      case "Sativa": return <Sun className="h-16 w-16 text-white/90 drop-shadow-md" />;
      case "Hybrid":
      default: return <CircleDashed className="h-16 w-16 text-white/90 drop-shadow-md" />;
    }
  };

  const getTypeGradient = () => {
    switch (strain.type) {
      case "Indica": return "from-purple-900 via-purple-700 to-purple-500";
      case "Sativa": return "from-amber-800 via-amber-600 to-yellow-500";
      case "Hybrid":
      default: return "from-teal-900 via-teal-700 to-emerald-500";
    }
  };

  const getTypeBadgeColor = () => {
    switch (strain.type) {
      case "Indica": return "bg-purple-700 text-white";
      case "Sativa": return "bg-amber-600 text-white";
      case "Hybrid":
      default: return "bg-teal-600 text-white";
    }
  };

  const getEffectColor = (index: number) => {
    switch (index) {
      case 0: return 'bg-primary';
      case 1: return 'bg-coral-DEFAULT';
      case 2: return 'bg-sand-dark';
      default: return 'bg-teal-light';
    }
  };

  const displayEffects = strain.effects.filter(e => e.effect && e.effect !== "Unknown");

  return (
    <div className="strain-card h-full">
      {/* Image / placeholder area */}
      <div className="relative h-48 overflow-hidden">
        {/* Always render gradient background */}
        <div className={"absolute inset-0 bg-gradient-to-br " + getTypeGradient() + " flex items-center justify-center"}>
          {getTypeIcon()}
        </div>
        {/* Overlay real image on top — hides itself on error */}
        {strain.img_url && (
          <img
            src={strain.img_url}
            alt={strain.name}
            className="absolute inset-0 w-full h-full object-cover"
            onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
          />
        )}
        <Badge className={"absolute top-3 right-3 " + getTypeBadgeColor() + " px-3 py-1 text-xs font-medium shadow-md"}>
          {strain.type}
        </Badge>
      </div>

      <div className="p-5 bg-card">
        <h3 className="text-lg font-bold mb-4 line-clamp-1 text-card-foreground">{strain.name}</h3>

        <div className="mt-3">
          {strain.thc_level !== null && strain.thc_level !== undefined ? (
            <>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-card-foreground">{t('strains.thcLevel')}</span>
                <span className="font-bold text-card-foreground">{strain.thc_level}%</span>
              </div>
              <Progress className="h-2 rounded-full mb-4 bg-muted effect-bar" value={Math.min(100, (strain.thc_level || 0) / 30 * 100)} indicatorClassName="bg-primary" />
            </>
          ) : (
            <>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-card-foreground">{t('strains.thcLevel')}</span>
                <span className="font-bold text-muted-foreground">?</span>
              </div>
              <Progress className="h-2 rounded-full mb-4 bg-muted effect-bar" value={50} indicatorClassName="bg-muted-foreground/30" />
            </>
          )}
        </div>

        <div className="space-y-3 mb-4">
          {displayEffects.slice(0, 2).map((effect, index) => (
            <div key={effect.effect + "-" + index}>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-card-foreground line-clamp-1">{effect.effect}</span>
                <span className="font-bold text-card-foreground">{effect.intensity}%</span>
              </div>
              <Progress className={"h-2 rounded-full mb-2 bg-muted effect-bar"} value={effect.intensity} indicatorClassName={getEffectColor(index)} />
            </div>
          ))}
        </div>

        <div className="h-6 flex items-center">
          <span className="text-xs text-muted-foreground mr-1">{t('strains.dominantTerpene')}:</span>
          <Badge variant="outline" className="font-medium text-xs border-border text-card-foreground">
            {strain.most_common_terpene || t('strains.unknown')}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default StrainCard;
