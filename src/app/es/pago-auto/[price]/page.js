import { regions } from "../../../../data/regions";

export async function generateStaticParams() {
  const prices = [
    15000, 20000, 25000, 30000, 35000, 40000, 45000, 50000,
    55000, 60000, 70000, 80000, 90000, 100000,
  ];

  return prices.map((price) => ({
    price: price.toString(),
  }));
}

export default async function SpanishCarPaymentPage({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;

  const price = parseInt(resolvedParams.price, 10);

  const regionKey = resolvedSearch?.region || "canada";
  const region = regions[regionKey] || regions.canada;

  const currency = region.currency;
  const taxRate = region.taxRate;
  const interestRate = region.interestRate;

  function money(v) {
    return v.toLocaleString("es-ES", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    });
  }

  function calculateMonthlyPayment(loanAmount, annualRate, termYears) {
    const monthlyRate = annualRate / 100 / 12;
    const numberOfPayments = termYears * 12;

    if (!numberOfPayments || numberOfPayments <= 0) return 0;

    if (monthlyRate === 0) {
      return loanAmount / numberOfPayments;
    }

    return (
      (loanAmount * monthlyRate) /
      (1 - Math.pow(1 + monthlyRate, -numberOfPayments))
    );
  }

  if (Number.isNaN(price) || price <= 0) {
    return <div style={{ padding: 40 }}>Precio inválido.</div>;
  }

  const taxedPrice = Math.round(price * (1 + taxRate));
  const downPayment = Math.round(taxedPrice * 0.1);
  const financedAmount = taxedPrice - downPayment;

  const payment48 = Math.round(
    calculateMonthlyPayment(financedAmount, interestRate, 4)
  );

  const payment60 = Math.round(
    calculateMonthlyPayment(financedAmount, interestRate, 5)
  );

  const payment72 = Math.round(
    calculateMonthlyPayment(financedAmount, interestRate, 6)
  );

  const relatedPrices = [
    price - 10000,
    price - 5000,
    price + 5000,
    price + 10000,
  ].filter((value) => value > 0);

  const regionOptions = [
    { key: "canada", label: "Canada" },
    { key: "usa", label: "USA" },
    { key: "europe", label: "Europe" },
  ];

  return (
    <div style={{ maxWidth: 950, margin: "0 auto", padding: 40 }}>
      <section style={sectionStyle}>
        <p style={eyebrowStyle}>Guía de pago de auto</p>

        <h1 style={titleStyle}>
          Pago mensual de un auto de {money(price)}
        </h1>

        <p style={leadStyle}>
          Esta página estima el pago mensual de un auto con precio de {money(price)}.
          Usa supuestos regionales de impuestos, un pago inicial típico y condiciones
          de financiamiento realistas.
        </p>

        <div style={switcherWrapStyle}>
          <div style={switcherLabelStyle}>Elige tu región</div>

          <div style={switcherRowStyle}>
            {regionOptions.map((option) => {
              const isActive = option.key === regionKey;

              return (
                <a
                  key={option.key}
                  href={`/es/pago-auto/${price}?region=${option.key}`}
                  style={{
                    ...regionPillStyle,
                    backgroundColor: isActive ? "#111827" : "#ffffff",
                    color: isActive ? "#ffffff" : "#111827",
                    borderColor: isActive ? "#111827" : "#d1d5db",
                  }}
                >
                  {option.label}
                </a>
              );
            })}
          </div>

          <p style={switcherNoteStyle}>
            Región actual: <strong>{regionKey}</strong> · Moneda:{" "}
            <strong>{currency}</strong> · Impuesto:{" "}
            <strong>{(taxRate * 100).toFixed(1)}%</strong> · Interés:{" "}
            <strong>{interestRate}%</strong>
          </p>
        </div>
      </section>

      <section style={cardsGridStyle}>
        <div style={{ ...topCardStyle, border: "2px solid #22c55e" }}>
          <div style={greenLabelStyle}>48 meses</div>
          <div style={cardValueStyle}>{money(payment48)}/mes</div>
        </div>

        <div style={{ ...topCardStyle, border: "2px solid #facc15" }}>
          <div style={yellowLabelStyle}>60 meses</div>
          <div style={cardValueStyle}>{money(payment60)}/mes</div>
        </div>

        <div style={{ ...topCardStyle, border: "2px solid #ef4444" }}>
          <div style={redLabelStyle}>72 meses</div>
          <div style={cardValueStyle}>{money(payment72)}/mes</div>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={h2Style}>
          ¿Cuánto es el pago de un auto de {money(price)}?
        </h2>

        <p style={paragraphStyle}>
          Un auto de {money(price)} normalmente cuesta más que el precio publicado
          una vez que se agregan los impuestos. Con una tasa estimada de{" "}
          {(taxRate * 100).toFixed(1)}%, el precio con impuestos es de aproximadamente{" "}
          {money(taxedPrice)}. Con un pago inicial cercano a {money(downPayment)},
          el monto financiado puede quedar cerca de {money(financedAmount)}.
        </p>

        <p style={paragraphStyle}>
          A una tasa de interés cercana a {interestRate}%, el pago mensual puede estar
          alrededor de {money(payment48)} en 48 meses, {money(payment60)} en 60 meses,
          o {money(payment72)} en 72 meses.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={h2Style}>Páginas de pago relacionadas</h2>

        <div style={linksGridStyle}>
          {relatedPrices.map((value) => (
            <a
              key={value}
              href={`/es/pago-auto/${value}?region=${regionKey}`}
              style={linkCardStyle}
            >
              Pago mensual de un auto de {money(value)}
            </a>
          ))}
        </div>
      </section>

      <section style={ctaSectionStyle}>
        <h2 style={{ marginTop: 0, fontSize: "30px" }}>
          ¿Quieres una estimación más precisa?
        </h2>

        <p style={{ color: "#d1d5db", fontSize: "17px", lineHeight: 1.8 }}>
          Usa las herramientas completas de AffordThisCar para comparar autos,
          estimar el costo de propiedad y revisar ofertas reales.
        </p>

        <a href="/" style={ctaButtonStyle}>
          Abrir la calculadora completa
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

const switcherWrapStyle = {
  marginTop: "22px",
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "18px",
  padding: "18px",
};

const switcherLabelStyle = {
  fontSize: "14px",
  fontWeight: "800",
  color: "#334155",
  marginBottom: "12px",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const switcherRowStyle = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
};

const regionPillStyle = {
  display: "inline-block",
  textDecoration: "none",
  padding: "11px 16px",
  borderRadius: "999px",
  border: "1px solid",
  fontWeight: "700",
  fontSize: "14px",
};

const switcherNoteStyle = {
  marginTop: "12px",
  marginBottom: 0,
  color: "#475569",
  fontSize: "14px",
  lineHeight: 1.6,
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