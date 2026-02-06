import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import type { LocationPoint, LocationTarget } from "@/redux/features/location/locationSlice";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const DEFAULT_CENTER: [number, number] = [23.8103, 90.4125];

const createMarkerIcon = (variant: "pickup" | "dropoff") =>
  L.divIcon({
    className: `swiftride-marker swiftride-marker--${variant}`,
    html: "<span class=\"swiftride-marker__pin\"></span><span class=\"swiftride-marker__core\"></span>",
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -26],
  });

const pickupIcon = createMarkerIcon("pickup");
const dropoffIcon = createMarkerIcon("dropoff");

type SearchResult = {
  display_name: string;
  lat: string;
  lon: string;
};

type LocationPickerMapProps = {
  pickup: LocationPoint | null;
  dropoff: LocationPoint | null;
  activeTarget: LocationTarget;
  onSelect: (location: LocationPoint) => void;
};

const MapClickHandler = ({ onSelect }: { onSelect: (location: LocationPoint) => void }) => {
  useMapEvents({
    click: async (event) => {
      const { lat, lng } = event.latlng;
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
      const response = await fetch(url, {
        headers: { "Accept-Language": "en" },
      });
      const data = await response.json();
      const address = data?.display_name || "Selected location";
      onSelect({ address, latitude: lat, longitude: lng });
    },
  });
  return null;
};

const MapViewUpdater = ({ center }: { center: [number, number] }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center, map.getZoom(), { animate: true });
  }, [center, map]);

  return null;
};

export default function LocationPickerMap({
  pickup,
  dropoff,
  activeTarget,
  onSelect,
}: LocationPickerMapProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const center = useMemo<[number, number]>(() => {
    if (pickup) return [pickup.latitude, pickup.longitude];
    if (dropoff) return [dropoff.latitude, dropoff.longitude];
    return DEFAULT_CENTER;
  }, [pickup, dropoff]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setIsSearching(true);
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&addressdetails=1&limit=5`;
        const response = await fetch(url, {
          headers: { "Accept-Language": "en" },
        });
        const data = await response.json();
        setResults(Array.isArray(data) ? data : []);
      } catch {
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [query]);

  const handleResultSelect = (result: SearchResult) => {
    const latitude = Number(result.lat);
    const longitude = Number(result.lon);
    onSelect({ address: result.display_name, latitude, longitude });
    setResults([]);
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Search {activeTarget === "pickup" ? "pickup" : "dropoff"} location
        </label>
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by address, landmark, or area"
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {results.length > 0 && (
        <div className="max-h-48 overflow-y-auto rounded-lg border border-gray-200 bg-white">
          {results.map((result) => (
            <button
              key={`${result.lat}-${result.lon}`}
              type="button"
              onClick={() => handleResultSelect(result)}
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
            >
              {result.display_name}
            </button>
          ))}
        </div>
      )}

      {isSearching && (
        <p className="text-xs text-gray-500">Searching locations...</p>
      )}

      <div className="h-80 overflow-hidden rounded-lg border border-gray-200">
        <MapContainer center={center} zoom={13} className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapViewUpdater center={center} />
          <MapClickHandler onSelect={onSelect} />
          {pickup && (
            <Marker position={[pickup.latitude, pickup.longitude]} icon={pickupIcon}>
              <Popup className="swiftride-popup">
                <div className="swiftride-popup__title">Pickup</div>
                <div className="swiftride-popup__address">{pickup.address}</div>
              </Popup>
            </Marker>
          )}
          {dropoff && (
            <Marker position={[dropoff.latitude, dropoff.longitude]} icon={dropoffIcon}>
              <Popup className="swiftride-popup">
                <div className="swiftride-popup__title">Dropoff</div>
                <div className="swiftride-popup__address">{dropoff.address}</div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </div>
  );
}
