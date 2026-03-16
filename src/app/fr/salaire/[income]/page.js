import { regions } from "../../../../data/regions";

export async function generateStaticParams() {
  const incomes = [
    30000,
    40000,
    50000,
    60000,
    70000,
    80000,
    90000,
    100000,
    120000,
    150000,
  ];

  return incomes.map((income) => ({
    income: income.toString(),
  }));
}

export default async function FrenchSalaryPage({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;

  const income = parseInt(resolvedParams.income, 10);

  const regionKey = resolvedSearch?.region || "canada";
  const region = regions[regionKey] || regions.canada;
  const currency = region.currency;

  function money(v) {
    return v.toLocaleString("fr-CA", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    });
  }

  if (Number.isNaN(income) || income <= 0) {
    return <div style={{ padding: 40 }}>Salaire invalide.</div>;
  }

  const safeCar = Math.round(income * 0.35);
  const stretchCar = Math.round(income * 0.5);
  const riskyCar = Math.round(income * 0.7);

  const relatedPrices = [20000, 30000, 40000, 50000];
  const relatedIncomes = [40000, 50000, 60000, 70000, 80000, 90000, 100000].filter(
    (value) => value !== income
  );

  return (
    <div style={{ maxWidth: 950, margin: "0 auto", padding: 40 }}>
      <section style={sectionStyle}>
        <p style={eyebrowStyle}>Guide salaire et budget auto</p>

        <h1 style={titleStyle}>
          Quelle voiture puis-je me permettre avec un salaire de {money(income)} ?
        </h1>

        <p style={leadStyle}>
          Ces estimations utilisent des plages simples d’abordabilité pour vous aider
          à comprendre quel budget automobile pourrait convenir à votre revenu, selon
          la région sélectionnée.
        </p>
      </section>

      <section style={cardsGridStyle}>
        <div style={{ ...topCardStyle, border: "2px solid #22c55e" }}>
          <div style={greenLabelStyle}>Budget sécuritaire</div>
          <div style={cardValueStyle}>{money(safeCar)}</div>
        </div>

        <div style={{ ...topCardStyle, border: "2px solid #facc15" }}>
          <div style={yellowLabelStyle}>Budget limite</div>
          <div style={cardValueStyle}>{money(stretchCar)}</div>
        </div>

        <div style={{ ...topCardStyle, border: "2px solid #ef4444" }}>
          <div style={redLabelStyle}>Budget risqué</div>
          <div style={cardValueStyle}>{money(riskyCar)}</div>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={h2Style}>Comment ces plages fonctionnent</h2>

        <p style={paragraphStyle}>
          Un budget sécuritaire est une estimation plus prudente. Un budget limite
          étire davantage vos finances, et un budget risqué peut laisser moins de
          place pour l’assurance, l’essence, l’entretien, l’épargne et les imprévus.
        </p>

        <p style={paragraphStyle}>
          Votre vraie capacité dépend aussi de vos dépenses mensuelles, de vos dettes,
          du taux d’intérêt, de la durée du prêt, des taxes, de la mise de fonds,
          de l’assurance et du carburant.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={relatedTitleStyle}>Pages reliées</h2>

        <div style={linksGridStyle}>
          {relatedPrices.map((price) => (
            <a
              key={price}
              href={`/fr/puis-je-me-permettre-une-voiture/${price}?region=${regionKey}`}
              style={linkCardStyle}
            >
              Puis-je me permettre une voiture de {money(price)} ?
            </a>
          ))}

          {relatedIncomes.slice(0, 4).map((value) => (
            <a
              key={value}
              href={`/fr/salaire/${value}?region=${regionKey}`}
              style={linkCardStyle}
            >
              Quelle voiture puis-je me permettre avec un salaire de {money(value)} ?
            </a>
          ))}
        </div>
      </section>

      <section style={ctaSectionStyle}>
        <h2 style={{ marginTop: 0, fontSize: "30px" }}>
          Vous voulez une réponse plus précise ?
        </h2>

        <p style={{ color: "#d1d5db", fontSize: "17px", lineHeight: 1.8 }}>
          Utilisez le calculateur complet AffordThisCar pour inclure vos dépenses,
          votre mise de fonds, votre taux d’intérêt, votre assurance et vos coûts
          d’essence.
        </p>

        <a href="/" style={ctaButtonStyle}>
          Ouvrir le calculateur complet
        </a>
      </section>
    </div>
  );
}

const sectionStyle = {
  backgroundColor: "white",
  borderRadius: "24px",
  padding: "32px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
  border: "1px solid #e2e8f0",
  marginBottom: "24px",
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
  fontSize: "46px",
  marginTop: 0,
  marginBottom: "16px",
  lineHeight: 1.1,
};

const leadStyle = {
  margin: 0,
  fontSize: "18px",
  color: "#475569",
  lineHeight: 1.7,
};

const cardsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "16px",
  marginBottom: "24px",
};

const topCardStyle = {
  padding: "22px",
  borderRadius: "16px",
  backgroundColor: "white",
};

const cardValueStyle = {
  fontSize: "30px",
  fontWeight: "800",
};

const greenLabelStyle = {
  fontSize: "14px",
  fontWeight: "800",
  color: "#15803d",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  marginBottom: "8px",
};

const yellowLabelStyle = {
  fontSize: "14px",
  fontWeight: "800",
  color: "#b45309",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  marginBottom: "8px",
};

const redLabelStyle = {
  fontSize: "14px",
  fontWeight: "800",
  color: "#b91c1c",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  marginBottom: "8px",
};

const h2Style = {
  marginTop: 0,
  fontSize: "30px",
};

const relatedTitleStyle = {
  marginTop: 0,
  fontSize: "28px",
};

const paragraphStyle = {
  color: "#475569",
  fontSize: "17px",
  lineHeight: 1.8,
};

const linksGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "12px",
};

const linkCardStyle = {
  display: "block",
  padding: "16px",
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "14px",
  textDecoration: "none",
  color: "#111827",
  fontWeight: "700",
  lineHeight: 1.5,
};

const ctaSectionStyle = {
  backgroundColor: "#111827",
  color: "white",
  borderRadius: "24px",
  padding: "32px",
};

const ctaButtonStyle = {
  display: "inline-block",
  marginTop: "10px",
  backgroundColor: "white",
  color: "#111827",
  textDecoration: "none",
  padding: "14px 20px",
  borderRadius: "14px",
  fontWeight: "800",
};