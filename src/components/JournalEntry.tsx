import React, { useState } from "react";
import { Star, Edit, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { JournalEntry } from "@/types/journal";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import {
AlertDialog,
AlertDialogAction,
AlertDialogCancel,
AlertDialogContent,
AlertDialogDescription,
AlertDialogFooter,
AlertDialogHeader,
AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface JournalEntryComponentProps {
entry: JournalEntry;
onEdit?: (entry: JournalEntry) => void;
onDelete?: (id: string) => void;
}

const JournalEntryComponent: React.FC<JournalEntryComponentProps> = ({
entry,
onEdit,
onDelete
}) => {
const [expanded, setExpanded] = useState(false);
const [showDeleteDialog, setShowDeleteDialog] = useState(false);
const { t } = useTranslation();

const renderStars = (rating: number) => {
const stars = [];
for (let i = 0; i < 5; i++) {
stars.push(
<Star
key={i}
className={`${i < rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`}
size={20}
aria-hidden="true"
/>
);
}
return stars;
};

const getEffectivenessLabel = (rating: number) => {
if (rating >= 4) return t('journal.veryEffective');
if (rating >= 3) return t('journal.effective');
return t('journal.moderatelyEffective');
};

const getMoodEmoji = (mood: string) => {
const lowerMood = mood.toLowerCase();
if (lowerMood.includes("relax")) return "😌";
if (lowerMood.includes("creat")) return "🤩";
if (lowerMood.includes("happy")) return "😊";
if (lowerMood.includes("energy") || lowerMood.includes("focus")) return "⚡";
if (lowerMood.includes("sleep")) return "😴";
return "😊";
};

const handleEditClick = () => { if (onEdit) onEdit(entry); };
const handleDeleteClick = () => setShowDeleteDialog(true);
const confirmDelete = () => {
if (onDelete) onDelete(entry.id);
setShowDeleteDialog(false);
};

return (
<>
<Card className="rounded-xl shadow-lg border border-border p-6 mb-6 transition-all duration-300 bg-card">
<div className="flex justify-between items-start">
<h2 className="text-xl font-bold mb-4 text-foreground">{entry.date}</h2>
<div className="flex gap-2">
<Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-accent/20" onClick={handleEditClick} aria-label={t('journal.edit')}>
<Edit size={18} aria-hidden="true" />
</Button>
<Button variant="ghost" size="sm" className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10" onClick={handleDeleteClick} aria-label={t('journal.delete')}>
<Trash2 size={18} aria-hidden="true" />
</Button>
</div>
</div>

<div className="flex justify-between mb-3">
<span className="text-muted-foreground">{t('journal.dosage')}:</span>
<span className="text-foreground font-medium">{entry.dosage} {entry.dosageType}</span>
</div>

<div className="mb-3">
<div className="flex justify-between">
<span className="text-muted-foreground">{t('journal.effectiveness')}:</span>
<span className="text-foreground font-medium ml-2">({getEffectivenessLabel(entry.effectiveness)})</span>
</div>
<div className="flex mt-1" role="img" aria-label={`${entry.effectiveness} out of 5 stars`}>
{renderStars(entry.effectiveness)}
</div>
</div>

<div className="flex justify-between mb-3">
<span className="text-muted-foreground">{t('journal.mood')}:</span>
<div className="flex items-center">
<span className="mr-2">{getMoodEmoji(entry.mood)}</span>
<span className="text-foreground font-medium">{entry.mood}</span>
</div>
</div>

<div className="flex justify-between mb-3">
<span className="text-muted-foreground">{t('journal.activity')}:</span>
<span className="text-foreground font-medium">{entry.activity}</span>
</div>

<div className="mb-3">
<div className="text-muted-foreground mb-2">{t('journal.sideEffects')}:</div>
<div className="flex flex-wrap gap-2">
{entry.sideEffects.length > 0 ? (
entry.sideEffects.map((effect, index) => (
<Badge key={index} variant="outline" className="text-sm bg-muted text-foreground border-border">
{effect}
</Badge>
))
) : (
<span className="text-sm text-muted-foreground">{t('journal.noSideEffects')}</span>
)}
</div>
</div>

{entry.notes && (
<div className={`mt-4 ${!expanded && entry.notes.length > 120 ? 'relative' : ''}`}>
<div className="text-muted-foreground mb-1">{t('journal.notes')}:</div>
<div className="relative">
<p className={`bg-muted border border-border text-foreground p-3 rounded-md ${!expanded && entry.notes.length > 120 ? 'line-clamp-3' : ''}`}>
{entry.notes}
</p>
{entry.notes.length > 120 && (
<Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)} className="mt-1 text-muted-foreground hover:text-foreground flex items-center justify-center w-full" aria-expanded={expanded}>
{expanded ? (
<>{t('journal.showLess')} <ChevronUp size={16} className="ml-1" aria-hidden="true" /></>
) : (
<>{t('journal.showMore')} <ChevronDown size={16} className="ml-1" aria-hidden="true" /></>
)}
</Button>
)}
</div>
</div>
)}
</Card>

<AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
<AlertDialogContent className="bg-card border-border text-foreground">
<AlertDialogHeader>
<AlertDialogTitle>{t('journal.deleteEntry')}</AlertDialogTitle>
<AlertDialogDescription className="text-muted-foreground">
{t('journal.deleteConfirmation')}
</AlertDialogDescription>
</AlertDialogHeader>
<AlertDialogFooter>
<AlertDialogCancel className="bg-muted text-foreground border-border hover:bg-accent/20">
{t('common.cancel')}
</AlertDialogCancel>
<AlertDialogAction onClick={confirmDelete} className="bg-red-600 text-white hover:bg-red-700">
{t('common.delete')}
</AlertDialogAction>
</AlertDialogFooter>
</AlertDialogContent>
</AlertDialog>
</>
);
};

export default JournalEntryComponent;