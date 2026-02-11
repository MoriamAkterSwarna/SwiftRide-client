/* eslint-disable @typescript-eslint/no-explicit-any */

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Map click handler component
const MapClickHandler = ({ onLocationSelect }: { 
  onLocationSelect: (lat: number, lng: number, address: string) => void;
}) => {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      
      // Reverse geocoding to get address
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
          {
            headers: {
              'User-Agent': 'SwiftRide App' // Required by Nominatim
            }
          }
        );
        const data = await response.json();
        
        let address = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        
        // Try to get a more readable address
        if (data.address) {
          const parts = [];
          if (data.address.road) parts.push(data.address.road);
          if (data.address.suburb) parts.push(data.address.suburb);
          if (data.address.city || data.address.town) parts.push(data.address.city || data.address.town);
          if (data.address.state) parts.push(data.address.state);
          if (data.address.country) parts.push(data.address.country);
          
          if (parts.length > 0) {
            address = parts.join(', ');
          }
        }
        
        onLocationSelect(lat, lng, address);
      } catch (error) {
        console.error('Geocoding error:', error);
        // Fallback to coordinates if geocoding fails
        onLocationSelect(lat, lng, `${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      }
    },
  });
  return null;
};

// Interactive Map Component
const RealMapComponent = ({ 
  onLocationSelect, 
  initialLocation,
  markerPosition 
}: { 
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  initialLocation?: { lat: number; lng: number };
  markerPosition?: { lat: number; lng: number };
}) => {
  const defaultCenter = initialLocation || { lat: 23.8103, lng: 90.4125 }; // Dhaka
  
  return (
    <div className="w-full h-64 rounded-lg overflow-hidden border border-gray-300">
      <MapContainer
        center={[defaultCenter.lat, defaultCenter.lng]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapClickHandler onLocationSelect={onLocationSelect} />
        
        {markerPosition && (
          <Marker position={[markerPosition.lat, markerPosition.lng]}>
            <Popup>
              <div className="text-sm">
                <div className="font-semibold">Selected Location</div>
                <div>Lat: {markerPosition.lat.toFixed(6)}</div>
                <div>Lng: {markerPosition.lng.toFixed(6)}</div>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default RealMapComponent;
