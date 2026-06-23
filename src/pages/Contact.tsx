import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Send, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

// ⚠️  Replace YOUR_FORM_ID with your Formspree endpoint ID
// 1. Go to https://formspree.io and create a free account
// 2. Create a new form → copy the ID (e.g. "xpzgkwqr")
// 3. Replace YOUR_FORM_ID below
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

const Contact: React.FC = () => {
const { toast } = useToast();
const navigate = useNavigate();
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [message, setMessage] = useState('');
const [sending, setSending] = useState(false);
const [sent, setSent] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault();
if (FORMSPREE_ENDPOINT.includes('YOUR_FORM_ID')) {
toast({ title: 'Configuration requise', description: 'Remplacez YOUR_FORM_ID dans Contact.tsx par votre endpoint Formspree.', variant: 'destructive' });
return;
}
setSending(true);
try {
const res = await fetch(FORMSPREE_ENDPOINT, {
method: 'POST',
headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
body: JSON.stringify({ name, email, message })
});
if (res.ok) {
setSent(true);
setName(''); setEmail(''); setMessage('');
toast({ title: 'Message envoyé !', description: 'Nous vous répondrons dans les plus brefs délais.' });
} else {
throw new Error('Formspree error');
}
} catch {
toast({ title: 'Erreur', description: 'Impossible d'envoyer le message. Réessayez plus tard.', variant: 'destructive' });
} finally {
setSending(false);
}
};

return (
<main className="min-h-screen bg-background">
<Navbar />
<div className="container max-w-lg mx-auto px-4 pt-24 pb-28">
<Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 text-muted-foreground hover:text-foreground p-0 hover:bg-transparent">
<ArrowLeft size={16} className="mr-2" aria-hidden="true" />
Retour
</Button>

<div className="flex items-center gap-3 mb-8">
<div className="bg-primary/10 rounded-full p-3">
<Mail className="h-6 w-6 text-primary" aria-hidden="true" />
</div>
<div>
<h1 className="text-2xl font-bold text-foreground">Nous contacter</h1>
<p className="text-muted-foreground text-sm">Une question, un problème ou une suggestion ?</p>
</div>
</div>

{sent ? (
<div className="flex flex-col items-center text-center py-12 gap-4">
<CheckCircle className="h-16 w-16 text-primary" aria-hidden="true" />
<h2 className="text-xl font-bold text-foreground">Message envoyé !</h2>
<p className="text-muted-foreground">Merci pour votre message. Nous vous répondrons bientôt.</p>
<Button onClick={() => setSent(false)} variant="outline" className="mt-4">
Envoyer un autre message
</Button>
</div>
) : (
<form onSubmit={handleSubmit} className="space-y-5" noValidate>
<div className="space-y-2">
<Label htmlFor="name" className="text-foreground font-medium">Nom</Label>
<Input
id="name"
value={name}
onChange={e => setName(e.target.value)}
placeholder="Votre nom"
required
className="bg-background border-border text-foreground"
/>
</div>

<div className="space-y-2">
<Label htmlFor="email" className="text-foreground font-medium">Email</Label>
<Input
id="email"
type="email"
value={email}
onChange={e => setEmail(e.target.value)}
placeholder="votre@email.com"
required
className="bg-background border-border text-foreground"
/>
</div>

<div className="space-y-2">
<Label htmlFor="message" className="text-foreground font-medium">Message</Label>
<Textarea
id="message"
value={message}
onChange={e => setMessage(e.target.value)}
placeholder="Décrivez votre question ou remarque..."
required
rows={5}
className="bg-background border-border text-foreground resize-none"
/>
</div>

<Button
type="submit"
disabled={sending || !name.trim() || !email.trim() || !message.trim()}
className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
>
{sending ? (
<span className="flex items-center gap-2">
<div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" aria-hidden="true" />
Envoi en cours...
</span>
) : (
<span className="flex items-center gap-2">
<Send size={16} aria-hidden="true" />
Envoyer le message
</span>
)}
</Button>
</form>
)}
</div>
</main>
);
};
export default Contact;