"use client";

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
    home: "Home",
    compareCars: "Compare Cars",
  };
}

export function LanguageAwareNav() {
  const { preferences } = usePreferences();
  const labels = getNavLabels(preferences.language);

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
      <a href={getLocalizedPath(preferences.language, "home")} style={navLinkStyle}>
        {labels.calculator}
      </a>
      <a href={getLocalizedPath(preferences.language, "compare")} style={navLinkStyle}>
        {labels.compare}
      </a>
      <a href={getLocalizedPath(preferences.language, "ownership")} style={navLinkStyle}>
        {labels.ownership}
      </a>
      <a href={getLocalizedPath(preferences.language, "deal")} style={navLinkStyle}>
        {labels.deal}
      </a>
      <a href={getLocalizedPath(preferences.language, "payments")} style={navLinkStyle}>
        {labels.payments}
      </a>
      <a href={getLocalizedPath(preferences.language, "income")} style={navLinkStyle}>
        {labels.income}
      </a>
      <a href={getLocalizedPath(preferences.language, "lease")} style={navLinkStyle}>
        {labels.lease}
      </a>
    </nav>
  );
}

export function LanguageAwareFooterNav() {
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
      <a href={getLocalizedPath(preferences.language, "home")} style={navLinkStyle}>
        {labels.home}
      </a>
      <a href={getLocalizedPath(preferences.language, "compare")} style={navLinkStyle}>
        {labels.compareCars}
      </a>
      <a href={getLocalizedPath(preferences.language, "ownership")} style={navLinkStyle}>
        {labels.ownership}
      </a>
      <a href={getLocalizedPath(preferences.language, "deal")} style={navLinkStyle}>
        {labels.deal}
      </a>
      <a href={getLocalizedPath(preferences.language, "payments")} style={navLinkStyle}>
        {labels.payments}
      </a>
      <a href={getLocalizedPath(preferences.language, "income")} style={navLinkStyle}>
        {labels.income}
      </a>
      <a href={getLocalizedPath(preferences.language, "lease")} style={navLinkStyle}>
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