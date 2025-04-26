import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { MapPin } from 'lucide-react';
import { divIcon } from 'leaflet';
import ReactDOMServer from 'react-dom/server';

type Props = {
  onLocationSelect?: (lat: number, lng: number) => void;
  isNew: boolean;
  lat: number;
  lng: number;
  isEdit: boolean;
};

type markerProps ={
  onSelect?: (lat: number, lng: number) => void;
  isNew: boolean;
  lat: number;
  lng: number;
  isEdit: boolean;
}

const CustomLucideMarker = ({ position }: { position: [number, number] }) => {
  const iconMarkup = ReactDOMServer.renderToString(
    <MapPin size={32} />
  );

  const customIcon = divIcon({
    html: iconMarkup,
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

  return <Marker position={position} icon={customIcon} />;
};

const LocationMarker: React.FC<markerProps> = ({ onSelect, isNew, lat, lng, isEdit }) => {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);

  if(isNew){
    useMapEvents({
      click(e: any) {
        setPosition(e.latlng);
        onSelect?.(e.latlng.lat, e.latlng.lng);
      },
    });
    return position ? <CustomLucideMarker position={[position.lat, position.lng]} /> : null;
  } else if(isEdit) {
    useMapEvents({
      click(e: any) {
        setPosition(e.latlng);
        onSelect?.(e.latlng.lat, e.latlng.lng);
      },
    });
    return position ? <CustomLucideMarker position={[position.lat, position.lng]} /> : <CustomLucideMarker position={[lat, lng]} />;
  } else {
    return <CustomLucideMarker position={[lat, lng]} />;
  }
};


const MapPicker: React.FC<Props> = ({ onLocationSelect, isNew, lat, lng, isEdit  }) => {

  const [cur, setCur] = useState<{ lat: number; lng: number }>({ lat: lat, lng: lng});


  if (isNew) {
    navigator.geolocation.getCurrentPosition((p) => {
      setCur({ lat: p.coords.latitude, lng: p.coords.longitude});
      // console.log(p);
    });
  }

    // unlimited function execution ...


  return (
    <MapContainer
      // center={[36.208465, 37.1555411]}
      center={cur}
      zoom={18}
      style={{ height: '250px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {isNew && !isEdit
        ?(
          <LocationMarker onSelect={onLocationSelect} isNew={isNew} lat={lat} lng={lng} isEdit={isEdit} />
        ): !isNew && !isEdit
        ?(
          <LocationMarker onSelect={onLocationSelect} isNew={isNew} lat={lat} lng={lng} isEdit={isEdit} />
        ):(
          <LocationMarker onSelect={onLocationSelect} isNew={isNew} lat={lat} lng={lng} isEdit={isEdit} />
        )}
    </MapContainer>
  );
};

export default MapPicker;
