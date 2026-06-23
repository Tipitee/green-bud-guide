import React from "react";
import { Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface ClubEvent { id: string; name: string; date: string; description?: string; }
interface ClubEventsProps { events: ClubEvent[]; }

const ClubEvents: React.FC<ClubEventsProps> = ({ events }) => {
if (!events || events.length === 0) return null;
return (
<Card className="bg-card border-border">
<CardContent className="p-6">
<h3 className="text-xl font-bold mb-4 text-card-foreground flex items-center gap-2">
<Calendar size={20} className="text-primary" aria-hidden="true" />
Events
</h3>
<ul className="space-y-2" role="list">
{events.map((event) => (
<li key={event.id} role="listitem">
{event.description ? (
<Accordion type="single" collapsible>
<AccordionItem value={event.id} className="border-border">
<AccordionTrigger className="text-card-foreground hover:text-primary py-2">
<span className="flex items-center gap-2">
<span className="font-medium">{event.name}</span>
<span className="text-muted-foreground text-sm">— {event.date}</span>
</span>
</AccordionTrigger>
<AccordionContent className="text-muted-foreground pt-1">
{event.description}
</AccordionContent>
</AccordionItem>
</Accordion>
) : (
<div className="flex items-center justify-between py-2 border-b border-border last:border-0">
<span className="font-medium text-card-foreground">{event.name}</span>
<span className="text-muted-foreground text-sm">{event.date}</span>
</div>
)}
</li>
))}
</ul>
</CardContent>
</Card>
);
};
export default ClubEvents;