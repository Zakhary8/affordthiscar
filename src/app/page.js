"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (activeVehicle) {
      setFullVehicle(activeVehicle);
    }
  }, [activeVehicle, setFullVehicle]);

  function calculate() {
    if (!vehicle.price || !income) return;

    const monthlyIncome = Number(income) / 12;
    const monthlyPayment = Number(vehicle.price) / 60;
    const percent = monthlyIncome > 0 ? (monthlyPayment / monthlyIncome) * 100 : 0;

    setResult({
      monthlyPayment,
      percent,
    });
  }

  function handleSaveVehicle() {
    saveVehicle(vehicle);
  }

  return (
    <div style={pageWrap}>
      <section style={heroCard}>
        <p style={eyebrowStyle}>Calculator</p>
        <h1 style={titleStyle}>Affordability Calculator</h1>
        <p style={leadStyle}>
          Quickly estimate if a vehicle payment fits your income, then save it to your garage
          and reuse it across the site.
        </p>
      </section>

      <section style={mainGrid}>
        <div style={cardStyle}>
          <div style={sectionHeaderRow}>
            <div>
              <h2 style={sectionTitleStyle}>Calculator</h2>
              <p style={sectionTextStyle}>
                Your active vehicle fills this form automatically.
              </p>
            </div>
          </div>

          <div style={activeVehicleBox}>
            <strong>Active Vehicle:</strong>{" "}
            {vehicle?.name || "None"} — ${vehicle?.price || "—"}
          </div>

          <div style={gridStyle}>
            <div>
              <label style={labelStyle}>Vehicle Name</label>
              <input
                placeholder="Mazda CX-5"
                value={vehicle.name}
                onChange={(e) => updateVehicle("name", e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Price</label>
              <input
                placeholder="34999"
                value={vehicle.price}
                onChange={(e) => updateVehicle("price", e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Interest Rate (%)</label>
              <input
                placeholder="6.99"
                value={vehicle.interestRate}
                onChange={(e) => updateVehicle("interestRate", e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Term (years)</label>
              <input
                placeholder="5"
                value={vehicle.term}
                onChange={(e) => updateVehicle("term", e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Income (yearly)</label>
              <input
                placeholder="60000"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          <div style={buttonRow}>
            <button onClick={calculate} style={primaryButton}>
              Calculate
            </button>

            <button onClick={handleSaveVehicle} style={greenButton}>
              Save Vehicle
            </button>

            <button onClick={clearVehicle} style={secondaryButton}>
              Clear
            </button>
          </div>

          {result && (
            <div style={resultBox}>
              <div style={resultStat}>
                <span style={resultLabel}>Monthly Payment</span>
                <span style={resultValue}>${result.monthlyPayment.toFixed(0)}</span>
              </div>

              <div style={resultStat}>
                <span style={resultLabel}>% of Income</span>
                <span style={resultValue}>{result.percent.toFixed(1)}%</span>
              </div>
            </div>
          )}
        </div>

        <div style={cardStyle}>
          <div style={sectionHeaderRow}>
            <div>
              <h2 style={sectionTitleStyle}>Garage</h2>
              <p style={sectionTextStyle}>
                Saved vehicles stay available for compare and other tools.
              </p>
            </div>
          </div>

          {vehicles.length === 0 ? (
            <div style={emptyStateStyle}>No saved vehicles yet</div>
          ) : (
            <div style={garageListStyle}>
              {vehicles.map((v) => {
                const isActive = activeVehicle?.id === v.id;

                return (
                  <div
                    key={v.id}
                    style={{
                      ...garageCardStyle,
                      border: isActive ? "2px solid #22c55e" : "1px solid #e5e7eb",
                    }}
                  >
                    <div style={garageTopRow}>
                      <div>
                        <div style={garageNameStyle}>{v.name || "Untitled Vehicle"}</div>
                        <div style={garagePriceStyle}>${v.price || "—"}</div>
                      </div>

                      {isActive && <div style={activeBadgeStyle}>Active</div>}
                    </div>

                    <div style={miniMetaStyle}>
                      <span>{v.interestRate || "—"}%</span>
                      <span>{v.term || "—"} years</span>
                    </div>

                    <div style={garageButtonRow}>
                      <button
                        onClick={() => setActiveVehicle(v.id)}
                        style={smallDarkButton}
                      >
                        Use
                      </button>

                      <button
                        onClick={() => deleteVehicle(v.id)}
                        style={smallLightButton}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div style={garageTipStyle}>
            Tip: save a vehicle here, then go to Compare and drop it into Car 1 or Car 2.
          </div>
        </div>
      </section>
    </div>
  );
}

const pageWrap = {
  display: "flex",
  flexDirection: "column",
  gap: "24px",
};

const heroCard = {
  backgroundColor: "white",
  borderRadius: "24px",
  padding: "32px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
  border: "1px solid #e2e8f0",
};

const eyebrowStyle = {
  margin: 0,
  marginBottom: "10px",
  color: "#64748b",
  fontSize: "14px",
  fontWeight: "700",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};

const titleStyle = {
  margin: 0,
  marginBottom: "12px",
  fontSize: "42px",
  lineHeight: 1.1,
};

const leadStyle = {
  margin: 0,
  fontSize: "17px",
  lineHeight: 1.7,
  color: "#475569",
};

const mainGrid = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1.35fr) minmax(320px, 0.85fr)",
  gap: "20px",
  alignItems: "start",
};

const cardStyle = {
  backgroundColor: "white",
  borderRadius: "24px",
  padding: "28px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
  border: "1px solid #e2e8f0",
};

const sectionHeaderRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "12px",
  marginBottom: "18px",
};

const sectionTitleStyle = {
  margin: 0,
  fontSize: "28px",
};

const sectionTextStyle = {
  margin: "6px 0 0",
  color: "#64748b",
  fontSize: "15px",
};

const activeVehicleBox = {
  marginBottom: "20px",
  padding: "14px 16px",
  borderRadius: "14px",
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  fontWeight: "600",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "14px",
};

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  fontWeight: "700",
  color: "#334155",
  fontSize: "14px",
};

const inputStyle = {
  width: "100%",
  padding: "13px",
  fontSize: "16px",
  borderRadius: "12px",
  border: "1px solid #cbd5e1",
  boxSizing: "border-box",
  backgroundColor: "#ffffff",
};

const buttonRow = {
  marginTop: "18px",
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",
};

const primaryButton = {
  padding: "12px 18px",
  borderRadius: "10px",
  border: "none",
  background: "#111827",
  color: "white",
  fontWeight: "700",
  cursor: "pointer",
};

const greenButton = {
  ...primaryButton,
  background: "#22c55e",
};

const secondaryButton = {
  padding: "12px 18px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
  background: "white",
  color: "#111827",
  fontWeight: "700",
  cursor: "pointer",
};

const resultBox = {
  marginTop: "22px",
  padding: "20px",
  border: "1px solid #e2e8f0",
  borderRadius: "18px",
  backgroundColor: "#f8fafc",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "16px",
};

const resultStat = {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
};

const resultLabel = {
  color: "#64748b",
  fontSize: "14px",
  fontWeight: "700",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

const resultValue = {
  fontSize: "30px",
  fontWeight: "800",
  color: "#111827",
};

const emptyStateStyle = {
  padding: "18px",
  borderRadius: "14px",
  border: "1px solid #e2e8f0",
  backgroundColor: "#f8fafc",
  color: "#64748b",
};

const garageListStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const garageCardStyle = {
  borderRadius: "16px",
  padding: "16px",
  backgroundColor: "#f8fafc",
};

const garageTopRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "10px",
};

const garageNameStyle = {
  fontWeight: "800",
  fontSize: "18px",
  color: "#111827",
};

const garagePriceStyle = {
  marginTop: "4px",
  color: "#475569",
  fontSize: "15px",
};

const activeBadgeStyle = {
  backgroundColor: "#dcfce7",
  color: "#166534",
  border: "1px solid #86efac",
  borderRadius: "999px",
  padding: "4px 10px",
  fontSize: "12px",
  fontWeight: "800",
};

const miniMetaStyle = {
  display: "flex",
  gap: "14px",
  marginTop: "10px",
  color: "#64748b",
  fontSize: "14px",
};

const garageButtonRow = {
  marginTop: "14px",
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
};

const smallDarkButton = {
  padding: "10px 14px",
  borderRadius: "10px",
  border: "none",
  background: "#111827",
  color: "white",
  fontWeight: "700",
  cursor: "pointer",
};

const smallLightButton = {
  padding: "10px 14px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
  background: "white",
  color: "#111827",
  fontWeight: "700",
  cursor: "pointer",
};

const garageTipStyle = {
  marginTop: "16px",
  color: "#64748b",
  fontSize: "14px",
  lineHeight: 1.6,
};