// src/components/Dashboard.js
import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase";
import MapView from "./MapView"; // 👈 add map component
import "./Dashboard.css";

function Dashboard() {
  const [data, setData] = useState({ alert: "Loading...", distance: "-", waterValue: "-" });

  useEffect(() => {
    const dataRef = ref(db, "FloodGuard");
    onValue(dataRef, (snapshot) => {
      if (snapshot.exists()) {
        setData(snapshot.val());
      } else {
        setData({ alert: "No data", distance: "-", waterValue: "-" });
      }
    });
  }, []);

  // Alert color logic
  const getAlertClass = (alert) => {
    if (alert.includes("Flood")) return "alert-danger";
    if (alert.includes("Warning")) return "alert-warning";
    if (alert.includes("Safe")) return "alert-safe";
    return "alert-neutral";
  };

  return (
    <div className="dashboard">
      <h1>🌊 FloodGuard Dashboard</h1>
      <p className="subtitle">Live Monitoring of Flood Status</p>

      {/* Grid Layout */}
      <div className="grid">
        {/* Distance Card */}
        <div className="card">
          <h2>📏 Distance</h2>
          <p>{data.distance} cm</p>
        </div>

        {/* Water Value Card */}
        <div className="card">
          <h2>💧 Water Sensor</h2>
          <p>{data.waterValue}</p>
        </div>

        {/* Status Card */}
        <div className={`card status ${getAlertClass(data.alert)}`}>
          <h2>🚨 Status</h2>
          <p>{data.alert}</p>
        </div>
      </div>

      {/* Map View */}
      <MapView />

      <footer>⚡ ESP32 + Firebase + React + GPS</footer>
    </div>
  );
}

export default Dashboard;
