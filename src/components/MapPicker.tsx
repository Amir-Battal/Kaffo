import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { divIcon } from "leaflet";
import { MapPin } from "lucide-react";
import ReactDOMServer from "react-dom/server";

interface MapPickerProps {
  lat: number;
  lng: number;
  onLocationSelect: (lat: number, lng: number) => void;
  disableMap?: boolean;
}

export default function MapPicker({
  lat,
  lng,
  onLocationSelect,
  disableMap = false,
}: MapPickerProps) {
  const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number }>({ lat, lng });

  useEffect(() => {
    setMarkerPosition({ lat, lng });
  }, [lat, lng]);

  function MapClickHandler() {
    useMapEvents({
      click(e) {
        if (disableMap) return;
        const { lat, lng } = e.latlng;
        setMarkerPosition({ lat, lng });
        onLocationSelect(lat, lng);
      },
    });
    return null;
  }
  const safeLat = lat ?? 0;  // 0 يعني خط الاستواء
  const safeLng = lng ?? 0;  // 0 يعني غرينتش


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
      scrollWheelZoom={!disableMap}
      dragging={!disableMap}
      doubleClickZoom={!disableMap}
      zoomControl={!disableMap}
      style={{
        height: "300px",
        width: "100%",
        pointerEvents: disableMap ? "none" : "auto", // يمنع كل التفاعل عند تعطيل الخريطة
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OSM</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {!disableMap && <MapClickHandler />}
      <Marker position={[markerPosition.lat ?? safeLat, markerPosition.lng ?? safeLng]} icon={markerIcon} />
    </MapContainer>
  );
}
