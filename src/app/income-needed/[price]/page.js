import { regions } from "../../../data/regions";

export async function generateStaticParams() {
  const prices = [
    15000, 20000, 25000, 30000, 35000, 40000, 45000, 50000,
    55000, 60000, 70000, 80000, 90000, 100000,
  ];

  return prices.map((price) => ({
    price: price.toString(),
  }));
}

export default async function IncomeNeededPage({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;

  const price = parseInt(resolvedParams.price, 10);

  const regionKey = resolvedSearch?.region || "canada";
  const region = regions[regionKey] || regions.canada;

  const currency = region.currency;
  const taxRate = region.taxRate;
  const interestRate = region.interestRate;

  function money(v) {
    return v.toLocaleString("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    });
  }

  if (Number.isNaN(price) || price <= 0) {
    return <div style={{ padding: 40 }}>Invalid price.</div>;
  }

  const taxedPrice = Math.round(price * (1 + taxRate));
  const safeIncome = Math.round(taxedPrice * 2.3);
  const stretchIncome = Math.round(taxedPrice * 1.65);
  const riskyIncome = Math.round(taxedPrice * 1.2);

  const downPayment = Math.round(taxedPrice * 0.1);
  const financedAmount = taxedPrice - downPayment;

  const relatedPrices = [
    price - 10000,
    price - 5000,
    price + 5000,
    price + 10000,
  ].filter((value) => value > 0);

  return (
    <div style={{ maxWidth: 950, margin: "0 auto", padding: 40 }}>
      <section style={sectionStyle}>
        <p style={eyebrowStyle}>Income needed guide</p>

        <h1 style={titleStyle}>
          Income needed for a {money(price)} car
        </h1>

        <p style={leadStyle}>
          This page estimates how much income is usually needed to afford a car
          priced at {money(price)}. It uses regional tax assumptions and realistic
          affordability ranges to show a safe income, a stretch income, and a
          risky income.
        </p>
      </section>

      <section style={cardsGridStyle}>
        <div style={{ ...topCardStyle, border: "2px solid #22c55e" }}>
          <div style={greenLabelStyle}>Safe income</div>
          <div style={cardValueStyle}>{money(safeIncome)}</div>
        </div>

        <div style={{ ...topCardStyle, border: "2px solid #facc15" }}>
          <div style={yellowLabelStyle}>Stretch income</div>
          <div style={cardValueStyle}>{money(stretchIncome)}</div>
        </div>

        <div style={{ ...topCardStyle, border: "2px solid #ef4444" }}>
          <div style={redLabelStyle}>Risky income</div>
          <div style={cardValueStyle}>{money(riskyIncome)}</div>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={h2Style}>How much salary do you need for a {money(price)} car?</h2>

        <p style={paragraphStyle}>
          A car priced at {money(price)} often needs more income than buyers expect,
          especially after taxes, insurance, gas, maintenance, and financing are included.
          With a regional tax rate of {(taxRate * 100).toFixed(1)}%, the after-tax
          cost is roughly {money(taxedPrice)}.
        </p>

        <p style={paragraphStyle}>
          In many cases, a safer income target is around {money(safeIncome)} per year.
          A stretch budget may start around {money(stretchIncome)}, while an income near{" "}
          {money(riskyIncome)} could make the purchase much harder to manage unless
          other expenses are very low.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={h2Style}>What affects the income needed most?</h2>

        <p style={paragraphStyle}>
          The biggest factors are taxes, interest rate, loan term, down payment,
          insurance, and fuel costs. A higher down payment reduces the financed amount,
          while a lower interest rate can reduce monthly payments significantly.
        </p>

        <p style={paragraphStyle}>
          These estimates assume an interest environment near {interestRate}% and
          a down payment around {money(downPayment)}. That leaves an estimated financed
          balance of about {money(financedAmount)} before insurance and other ownership costs.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={h2Style}>Related affordability pages</h2>

        <div style={linksGridStyle}>
          <a
            href={`/can-i-afford-a/${price}?region=${regionKey}`}
            style={linkCardStyle}
          >
            Can I afford a {money(price)} car?
          </a>

          <a
            href={`/car-payment/${price}?region=${regionKey}`}
            style={linkCardStyle}
          >
            Monthly payment on a {money(price)} car
          </a>

          <a
            href={`/salary/${safeIncome}?region=${regionKey}`}
            style={linkCardStyle}
          >
            What car can I afford with {money(safeIncome)} salary?
          </a>

          <a
            href={`/salary/${stretchIncome}?region=${regionKey}`}
            style={linkCardStyle}
          >
            What car can I afford with {money(stretchIncome)} salary?
          </a>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={h2Style}>Related income-needed pages</h2>

        <div style={linksGridStyle}>
          {relatedPrices.map((value) => (
            <a
              key={value}
              href={`/income-needed/${value}?region=${regionKey}`}
              style={linkCardStyle}
            >
              Income needed for a {money(value)} car
            </a>
          ))}
        </div>
      </section>

      <section style={ctaSectionStyle}>
        <h2 style={{ marginTop: 0, fontSize: "30px" }}>
          Want a more exact affordability answer?
        </h2>

        <p style={{ color: "#d1d5db", fontSize: "17px", lineHeight: 1.8 }}>
          Use the full AffordThisCar tools to estimate affordability, compare cars,
          review quotes, and calculate true ownership cost.
        </p>

        <a href="/" style={ctaButtonStyle}>
          Open the full calculator
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