"use client";

import { useMemo } from "react";
import { usePreferences } from "../context/PreferencesContext";

export default function PreferencesBar() {
  const {
    preferences,
    updateLanguage,
    updateCountry,
    updateSubdivision,
    updateCurrency,
    locationData,
  } = usePreferences();

  const subdivisionOptions = useMemo(() => {
    return locationData[preferences.country]?.subdivisions || {};
  }, [locationData, preferences.country]);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1100px",
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "12px",
        padding: "0 20px 16px",
        boxSizing: "border-box",
      }}
    >
      <div style={fieldWrapStyle}>
        <label style={labelStyle}>Language</label>
        <select
          value={preferences.language}
          onChange={(e) => updateLanguage(e.target.value)}
          style={selectStyle}
        >
          <option value="en">English</option>
          <option value="fr">Francais</option>
          <option value="es">Espanol</option>
        </select>
      </div>

      <div style={fieldWrapStyle}>
        <label style={labelStyle}>Country / Region</label>
        <select
          value={preferences.country}
          onChange={(e) => updateCountry(e.target.value)}
          style={selectStyle}
        >
          {Object.entries(locationData).map(([key, value]) => (
            <option key={key} value={key}>
              {value.label}
            </option>
          ))}
        </select>
      </div>

      <div style={fieldWrapStyle}>
        <label style={labelStyle}>Province / State</label>
        <select
          value={preferences.subdivision}
          onChange={(e) => updateSubdivision(e.target.value)}
          style={selectStyle}
        >
          {Object.entries(subdivisionOptions).map(([key, value]) => (
            <option key={key} value={key}>
              {value.label}
            </option>
          ))}
        </select>
      </div>

      <div style={fieldWrapStyle}>
        <label style={labelStyle}>Currency</label>
        <select
          value={preferences.currency}
          onChange={(e) => updateCurrency(e.target.value)}
          style={selectStyle}
        >
          <option value="CAD">CAD</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="MXN">MXN</option>
        </select>
      </div>
    </div>
  );
}

const fieldWrapStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
};

const labelStyle = {
  fontSize: "13px",
  fontWeight: "700",
  color: "#475569",
};

const selectStyle = {
  width: "100%",
  padding: "11px 12px",
  borderRadius: "12px",
  border: "1px solid #cbd5e1",
  backgroundColor: "#ffffff",
  fontSize: "15px",
  color: "#111827",
  boxSizing: "border-box",
};