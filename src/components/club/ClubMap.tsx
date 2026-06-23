// SocialClub Map — ClubMap v2 — MapLibre GL + OpenStreetMap (free, no API key)
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { ClubResult } from "@/types/club";
import { Capacitor } from "@capacitor/core";
import { Geolocation } from "@capacitor/geolocation";
import { toast } from "@/hooks/use-toast";
import { MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const DEFAULT_CENTER: [number, number] = [10.45, 51.16];
const DEFAULT_ZOOM = 5;

const MAP_STYLE: any = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxzoom: 19,
    },
  },
  layers: [{ id: "osm-tiles", type: "raster", source: "osm" }],
};

interface ClubMapProps {
  club?: ClubResult;
  allClubs?: ClubResult[];
}

const ClubMap: React.FC<ClubMapProps> = ({ club, allClubs }) => {
  const navigate = useNavigate();
  const navigateRef = useRef(navigate);
  useEffect(() => { navigateRef.current = navigate; }, [navigate]);
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;
    mapRef.current = new maplibregl.Map({
      container: mapContainer.current,
      style: MAP_STYLE,
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
    });
    return () => { mapRef.current?.remove(); mapRef.current = null; };
  }, []);

  const markerSvg = (color = "#14b8a6") =>
    '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="' + color + '" stroke="#fff" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>';

  useEffect(() => {
    const m = mapRef.current;
    if (!m) return;
    const addMarkers = () => {
      markersRef.current.forEach(mk => mk.remove());
      markersRef.current = [];
      if (club && club.latitude && club.longitude) {
        const mk = new maplibregl.Marker({ color: "#14b8a6" })
          .setLngLat([club.longitude, club.latitude])
          .setPopup(new maplibregl.Popup({ offset: 25 }).setHTML(
            "<strong>" + club.name + "</strong><br/><small>" + (club.address || "") + "</small>"
          ))
          .addTo(m);
        markersRef.current.push(mk);
        m.flyTo({ center: [club.longitude, club.latitude], zoom: 15 });
        return;
      }
      const clubs = allClubs ?? [];
      const valid = clubs.filter(c => c.latitude && c.longitude);
      if (valid.length === 0) return;
      const bounds = new maplibregl.LngLatBounds();
      valid.forEach(c => {
        const el = document.createElement("div");
        el.innerHTML = markerSvg();
        el.style.cursor = "pointer";
        const safeId = "nav-" + c.name.replace(/[^a-z0-9]/gi, "_");
        const popup = new maplibregl.Popup({ closeButton: true, offset: 25, maxWidth: "200px" }).setHTML(
          "<div style=\"font-family:sans-serif;padding:2px\">"
          + "<div style=\"font-weight:600;margin-bottom:2px\">" + c.name + "</div>"
          + "<div style=\"font-size:12px;color:#555\">" + (c.city || "") + (c.city && c.postal_code ? ", " : "") + (c.postal_code || "") + "</div>"
          + "<button id=\"" + safeId + "\" style=\"font-size:12px;color:#14b8a6;cursor:pointer;margin-top:6px;background:none;border:none;padding:0\">Voir détails →</button>"
          + "</div>"
        );
        popup.on("open", () => {
          const btn = document.getElementById(safeId);
          if (btn) btn.onclick = () => navigateRef.current("/clubs/" + encodeURIComponent(c.name));
        });
        const mk = new maplibregl.Marker({ element: el })
          .setLngLat([c.longitude, c.latitude])
          .setPopup(popup)
          .addTo(m);
        markersRef.current.push(mk);
        bounds.extend([c.longitude, c.latitude]);
      });
      if (valid.length > 0) m.fitBounds(bounds, { padding: 50, maxZoom: 12, duration: 500 });
    };
    if (m.loaded()) { addMarkers(); } else { m.once("load", addMarkers); }
  }, [club, allClubs]);
  const getCurrentLocation = useCallback(async () => {
    try {
      setIsLoadingLocation(true);
      let lat: number, lng: number;
      if (Capacitor.isNativePlatform()) {
        const perm = await Geolocation.checkPermissions();
        if (perm.location !== "granted") await Geolocation.requestPermissions();
        const pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 10000 });
        lat = pos.coords.latitude; lng = pos.coords.longitude;
      } else {
        const pos = await new Promise<GeolocationPosition>((res, rej) =>
          navigator.geolocation.getCurrentPosition(res, rej, { enableHighAccuracy: true, timeout: 10000 })
        );
        lat = pos.coords.latitude; lng = pos.coords.longitude;
      }
      const el = document.createElement("div");
      el.innerHTML = markerSvg("#2A9D90");
      new maplibregl.Marker({ element: el }).setLngLat([lng, lat]).addTo(mapRef.current!);
      mapRef.current?.flyTo({ center: [lng, lat], zoom: 13 });
      toast({ title: "Localisation trouvée" });
    } catch (e) {
      toast({ title: "Erreur de localisation", description: e instanceof Error ? e.message : "Impossible", variant: "destructive" });
    } finally {
      setIsLoadingLocation(false);
    }
  }, []);

  return (
    <>
      <div ref={mapContainer} style={{ width: "100%", height: "100%", borderRadius: "0.5rem" }} />
      <div className="absolute right-4 bottom-4 z-10">
        <Button onClick={getCurrentLocation} disabled={isLoadingLocation} variant="secondary" size="icon"
          className="h-10 w-10 rounded-full shadow-lg bg-white dark:bg-navy-400 hover:bg-gray-100 dark:hover:bg-navy-300">
          {isLoadingLocation
            ? <Loader2 className="h-5 w-5 text-teal dark:text-teal-light animate-spin" />
            : <MapPin className="h-5 w-5 text-teal dark:text-teal-light" />}
        </Button>
      </div>
    </>
  );
};

export default ClubMap;