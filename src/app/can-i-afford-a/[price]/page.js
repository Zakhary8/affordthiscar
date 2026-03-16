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

export default async function PricePage({ params, searchParams }) {
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

  const relatedSalaries = [40000, 50000, 60000, 70000, 80000, 100000];

  return (
    <div style={{ maxWidth: 950, margin: "0 auto", padding: 40 }}>
      <section style={sectionStyle}>
        <p style={eyebrowStyle}>Car affordability guide</p>

        <h1 style={titleStyle}>
          Can I afford a {money(price)} car?
        </h1>

        <p style={leadStyle}>
          This page estimates the income usually needed to afford a car priced at{" "}
          {money(price)}. It includes regional tax assumptions, financing context,
          and quick budget ranges to help you decide whether this vehicle price feels
          realistic for your situation.
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
        <h2 style={h2Style}>How much salary is usually needed for a {money(price)} car?</h2>

        <p style={paragraphStyle}>
          A vehicle priced at {money(price)} often requires an income between{" "}
          {money(safeIncome)} and {money(stretchIncome)} depending on taxes, interest
          rate, insurance, gas, and existing monthly expenses. A lower income may still
          qualify for financing, but that does not always mean the purchase is comfortable.
        </p>

        <p style={paragraphStyle}>
          This is why searches like “can I afford a {money(price)} car” or “salary needed
          for a {money(price)} car” are best answered with both car-price pages and
          salary-based pages. A lender may approve a loan, but affordability also depends
          on whether you still have room for savings and unexpected costs.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={h2Style}>Estimated after-tax and financing context</h2>

        <p style={paragraphStyle}>
          With a regional tax rate of {(taxRate * 100).toFixed(1)}%, a{" "}
          {money(price)} car becomes roughly {money(taxedPrice)} before financing.
          If you put around {money(downPayment)} down, the financed amount may be around{" "}
          {money(financedAmount)}. The actual monthly payment depends on the loan term,
          interest rate, and dealer fees, but these estimates assume a financing
          environment near {interestRate}% interest.
        </p>

        <p style={paragraphStyle}>
          That means a car that looks reasonable at first glance can become much more
          expensive once taxes, insurance, fuel, maintenance, and registration are added.
          That is exactly why comparing the sticker price alone is rarely enough.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={h2Style}>Popular salary pages for this price</h2>

        <div style={linksGridStyle}>
          {relatedSalaries.map((salary) => (
            <a
              key={salary}
              href={`/salary/${salary}?region=${regionKey}`}
              style={linkCardStyle}
            >
              What car can I afford with a {money(salary)} salary?
            </a>
          ))}
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={h2Style}>Related car price pages</h2>

        <div style={linksGridStyle}>
          {relatedPrices.map((value) => (
            <a
              key={value}
              href={`/can-i-afford-a/${value}?region=${regionKey}`}
              style={linkCardStyle}
            >
              Can I afford a {money(value)} car?
            </a>
          ))}
        </div>
      </section>

      <section style={ctaSectionStyle}>
        <h2 style={{ marginTop: 0, fontSize: "30px" }}>
          Want a more accurate affordability answer?
        </h2>

        <p style={{ color: "#d1d5db", fontSize: "17px", lineHeight: 1.8 }}>
          Use the full AffordThisCar calculator to include your expenses, down payment,
          insurance, fuel costs, and financing details.
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