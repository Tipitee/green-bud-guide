import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ClubResult } from "@/types/club";
import { ExternalLink } from "lucide-react";

interface ClubAdditionalInfoProps { club: ClubResult; }

const ClubAdditionalInfo: React.FC<ClubAdditionalInfoProps> = ({ club }) => {
if (!club?.additional_info && !club?.website) return null;

const renderTextWithLinks = (text: string) => {
if (!text) return null;
const urlRegex = /(https?://[^s]+)/g;
const parts = text.split(urlRegex);
return parts.map((part, i) => {
if (part.match(urlRegex)) {
return <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center" aria-label={part}>
{part}<ExternalLink size={14} className="ml-1" aria-hidden="true" />
</a>;
}
return part;
});
};

return (
<Card className="border-border bg-card shadow-md">
<CardContent className="p-6 bg-card">
<h3 className="text-xl font-bold mb-4 text-card-foreground">Additional Information</h3>
{club.additional_info && <p className="text-card-foreground mb-4">{renderTextWithLinks(club.additional_info)}</p>}
{club.website && (
<div className="mt-2">
<span className="text-card-foreground font-medium">Website: </span>
<a href={club.website.startsWith('http') ? club.website : `https://${club.website}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center break-all" aria-label={`Visit ${club.website}`}>
{club.website}<ExternalLink size={14} className="ml-1 flex-shrink-0" aria-hidden="true" />
</a>
</div>
)}
</CardContent>
</Card>
);
};
export default ClubAdditionalInfo;