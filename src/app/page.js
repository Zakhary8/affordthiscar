"use client";

import { useEffect, useMemo, useState } from "react";
import { usePreferences } from "../context/PreferencesContext";
import { useVehicle } from "../context/VehicleContext";
import { useGarage } from "../context/GarageContext";

export default function Home() {
  const { preferences } = usePreferences();

  const {
    vehicle,
    updateVehicle,
    setFullVehicle,
    clearVehicle,
  } = useVehicle();

  const {
    vehicles,
    activeVehicle,
    saveVehicle,
    setActiveVehicle,
    deleteVehicle,
  } = useGarage();

  const [income, setIncome] = useState("");
  const [result, setResult] = useState(null);

  // 🔥 SYNC ACTIVE VEHICLE
  useEffect(() => {
    if (activeVehicle) {
      setFullVehicle(activeVehicle);
    }
  }, [activeVehicle]);

  function calculate() {
    if (!vehicle.price || !income) return;

    const monthlyIncome = Number(income) / 12;
    const monthlyPayment = Number(vehicle.price) / 60;

    const percent = (monthlyPayment / monthlyIncome) * 100;

    setResult({
      monthlyPayment,
      percent,
    });
  }

  return (
    <div style={container}>

      <h1 style={title}>Affordability Calculator</h1>

      {/* ACTIVE VEHICLE */}
      <div style={activeVehicleBox}>
        <strong>Active Vehicle:</strong>{" "}
        {vehicle.name || "None"} — ${vehicle.price || "—"}
      </div>

      {/* INPUTS */}
      <div style={grid}>
        <input
          placeholder="Vehicle Name"
          value={vehicle.name}
          onChange={(e) => updateVehicle("name", e.target.value)}
          style={input}
        />

        <input
          placeholder="Price"
          value={vehicle.price}
          onChange={(e) => updateVehicle("price", e.target.value)}
          style={input}
        />

        <input
          placeholder="Interest Rate"
          value={vehicle.interestRate}
          onChange={(e) => updateVehicle("interestRate", e.target.value)}
          style={input}
        />

        <input
          placeholder="Term (years)"
          value={vehicle.term}
          onChange={(e) => updateVehicle("term", e.target.value)}
          style={input}
        />

        <input
          placeholder="Income (yearly)"
          value={income}
          onChange={(e) => setIncome(e.target.value)}
          style={input}
        />
      </div>

      {/* BUTTONS */}
      <div style={buttonRow}>
        <button onClick={calculate} style={btnPrimary}>
          Calculate
        </button>

        <button onClick={() => saveVehicle(vehicle)} style={btnGreen}>
          Save Vehicle
        </button>

        <button onClick={clearVehicle} style={btnSecondary}>
          Clear
        </button>
      </div>

      {/* RESULTS */}
      {result && (
        <div style={resultBox}>
          <div>Monthly Payment: ${result.monthlyPayment.toFixed(0)}</div>
          <div>% of Income: {result.percent.toFixed(1)}%</div>
        </div>
      )}

      {/* 🔥 GARAGE SECTION */}
      <div style={garageSection}>
        <h2>Garage</h2>

        {vehicles.length === 0 && (
          <div style={{ opacity: 0.6 }}>No saved vehicles yet</div>
        )}

        {vehicles.map((v) => (
          <div
            key={v.id}
            style={{
              border:
                activeVehicle?.id === v.id
                  ? "2px solid #22c55e"
                  : "1px solid #ddd",
              padding: "12px",
              marginTop: "10px",
              borderRadius: "10px",
            }}
          >
            <strong>{v.name}</strong> — ${v.price}

            <div style={garageButtons}>
              <button
                onClick={() => setActiveVehicle(v.id)}
                style={btnPrimary}
              >
                Use
              </button>

              <button
                onClick={() => deleteVehicle(v.id)}
                style={btnSecondary}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* 🔥 STYLES */

const container = {
  maxWidth: "900px",
  margin: "0 auto",
};

const title = {
  fontSize: "32px",
  marginBottom: "20px",
};

const activeVehicleBox = {
  marginBottom: "20px",
  fontWeight: "600",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "10px",
};

const input = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ccc",
};

const buttonRow = {
  marginTop: "15px",
  display: "flex",
  gap: "10px",
};

const btnPrimary = {
  padding: "10px 16px",
  borderRadius: "8px",
  border: "none",
  background: "#111827",
  color: "white",
  fontWeight: "600",
  cursor: "pointer",
};

const btnGreen = {
  ...btnPrimary,
  background: "#22c55e",
};

const btnSecondary = {
  padding: "10px 16px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  background: "white",
  cursor: "pointer",
};

const resultBox = {
  marginTop: "20px",
  padding: "15px",
  border: "1px solid #ddd",
  borderRadius: "10px",
};

const garageSection = {
  marginTop: "40px",
};

const garageButtons = {
  marginTop: "8px",
  display: "flex",
  gap: "8px",
};