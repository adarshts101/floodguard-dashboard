import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase";

// Custom marker icons
const icons = {
  safe: new L.Icon({
    iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
    iconSize: [32, 32],
  }),
  warning: new L.Icon({
    iconUrl: "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
    iconSize: [32, 32],
  }),
  danger: new L.Icon({
    iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
    iconSize: [32, 32],
  }),
};

function MapView() {
  const [location, setLocation] = useState({ lat: 10.5276, lng: 76.2144 }); // Default: Thrissur
  const [alert, setAlert] = useState("Loading...");

  useEffect(() => {
    const dataRef = ref(db, "FloodGuard");
    onValue(dataRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setLocation(data.location || { lat: 10.5276, lng: 76.2144 });
        setAlert(data.alert || "Unknown");
      }
    });
  }, []);

  // Choose marker color
  const getIcon = () => {
    if (alert.includes("Flood")) return icons.danger;
    if (alert.includes("Warning")) return icons.warning;
    return icons.safe;
  };

  return (
    <div style={{ height: "400px", marginTop: "20px" }}>
      <MapContainer
        center={[location.lat, location.lng]}
        zoom={14}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[location.lat, location.lng]} icon={getIcon()}>
          <Popup>
            📍 Flood Location <br />
            Status: {alert} <br />
            Lat: {location.lat}, Lng: {location.lng}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default MapView;
