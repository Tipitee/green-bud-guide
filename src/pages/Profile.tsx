import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Edit, User, Save, Loader2, LogOut, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";

type Profile = {
id: string;
username: string | null;
avatar_url: string | null;
language: string | null;
};

const Profile: React.FC = () => {
const { user, signOut } = useAuth();
const [profile, setProfile] = useState<Profile | null>(null);
const [loading, setLoading] = useState(true);
const [updating, setUpdating] = useState(false);
const [editMode, setEditMode] = useState(false);
const [username, setUsername] = useState('');
const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));
const navigate = useNavigate();
const { toast } = useToast();
const { t, i18n } = useTranslation();

useEffect(() => {
if (!user) {
navigate('/auth');
return;
}

async function fetchProfile() {
setLoading(true);
try {
const {
data,
error
} = await supabase.from('profiles').select('id, username, avatar_url, language').eq('id', user.id).single();
if (error) throw error;
setProfile(data);
setUsername(data?.username || user.email?.split('@')[0] || '');

if (data?.language && i18n.language !== data.language) {
i18n.changeLanguage(data.language);
}
} catch (error: any) {
console.error('Error fetching profile:', error.message);
toast({
title: "Error",
description: "Couldn't load your profile information",
variant: "destructive",
duration: 2000
});
} finally {
setLoading(false);
}
}
fetchProfile();
}, [user, navigate, toast, t, i18n]);

const updateProfile = async () => {
if (!user) return;
setUpdating(true);
try {
const {
error
} = await supabase.from('profiles').update({
username: username,
updated_at: new Date().toISOString()
}).eq('id', user.id);
if (error) throw error;
toast({
title: t('profile.profileUpdated'),
description: t('profile.profileUpdateSuccess'),
duration: 2000
});
setEditMode(false);

const {
data
} = await supabase.from('profiles').select('id, username, avatar_url, language').eq('id', user.id).single();
if (data) setProfile(data);
} catch (error: any) {
toast({
title: "Error",
description: error.message,
variant: "destructive",
duration: 2000
});
} finally {
setUpdating(false);
}
};

const handleLanguageChange = async (lang: string) => {
if (!user) return;
try {
const {
error
} = await supabase.from('profiles').update({
language: lang,
updated_at: new Date().toISOString()
}).eq('id', user.id);
if (error) throw error;
i18n.changeLanguage(lang);
toast({
title: "Language Updated",
description: lang === 'en' ? "Language set to English" : "Sprache auf Deutsch eingestellt",
duration: 2000
});

const {
data
} = await supabase.from('profiles').select('id, username, avatar_url, language').eq('id', user.id).single();
if (data) setProfile(data);
} catch (error: any) {
toast({
title: "Error",
description: error.message,
variant: "destructive",
duration: 2000
});
}
};

const toggleTheme = () => {
const currentlyDark = document.documentElement.classList.contains('dark');
if (currentlyDark) {
document.documentElement.classList.remove('dark');
document.documentElement.classList.add('light');
} else {
document.documentElement.classList.remove('light');
document.documentElement.classList.add('dark');
}
const newDark = !currentlyDark;
localStorage.setItem('theme', newDark ? 'dark' : 'light');
setIsDark(newDark);
};

const handleClose = () => {
navigate(-1);
};

if (loading) {
return (
<div className="min-h-screen bg-background pb-28">
<Navbar />
<div className="container px-4 py-8 flex justify-center">
<Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
</div>
<BottomNav />
</div>
);
}

if (!user) {
return (
<div className="min-h-screen bg-background pb-28">
<Navbar />
<div className="container px-4 py-8 max-w-md mx-auto">
<Card className="bg-card border-border shadow-md">
<CardContent className="pt-6 text-center">
<div className="flex justify-center">
<div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
<User className="h-12 w-12 text-primary/60" aria-hidden="true" />
</div>
</div>
<h2 className="text-xl font-bold mb-2 text-foreground">Not Signed In</h2>
<p className="text-muted-foreground mb-4">Sign in to access your profile</p>
<Button onClick={() => navigate('/auth')} className="bg-primary hover:bg-primary/90 text-primary-foreground">
Sign In
</Button>
</CardContent>
</Card>
</div>
<BottomNav />
</div>
);
}

