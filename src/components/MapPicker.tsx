import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { divIcon } from "leaflet";
import { MapPin } from "lucide-react";
import ReactDOMServer from "react-dom/server";

interface MapPickerProps {
  lat: number;
  lng: number;
  onLocationSelect: (lat: number, lng: number) => void;
}

export default function MapPicker({
  lat,
  lng,
  onLocationSelect,
}: MapPickerProps) {
  const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number }>({
    lat,
    lng,
  });

  useEffect(() => {
    setMarkerPosition({ lat, lng });
  }, [lat, lng]);

  function MapClickHandler() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setMarkerPosition({ lat, lng });
        onLocationSelect(lat, lng);
      },
    });
    return null;
  }

  const markerIcon = divIcon({
    html: ReactDOMServer.renderToString(<MapPin size={32} />),
    className: "custom-marker",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={30}
      scrollWheelZoom={true}
      style={{ height: "300px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OSM</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapClickHandler />
      <Marker position={[markerPosition.lat, markerPosition.lng]} icon={markerIcon} />
    </MapContainer>
  );
}
