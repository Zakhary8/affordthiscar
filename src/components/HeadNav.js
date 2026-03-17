"use client";

import { useEffect, useState } from "react";
import { usePreferences } from "../context/PreferencesContext";

function getLocalizedPath(language, type) {
  if (language === "fr") {
    if (type === "home") return "/";
    if (type === "compare") return "/compare";
    if (type === "ownership") return "/ownership-cost";
    if (type === "deal") return "/deal-review";
    if (type === "payments") return "/fr/paiement-auto/30000";
    if (type === "income") return "/fr/salaire/70000";
    if (type === "lease") return "/lease-vs-finance";
  }

  if (language === "es") {
    if (type === "home") return "/";
    if (type === "compare") return "/compare";
    if (type === "ownership") return "/ownership-cost";
    if (type === "deal") return "/deal-review";
    if (type === "payments") return "/es/pago-auto/30000";
    if (type === "income") return "/es/salario/70000";
    if (type === "lease") return "/lease-vs-finance";
  }

  if (type === "home") return "/";
  if (type === "compare") return "/compare";
  if (type === "ownership") return "/ownership-cost";
  if (type === "deal") return "/deal-review";
  if (type === "payments") return "/car-payment/30000";
  if (type === "income") return "/income-needed/30000";
  if (type === "lease") return "/lease-vs-finance";

  return "/";
}

function getNavLabels(language) {
  if (language === "fr") {
    return {
      calculator: "Calculateur",
      compare: "Comparer",
      ownership: "Cout de possession",
      deal: "Analyse d offre",
      payments: "Paiements",
      income: "Revenu requis",
      lease: "Location vs financement",
      menu: "Menu",
      close: "Fermer",
      home: "Accueil",
      compareCars: "Comparer voitures",
    };
  }

  if (language === "es") {
    return {
      calculator: "Calculadora",
      compare: "Comparar",
      ownership: "Costo total",
      deal: "Revision de oferta",
      payments: "Pagos",
      income: "Ingreso necesario",
      lease: "Arrendar vs financiar",
      menu: "Menu",
      close: "Cerrar",
      home: "Inicio",
      compareCars: "Comparar autos",
    };
  }

  return {
    calculator: "Calculator",
    compare: "Compare",
    ownership: "Ownership Cost",
    deal: "Deal Review",
    payments: "Payments",
    income: "Income Needed",
    lease: "Lease vs Finance",
    menu: "Menu",
    close: "Close",
    home: "Home",
    compareCars: "Compare Cars",
  };
}

export function HeaderNav() {
  const { preferences } = usePreferences();
  const labels = getNavLabels(preferences.language);

  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    function handleResize() {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);

      if (!mobile) {
        setIsMenuOpen(false);
      }
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navItems = [
    { key: "home", label: labels.calculator },
    { key: "compare", label: labels.compare },
    { key: "ownership", label: labels.ownership },
    { key: "deal", label: labels.deal },
    { key: "payments", label: labels.payments },
    { key: "income", label: labels.income },
    { key: "lease", label: labels.lease },
  ];

  if (!isMobile) {
    return (
      <nav
        style={{
          display: "flex",
          gap: "18px",
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {navItems.map((item) => (
          <a
            key={item.key}
            href={getLocalizedPath(preferences.language, item.key)}
            style={navLinkStyle}
          >
            {item.label}
          </a>
        ))}
      </nav>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1100px",
        padding: "0 20px",
        boxSizing: "border-box",
      }}
    >
      <button
        type="button"
        onClick={() => setIsMenuOpen((prev) => !prev)}
        style={menuButtonStyle}
      >
        <span>{labels.menu}</span>
        <span>{isMenuOpen ? "−" : "+"}</span>
      </button>

      {isMenuOpen && (
        <div style={mobileMenuPanelStyle}>
          {navItems.map((item) => (
            <a
              key={item.key}
              href={getLocalizedPath(preferences.language, item.key)}
              style={mobileNavLinkStyle}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export function FooterNav() {
  const { preferences } = usePreferences();
  const labels = getNavLabels(preferences.language);

  return (
    <div
      style={{
        display: "flex",
        gap: "18px",
        flexWrap: "wrap",
      }}
    >
      <a href={getLocalizedPath(preferences.language, "home")} style={footerLinkStyle}>
        {labels.home}
      </a>
      <a href={getLocalizedPath(preferences.language, "compare")} style={footerLinkStyle}>
        {labels.compareCars}
      </a>
      <a href={getLocalizedPath(preferences.language, "ownership")} style={footerLinkStyle}>
        {labels.ownership}
      </a>
      <a href={getLocalizedPath(preferences.language, "deal")} style={footerLinkStyle}>
        {labels.deal}
      </a>
      <a href={getLocalizedPath(preferences.language, "payments")} style={footerLinkStyle}>
        {labels.payments}
      </a>
      <a href={getLocalizedPath(preferences.language, "income")} style={footerLinkStyle}>
        {labels.income}
      </a>
      <a href={getLocalizedPath(preferences.language, "lease")} style={footerLinkStyle}>
        {labels.lease}
      </a>
    </div>
  );
}

const navLinkStyle = {
  textDecoration: "none",
  color: "#111827",
  fontWeight: "600",
  fontSize: "15px",
};

const footerLinkStyle = {
  textDecoration: "none",
  color: "#111827",
  fontWeight: "600",
  fontSize: "15px",
};

const menuButtonStyle = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "12px 14px",
  borderRadius: "14px",
  border: "1px solid #cbd5e1",
  backgroundColor: "#ffffff",
  color: "#111827",
  fontSize: "15px",
  fontWeight: "700",
  cursor: "pointer",
};

const mobileMenuPanelStyle = {
  marginTop: "10px",
  display: "grid",
  gap: "10px",
  backgroundColor: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "16px",
  padding: "14px",
};

const mobileNavLinkStyle = {
  display: "block",
  textDecoration: "none",
  color: "#111827",
  fontWeight: "700",
  fontSize: "16px",
  padding: "10px 12px",
  borderRadius: "12px",
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
};