return (
<main className="min-h-screen bg-background pb-28">
<Navbar />
<div className="container px-4 py-8 max-w-xl mx-auto relative">
<Button
onClick={handleClose}
variant="outline"
size="icon"
className="absolute top-0 right-0 text-muted-foreground hover:bg-accent/20 rounded-full"
aria-label={t('common.close') || 'Close'}
>
<X className="h-5 w-5" aria-hidden="true" />
</Button>

<Card className="bg-card border-border shadow-md backdrop-blur mb-8">
<CardContent className="pt-6">
<div className="flex flex-col items-center mb-6">
<div className="relative mb-4">
<Avatar className="h-24 w-24 border-2 border-primary">
<AvatarImage src={profile?.avatar_url || undefined} alt={username} />
<AvatarFallback className="bg-primary/20 text-2xl text-primary font-semibold">
{username.charAt(0).toUpperCase()}
</AvatarFallback>
</Avatar>
<Button size="sm" className="absolute bottom-0 right-0 rounded-full h-8 w-8 p-0 bg-primary hover:bg-primary/90" aria-label={t('profile.changeAvatar')}>
<Camera className="h-4 w-4" aria-hidden="true" />
<span className="sr-only">{t('profile.changeAvatar')}</span>
</Button>
</div>

<div className="text-center">
{!editMode && <h2 className="text-xl font-bold text-foreground">{profile?.username || username}</h2>}
</div>
</div>

{editMode ? (
<div className="space-y-4">
<div>
<Label htmlFor="username" className="text-foreground">
{t('profile.usernameLabel')}
</Label>
<Input id="username" value={username} onChange={e => setUsername(e.target.value)} className="bg-background border-border text-foreground" placeholder={t('profile.enterUsername')} autoFocus />
</div>

<div>
<Label htmlFor="email" className="text-foreground">
Email
</Label>
<Input id="email" value={user.email || ""} readOnly className="bg-background border-border text-muted-foreground" />
</div>

<div className="flex justify-center gap-4 mt-4">
<Button variant="outline" onClick={() => {
setEditMode(false);
setUsername(profile?.username || user.email?.split('@')[0] || '');
}} className="border-border hover:bg-accent/20 text-foreground">
{t('profile.cancel')}
</Button>
<Button onClick={updateProfile} disabled={updating} className="bg-primary hover:bg-primary/90 text-primary-foreground">
{updating ? (
<>
<Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
{t('profile.saving')}
</>
) : (
<>
<Save className="mr-2 h-4 w-4" aria-hidden="true" />
{t('profile.saveProfile')}
</>
)}
</Button>
</div>
</div>
) : (
<div className="flex justify-center">
<Button onClick={() => setEditMode(true)} className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground" variant="default">
<Edit className="mr-2 h-4 w-4" aria-hidden="true" />
{t('profile.editProfile')}
</Button>
</div>
)}
</CardContent>
</Card>

<Card className="bg-card border-border shadow-md backdrop-blur mb-8">
<CardContent className="pt-6">
<h3 className="text-lg font-semibold mb-4 text-foreground">{t('settings.appearance')}</h3>

<div className="space-y-4">
<div className="flex justify-between items-center">
<span className="text-foreground">{t('settings.language')}</span>
<div className="flex gap-3">
<Button
variant={profile?.language === 'en' ? 'default' : 'outline'}
onClick={() => handleLanguageChange('en')}
className={profile?.language === 'en' ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : 'bg-card border-border hover:bg-accent/20 text-foreground'}
size="sm"
>
English
</Button>
<Button
variant={profile?.language === 'de' ? 'default' : 'outline'}
onClick={() => handleLanguageChange('de')}
className={profile?.language === 'de' ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : 'bg-card border-border hover:bg-accent/20 text-foreground'}
size="sm"
>
Deutsch
</Button>
</div>
</div>

<div className="flex justify-between items-center pt-2 border-t border-border">
<span className="text-foreground">{t('settings.theme')}</span>
<Button variant="outline" onClick={toggleTheme} className="bg-card border-border hover:bg-accent/20 text-foreground" size="sm">
{isDark ? t('settings.lightMode') : t('settings.darkMode')}
</Button>
</div>
</div>
</CardContent>
</Card>

<Card className="bg-card border-border shadow-md backdrop-blur">
<CardContent className="pt-6">
<div className="space-y-4">
<h3 className="text-lg font-semibold mb-4 text-foreground">{t('profile.accountActions')}</h3>

<Button variant="destructive" className="w-full" onClick={signOut}>
<LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
{t('profile.signOut')}
</Button>
</div>
</CardContent>
</Card>
</div>
<BottomNav />
</main>
);
};

export default Profile;