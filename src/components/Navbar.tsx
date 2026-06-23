import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme-provider";
import { User, LogIn, Settings, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { Capacitor } from "@capacitor/core";

const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isAdmin = user?.email === 'tomalours@gmail.com';
  const [darkLogo, setDarkLogo] = useState<string | null>(null);
  const [lightLogo, setLightLogo] = useState<string | null>(null);
  const [logoLoading, setLogoLoading] = useState(true);
  const isMobile = useIsMobile();
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsIOS(Capacitor.getPlatform() === 'ios');
    const fetchLogos = async () => {
      setLogoLoading(true);
      try {
        const { data: darkData } = await supabase.storage.from('logoclub').getPublicUrl('darklogo.png');
        const { data: lightData } = await supabase.storage.from('logoclub').getPublicUrl('lightlogo.png');
        if (darkData) setDarkLogo(darkData.publicUrl);
        if (lightData) setLightLogo(lightData.publicUrl);
      } catch (error) {
        console.error("Error fetching logos:", error);
      } finally {
        setLogoLoading(false);
      }
    };
    fetchLogos();
  }, []);

  const currentLogo = theme === 'dark' ? darkLogo : lightLogo;
  if (!mounted) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-border bg-background nav-header" role="banner">
      {isIOS && <div className="ios-status-bar" aria-hidden="true" />}
      <div className="container flex items-center justify-between px-4 h-16 w-full">
        <Link to="/" className="flex items-center font-bold text-xl" aria-label={t('navigation.home')}>
          {logoLoading ? (
            <div className="h-8 w-28 bg-muted animate-pulse rounded" aria-hidden="true" />
          ) : currentLogo ? (
            <img src={currentLogo} alt="SocialClub Map" className="navbar-logo max-h-8 w-auto"
              onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
          ) : (
            <span className="text-foreground font-bold text-lg">Cannabis Club</span>
          )}
        </Link>

        <nav className="flex items-center gap-2" aria-label={t('navigation.main') || 'Navigation'}>
          <Link to="/settings" aria-label={t('navigation.settings')}>
            <Button variant="outline" size={isMobile ? "sm" : "icon"}
              className="rounded-full bg-transparent border-border text-foreground hover:bg-accent/20"
              aria-label={t('navigation.settings')}>
              <Settings className={isMobile ? "h-4 w-4" : "h-5 w-5"} aria-hidden="true" />
            </Button>
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon"
                  className="rounded-full bg-transparent border-border"
                  aria-label={t('navigation.profile') || 'Mon compte'}>
                  <User className="h-5 w-5 text-foreground" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-card border-border">
                <DropdownMenuItem className="text-card-foreground hover:bg-accent/20">
                  <Link to="/profile">{t('navigation.profile')}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-card-foreground hover:bg-accent/20">
                  <Link to="/settings">{t('navigation.settings')}</Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem className="text-card-foreground hover:bg-accent/20">
                    <Link to="/admin-tools" className="flex items-center gap-2">
                      <Shield className="h-4 w-4" aria-hidden="true" /> Admin Tools
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem onClick={() => signOut()} className="text-card-foreground hover:bg-accent/20">
                  {t('auth.signOut')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth" aria-label={t('auth.signIn') || 'Se connecter'}>
              <Button variant="outline" size={isMobile ? "sm" : "icon"}
                className="rounded-full bg-transparent border-border text-foreground hover:bg-accent/20"
                aria-label={t('auth.signIn') || 'Se connecter'}>
                <LogIn className={isMobile ? "h-4 w-4" : "h-5 w-5"} aria-hidden="true" />
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};
export default Navbar;
