import React from "react";
import { Loader2 } from "lucide-react";

const ClubLoading: React.FC = () => {
return (
<div className="min-h-screen bg-background flex items-center justify-center" role="status" aria-label="Loading club details">
<div className="text-center">
<Loader2 className="h-8 w-8 animate-spin text-teal mx-auto mb-4" aria-hidden="true" />
<p className="text-foreground">Loading club details...</p>
</div>
</div>
);
};
export default ClubLoading;