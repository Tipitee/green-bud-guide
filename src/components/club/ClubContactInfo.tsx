import React from "react";
import { Phone, Mail, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ClubResult } from "@/types/club";

interface ClubContactInfoProps { club: ClubResult; }

const ClubContactInfo: React.FC<ClubContactInfoProps> = ({ club }) => {
return (
<Card className="border-border bg-card shadow-md">
<CardContent className="p-6 bg-card">
<h3 className="text-xl font-bold mb-4 text-card-foreground">Contact</h3>
<div className="space-y-3">
{club?.contact_phone && (
<div className="flex items-start">
<Phone size={18} className="mr-3 mt-0.5 text-primary flex-shrink-0" aria-hidden="true" />
<p className="text-card-foreground">{club.contact_phone}</p>
</div>
)}
{club?.contact_email && (
<div className="flex items-start">
<Mail size={18} className="mr-3 mt-0.5 text-primary flex-shrink-0" aria-hidden="true" />
<a href={`mailto:${club.contact_email}`} className="text-primary hover:underline" aria-label={`Email ${club.contact_email}`}>{club.contact_email}</a>
</div>
)}
{club?.website && (
<div className="flex items-start">
<Globe size={18} className="mr-3 mt-0.5 text-primary flex-shrink-0" aria-hidden="true" />
<a href={club.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline" aria-label={`Visit ${club.website}`}>{club.website.replace(/^https?:\/\//, '')}</a>
</div>
)}
{!club?.contact_phone && !club?.contact_email && !club?.website && (
<p className="text-muted-foreground italic">No contact information available</p>
)}
</div>
</CardContent>
</Card>
);
};
export default ClubContactInfo;