const supportedPrices = [
  15000, 20000, 25000, 30000, 35000, 40000, 45000, 50000, 55000, 60000,
  65000, 70000, 75000, 80000, 85000, 90000, 95000, 100000,
];

const supportedIncomes = [
  30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000, 120000, 150000,
];

const DEFAULT_RATE = 6.9;
const DEFAULT_TERM = 5;
const DEFAULT_DOWN_PAYMENT_RATE = 0.1;

export async function generateStaticParams() {
  return supportedPrices.map((price) => ({
    price: price.toString(),
  }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const price = parseInt(resolvedParams.price, 10);

  return {
    title: `¿Puedo permitirme un auto de $${price.toLocaleString("es-ES")}? | AffordThisCar`,
    description: `Estima el ingreso necesario y el pago mensual aproximado para un auto de $${price.toLocaleString("es-ES")}.`,
  };
}

function money(x) {
  return x.toLocaleString("es-ES", {
    style: "currency",
    currency: "CAD",
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

export default async function SpanishPricePage({ params }) {
  const resolvedParams = await params;
  const price = parseInt(resolvedParams.price, 10);

  if (Number.isNaN(price) || price <= 0 || !supportedPrices.includes(price)) {
    return <div style={{ padding: 40 }}>Precio inválido.</div>;
  }

  const comfortableIncome = Math.round(price * 2.3);
  const stretchIncome = Math.round(price * 1.65);
  const riskyIncome = Math.round(price * 1.2);

  const estimatedDownPayment = Math.round(price * DEFAULT_DOWN_PAYMENT_RATE);
  const estimatedLoanAmount = price - estimatedDownPayment;
  const estimatedMonthlyPayment = Math.round(
    calculateMonthlyPayment(estimatedLoanAmount, DEFAULT_RATE, DEFAULT_TERM)
  );

  const nearbyPrices = supportedPrices
    .filter((p) => p !== price && Math.abs(p - price) <= 10000)
    .slice(0, 4);

  const nearbyIncomes = supportedIncomes.slice(0, 4);

  return (
    <div style={{ maxWidth: 950, margin: "0 auto", padding: 40 }}>
      <section style={sectionStyle}>
        <p style={eyebrowStyle}>Guía de asequibilidad de autos</p>

        <h1 style={titleStyle}>
          ¿Puedo permitirme un auto de {money(price)}?
        </h1>

        <p style={leadStyle}>
          Si estás considerando un vehículo de alrededor de {money(price)}, esta
          página te da una estimación rápida del ingreso que podría ser necesario
          para pagarlo de forma cómoda, ajustada o más riesgosa.
        </p>
      </section>

      <section style={cardsGridStyle}>
        <div style={{ ...topCardStyle, border: "2px solid #22c55e" }}>
          <div style={greenLabelStyle}>Ingreso cómodo</div>
          <div style={cardValueStyle}>{money(comfortableIncome)}</div>
        </div>

        <div style={{ ...topCardStyle, border: "2px solid #facc15" }}>
          <div style={yellowLabelStyle}>Ingreso ajustado</div>
          <div style={cardValueStyle}>{money(stretchIncome)}</div>
        </div>

        <div style={{ ...topCardStyle, border: "2px solid #ef4444" }}>
          <div style={redLabelStyle}>Ingreso riesgoso</div>
          <div style={cardValueStyle}>{money(riskyIncome)}</div>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={h2Style}>
          Pago mensual estimado para un auto de {money(price)}
        </h2>

        <div style={cardsGridStyle}>
          <div style={infoCardStyle}>
            <div style={infoLabelStyle}>Pago inicial estimado</div>
            <div style={infoValueStyle}>{money(estimatedDownPayment)}</div>
          </div>

          <div style={infoCardStyle}>
            <div style={infoLabelStyle}>Monto estimado del préstamo</div>
            <div style={infoValueStyle}>{money(estimatedLoanAmount)}</div>
          </div>

          <div style={infoCardStyle}>
            <div style={infoLabelStyle}>Pago mensual estimado</div>
            <div style={infoValueStyle}>{money(estimatedMonthlyPayment)}</div>
          </div>
        </div>

        <p style={paragraphStyle}>
          Esta estimación supone un pago inicial del {DEFAULT_DOWN_PAYMENT_RATE * 100}%,
          una tasa de interés del {DEFAULT_RATE}% y un plazo de {DEFAULT_TERM} años.
          Tu pago real puede variar según tu crédito, impuestos, aseguradora y prestamista.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={h2Style}>
          ¿Qué afecta si un auto de {money(price)} es asequible?
        </h2>

        <p style={paragraphStyle}>
          El precio de compra es solo una parte. La tasa de interés, el pago inicial,
          el plazo del préstamo, el seguro, la gasolina, los impuestos y tus gastos
          mensuales influyen en si este auto es una decisión segura o arriesgada.
        </p>

        <p style={paragraphStyle}>
          Una persona que gana alrededor de {money(comfortableIncome)} al año puede
          tener mucha más flexibilidad que alguien que financia el mismo vehículo con
          un presupuesto más ajustado o más deudas.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={relatedTitleStyle}>Páginas relacionadas</h2>

        <div style={linksGridStyle}>
          {nearbyPrices.map((relatedPrice) => (
            <a
              key={relatedPrice}
              href={`/es/puedo-permitirme-un-auto/${relatedPrice}`}
              style={linkCardStyle}
            >
              ¿Puedo permitirme un auto de {money(relatedPrice)}?
            </a>
          ))}

          {nearbyIncomes.map((income) => (
            <a
              key={income}
              href={`/es/salario/${income}`}
              style={linkCardStyle}
            >
              ¿Qué auto puedo permitirme con un salario de {money(income)}?
            </a>
          ))}
        </div>
      </section>

      <section style={ctaSectionStyle}>
        <h2 style={{ marginTop: 0, fontSize: "30px" }}>
          ¿Quieres una respuesta real con tus propios números?
        </h2>

        <p style={{ color: "#d1d5db", fontSize: "17px", lineHeight: 1.8 }}>
          Usa la calculadora completa de AffordThisCar para incluir ingresos,
          gastos, pago inicial, tasa de interés, seguro y combustible.
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

const infoCardStyle = {
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "16px",
  padding: "18px",
};

const infoLabelStyle = {
  fontSize: "14px",
  color: "#64748b",
  fontWeight: "700",
  marginBottom: "8px",
};

const infoValueStyle = {
  fontSize: "26px",
  fontWeight: "800",
  color: "#111827",
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