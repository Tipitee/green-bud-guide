import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useClubDetail } from "@/hooks/use-club-detail";
import ClubLoading from "@/components/club/ClubLoading";
import ClubError from "@/components/club/ClubError";
import ClubContent from "@/components/club/ClubContent";
import { Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Capacitor } from "@capacitor/core";
import { toast } from "@/hooks/use-toast";

const ClubDetail: React.FC = () => {
const { id } = useParams<{ id: string }>();
const location = useLocation();
const navigate = useNavigate();
const fromSearch = location.state?.fromSearch || false;
const [isNative, setIsNative] = useState(false);
const [isIOS, setIsIOS] = useState(false);

useEffect(() => {
setIsNative(Capacitor.isNativePlatform());
setIsIOS(Capacitor.getPlatform() === 'ios');
}, []);

const safeId = id || '';
const { club, loading, error } = useClubDetail(safeId);

const shareClub = async () => {
if (!club) return;

const shareData = {
title: `Green Bud Guide - ${club.name}`,
text: `Check out ${club.name} on Green Bud Guide`,
url: window.location.href
};

if (Capacitor.isNativePlatform()) {
toast({
title: "Share",
description: "Sharing functionality will be available in the next update",
});
} else if (navigator.share) {
try {
await navigator.share(shareData);
} catch (err) {
console.error("Error sharing:", err);
}
} else {
navigator.clipboard.writeText(window.location.href);
toast({
title: "Link Copied",
description: "Club link copied to clipboard",
});
}
};

useEffect(() => {
if (!location.state) {
sessionStorage.setItem('direct-club-access', 'true');
}
console.log("Club detail - From search:", fromSearch);
console.log("Club detail - ID:", safeId);
}, [location.state, safeId, fromSearch]);

useEffect(() => {
if (error && !location.state) {
const timer = setTimeout(() => {
navigate('/clubs', { replace: true });
}, 3000);
return () => clearTimeout(timer);
}
}, [error, location.state, navigate]);

const getIosPadding = () => {
if (isIOS && isNative) {
return 'pt-[calc(env(safe-area-inset-top)+16px)]';
}
return 'pt-16';
};

if (loading) {
return (
<main className={`min-h-dvh bg-background ${getIosPadding()}`}>
<ClubLoading />
</main>
);
}

if (error || !club) {
return (
<main className={`min-h-dvh bg-background ${getIosPadding()}`}>
<ClubError error={error} />
</main>
);
}

return (
<main className="min-h-dvh bg-background pb-20">
<div className={`container px-4 max-w-7xl mx-auto relative ${getIosPadding()}`}>
{isNative && (
<div className="absolute top-2 right-2 z-10">
<Button
onClick={shareClub}
size="icon"
variant="ghost"
className="h-9 w-9 rounded-full bg-background/80 backdrop-blur-sm shadow-md"
aria-label="Share this club"
>
<Share className="h-5 w-5 text-foreground" aria-hidden="true" />
</Button>
</div>
)}
</div>
<ClubContent club={club} fromSearch={fromSearch} />
</main>
);
};

export default ClubDetail;