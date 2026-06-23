import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Globe, Check } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';

const LanguageSwitcher: React.FC = () => {
const { i18n, t } = useTranslation();
const { language, setLanguage } = useLanguage();
const [isChanging, setIsChanging] = useState<boolean>(false);

const changeLanguage = async (lng: 'en' | 'de') => {
if (language === lng || isChanging) return;
try {
setIsChanging(true);
setLanguage(lng);
setTimeout(() => {
i18n.changeLanguage(lng).then(() => {
toast({
title: lng === 'en' ? 'Language Changed' : 'Sprache geändert',
description: lng === 'en' ? 'Language set to English' : 'Sprache auf Deutsch eingestellt',
duration: 3000,
});
});
}, 100);
} catch (error) {
console.error("Error changing language:", error);
toast({ title: "Error", description: "Failed to change language. Please try again.", variant: "destructive" });
} finally {
setIsChanging(false);
}
};

return (
<DropdownMenu>
<DropdownMenuTrigger asChild>
<Button
variant="outline"
size="icon"
className="bg-card border-border text-foreground hover:bg-accent/20 rounded-full"
disabled={isChanging}
aria-label={t('language.select') || 'Select language'}
>
<Globe size={16} aria-hidden="true" />
</Button>
</DropdownMenuTrigger>
<DropdownMenuContent className="w-40 bg-card border-border shadow-md">
<DropdownMenuItem
className={`flex items-center justify-between ${language === 'en' ? 'bg-primary/20 text-primary font-medium' : 'text-foreground hover:bg-accent/50'}`}
onClick={() => changeLanguage('en')}
aria-current={language === 'en' ? 'true' : undefined}
>
English
{language === 'en' && <Check size={16} className="ml-2" aria-hidden="true" />}
</DropdownMenuItem>
<DropdownMenuItem
className={`flex items-center justify-between ${language === 'de' ? 'bg-primary/20 text-primary font-medium' : 'text-foreground hover:bg-accent/50'}`}
onClick={() => changeLanguage('de')}
aria-current={language === 'de' ? 'true' : undefined}
>
Deutsch
{language === 'de' && <Check size={16} className="ml-2" aria-hidden="true" />}
</DropdownMenuItem>
</DropdownMenuContent>
</DropdownMenu>
);
};
export default LanguageSwitcher;