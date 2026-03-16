const supportedPrices = [
  15000, 20000, 25000, 30000, 35000, 40000, 45000, 50000, 55000, 60000,
  65000, 70000, 75000, 80000, 85000, 90000, 95000, 100000,
];

const supportedIncomes = [
  30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000, 120000, 150000,
];

export async function generateStaticParams() {
  return supportedPrices.map((price) => ({
    price: price.toString(),
  }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const price = parseInt(resolvedParams.price, 10);

  return {
    title: `Puis-je me permettre une voiture de ${price.toLocaleString("fr-CA")}$ ? | AffordThisCar`,
    description: `Estimez le revenu nécessaire pour vous permettre confortablement une voiture de ${price.toLocaleString("fr-CA")}$, avec des niveaux sécuritaire, limite et risqué.`,
  };
}

export default async function FrenchPricePage({ params }) {
  const resolvedParams = await params;
  const price = parseInt(resolvedParams.price, 10);

  function money(x) {
    return x.toLocaleString("fr-CA", {
      style: "currency",
      currency: "CAD",
      maximumFractionDigits: 0,
    });
  }

  if (Number.isNaN(price) || price <= 0 || !supportedPrices.includes(price)) {
    return <div style={{ padding: 40 }}>Prix invalide.</div>;
  }

  const revenuConfortable = Math.round(price * 2.3);
  const revenuLimite = Math.round(price * 1.65);
  const revenuRisque = Math.round(price * 1.2);

  const nearbyPrices = supportedPrices.filter(
    (p) => p !== price && Math.abs(p - price) <= 10000
  ).slice(0, 4);

  const nearbyIncomes = supportedIncomes.slice(0, 4);

  return (
    <div style={{ maxWidth: 950, margin: "0 auto", padding: 40 }}>
      <section
        style={{
          backgroundColor: "white",
          borderRadius: "24px",
          padding: "36px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          border: "1px solid #e2e8f0",
          marginBottom: "24px",
        }}
      >
        <p
          style={{
            margin: 0,
            marginBottom: "10px",
            color: "#64748b",
            fontSize: "14px",
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          Guide d’abordabilité auto
        </p>

        <h1
          style={{
            fontSize: "46px",
            marginTop: 0,
            marginBottom: "16px",
            lineHeight: 1.1,
          }}
        >
          Puis-je me permettre une voiture de {money(price)} ?
        </h1>

        <p
          style={{
            margin: 0,
            fontSize: "18px",
            color: "#475569",
            lineHeight: 1.7,
          }}
        >
          Si vous regardez un véhicule autour de {money(price)}, cette page vous
          donne une estimation rapide du revenu qui peut être nécessaire pour vous
          le permettre de façon confortable, plus serrée, ou plus risquée.
        </p>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            padding: "22px",
            border: "2px solid #22c55e",
            borderRadius: "16px",
            backgroundColor: "white",
          }}
        >
          <div
            style={{
              fontSize: "14px",
              fontWeight: "800",
              color: "#15803d",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "8px",
            }}
          >
            Revenu confortable
          </div>
          <div style={{ fontSize: "30px", fontWeight: "800" }}>
            {money(revenuConfortable)}
          </div>
        </div>

        <div
          style={{
            padding: "22px",
            border: "2px solid #facc15",
            borderRadius: "16px",
            backgroundColor: "white",
          }}
        >
          <div
            style={{
              fontSize: "14px",
              fontWeight: "800",
              color: "#b45309",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "8px",
            }}
          >
            Revenu limite
          </div>
          <div style={{ fontSize: "30px", fontWeight: "800" }}>
            {money(revenuLimite)}
          </div>
        </div>

        <div
          style={{
            padding: "22px",
            border: "2px solid #ef4444",
            borderRadius: "16px",
            backgroundColor: "white",
          }}
        >
          <div
            style={{
              fontSize: "14px",
              fontWeight: "800",
              color: "#b91c1c",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "8px",
            }}
          >
            Revenu risqué
          </div>
          <div style={{ fontSize: "30px", fontWeight: "800" }}>
            {money(revenuRisque)}
          </div>
        </div>
      </section>

      <section
        style={{
          backgroundColor: "white",
          borderRadius: "24px",
          padding: "32px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          border: "1px solid #e2e8f0",
          marginBottom: "24px",
        }}
      >
        <h2 style={{ marginTop: 0, fontSize: "30px" }}>
          Qu’est-ce qui influence l’abordabilité d’une voiture de {money(price)} ?
        </h2>

        <p style={{ color: "#475569", fontSize: "17px", lineHeight: 1.8 }}>
          Le prix d’achat n’est qu’une partie de l’équation. Le taux d’intérêt,
          la mise de fonds, la durée du prêt, l’assurance, l’essence, les taxes
          et vos dépenses mensuelles influencent tous si ce véhicule est un choix
          sécuritaire ou risqué.
        </p>

        <p style={{ color: "#475569", fontSize: "17px", lineHeight: 1.8 }}>
          Une personne qui gagne environ {money(revenuConfortable)} par année peut
          avoir beaucoup plus de marge qu’une autre qui finance le même véhicule
          avec un budget plus serré.
        </p>
      </section>

      <section
        style={{
          backgroundColor: "white",
          borderRadius: "24px",
          padding: "32px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          border: "1px solid #e2e8f0",
          marginBottom: "24px",
        }}
      >
        <h2 style={{ marginTop: 0, fontSize: "28px" }}>
          Pages reliées
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "12px",
          }}
        >
          {nearbyPrices.map((relatedPrice) => (
            <a
              key={relatedPrice}
              href={`/fr/puis-je-me-permettre-une-voiture/${relatedPrice}`}
              style={linkCardStyle}
            >
              Puis-je me permettre une voiture de {money(relatedPrice)} ?
            </a>
          ))}

          {nearbyIncomes.map((income) => (
            <a
              key={income}
              href={`/fr/salaire/${income}`}
              style={linkCardStyle}
            >
              Quelle voiture puis-je me permettre avec un salaire de {money(income)} ?
            </a>
          ))}
        </div>
      </section>

      <section
        style={{
          backgroundColor: "#111827",
          color: "white",
          borderRadius: "24px",
          padding: "32px",
        }}
      >
        <h2 style={{ marginTop: 0, fontSize: "30px" }}>
          Vous voulez une vraie réponse selon vos propres chiffres ?
        </h2>

        <p style={{ color: "#d1d5db", fontSize: "17px", lineHeight: 1.8 }}>
          Utilisez le calculateur complet AffordThisCar pour inclure votre revenu,
          vos dépenses, votre mise de fonds, votre taux d’intérêt, votre assurance
          et vos coûts d’essence.
        </p>

        <a
          href="/"
          style={{
            display: "inline-block",
            marginTop: "10px",
            backgroundColor: "white",
            color: "#111827",
            textDecoration: "none",
            padding: "14px 20px",
            borderRadius: "14px",
            fontWeight: "800",
          }}
        >
          Ouvrir le calculateur complet
        </a>
      </section>
    </div>
  );
}

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