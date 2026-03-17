"use client";

import { useEffect, useMemo, useState } from "react";
import { usePreferences } from "../context/PreferencesContext";

function getRedirectPath(currentPath, newLanguage) {
  const exactMap = {
    "/": {
      en: "/",
      fr: "/",
      es: "/",
    },
    "/compare": {
      en: "/compare",
      fr: "/compare",
      es: "/compare",
    },
    "/ownership-cost": {
      en: "/ownership-cost",
      fr: "/ownership-cost",
      es: "/ownership-cost",
    },
    "/deal-review": {
      en: "/deal-review",
      fr: "/deal-review",
      es: "/deal-review",
    },
    "/car-payment/30000": {
      en: "/car-payment/30000",
      fr: "/fr/paiement-auto/30000",
      es: "/es/pago-auto/30000",
    },
    "/fr/paiement-auto/30000": {
      en: "/car-payment/30000",
      fr: "/fr/paiement-auto/30000",
      es: "/es/pago-auto/30000",
    },
    "/es/pago-auto/30000": {
      en: "/car-payment/30000",
      fr: "/fr/paiement-auto/30000",
      es: "/es/pago-auto/30000",
    },
    "/income-needed/30000": {
      en: "/income-needed/30000",
      fr: "/fr/salaire/70000",
      es: "/es/salario/70000",
    },
    "/salary/70000": {
      en: "/salary/70000",
      fr: "/fr/salaire/70000",
      es: "/es/salario/70000",
    },
    "/fr/salaire/70000": {
      en: "/salary/70000",
      fr: "/fr/salaire/70000",
      es: "/es/salario/70000",
    },
    "/es/salario/70000": {
      en: "/salary/70000",
      fr: "/fr/salaire/70000",
      es: "/es/salario/70000",
    },
    "/can-i-afford-a/30000": {
      en: "/can-i-afford-a/30000",
      fr: "/fr/puis-je-me-permettre-une-voiture/30000",
      es: "/es/puedo-permitirme-un-auto/30000",
    },
    "/fr/puis-je-me-permettre-une-voiture/30000": {
      en: "/can-i-afford-a/30000",
      fr: "/fr/puis-je-me-permettre-une-voiture/30000",
      es: "/es/puedo-permitirme-un-auto/30000",
    },
    "/es/puedo-permitirme-un-auto/30000": {
      en: "/can-i-afford-a/30000",
      fr: "/fr/puis-je-me-permettre-une-voiture/30000",
      es: "/es/puedo-permitirme-un-auto/30000",
    },
  };

  if (exactMap[currentPath] && exactMap[currentPath][newLanguage]) {
    return exactMap[currentPath][newLanguage];
  }

  if (newLanguage === "fr") return "/";
  if (newLanguage === "es") return "/";
  return "/";
}

export default function PreferencesBar() {
  const {
    preferences,
    updateLanguage,
    updateCountry,
    updateSubdivision,
    updateCurrency,
    locationData,
  } = usePreferences();

  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    function handleResize() {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setIsOpen(!mobile);
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const subdivisionOptions = useMemo(() => {
    return locationData[preferences.country]?.subdivisions || {};
  }, [locationData, preferences.country]);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "0 20px 12px",
        boxSizing: "border-box",
      }}
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        style={toggleButtonStyle}
      >
        <span>Preferences</span>
        <span>{isOpen ? "−" : "+"}</span>
      </button>

      {isOpen && (
        <div
          style={{
            ...panelStyle,
            gridTemplateColumns: isMobile
              ? "1fr"
              : "repeat(auto-fit, minmax(180px, 1fr))",
          }}
        >
          <div style={fieldWrapStyle}>
            <label style={labelStyle}>Language</label>
            <select
              value={preferences.language}
              onChange={(e) => {
                const newLanguage = e.target.value;
                updateLanguage(newLanguage);

                const currentPath = window.location.pathname;
                const newPath = getRedirectPath(currentPath, newLanguage);

                if (newPath !== currentPath) {
                  window.location.href = newPath;
                }
              }}
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
      )}
    </div>
  );
}

const toggleButtonStyle = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "12px 14px",
  borderRadius: "14px",
  border: "1px solid #cbd5e1",
  backgroundColor: "#f8fafc",
  color: "#111827",
  fontSize: "15px",
  fontWeight: "700",
  cursor: "pointer",
  marginBottom: "10px",
};

const panelStyle = {
  display: "grid",
  gap: "12px",
  backgroundColor: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "16px",
  padding: "14px",
};

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