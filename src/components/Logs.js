// src/components/Logs.js
import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase";

function Logs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const logRef = ref(db, "FloodGuard/logs");
    onValue(logRef, (snapshot) => {
      if (snapshot.exists()) {
        setLogs(Object.values(snapshot.val()));
      } else {
        setLogs([]);
      }
    });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>📑 System Logs</h2>
      <ul>
        {logs.map((log, index) => (
          <li key={index}>{log.message}</li>
        ))}
      </ul>
    </div>
  );
}

export default Logs;
