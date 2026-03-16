import { regions } from "../../../data/regions";

export async function generateStaticParams() {
  const incomes = [
    30000, 40000, 50000, 60000, 70000,
    80000, 90000, 100000, 120000, 150000,
  ];

  return incomes.map((income) => ({
    income: income.toString(),
  }));
}

export default async function SalaryPage({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;

  const income = parseInt(resolvedParams.income, 10);

  const regionKey = resolvedSearch?.region || "canada";
  const region = regions[regionKey] || regions.canada;
  const currency = region.currency;

  function money(v) {
    return v.toLocaleString("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    });
  }

  if (Number.isNaN(income) || income <= 0) {
    return <div style={{ padding: 40 }}>Invalid income.</div>;
  }

  const safeCar = Math.round(income * 0.35);
  const stretchCar = Math.round(income * 0.5);
  const riskyCar = Math.round(income * 0.7);

  const relatedPrices = [
    15000, 20000, 25000, 30000, 35000, 40000, 45000, 50000,
  ];

  const nearbyIncomes = [
    income - 20000,
    income - 10000,
    income + 10000,
    income + 20000,
  ].filter((value) => value > 0);

  return (
    <div style={{ maxWidth: 950, margin: "0 auto", padding: 40 }}>
      <section style={sectionStyle}>
        <p style={eyebrowStyle}>Salary affordability guide</p>

        <h1 style={titleStyle}>
          What car can I afford with a {money(income)} salary?
        </h1>

        <p style={leadStyle}>
          If you earn around {money(income)} per year, this page gives you a quick
          estimate of a safe car budget, a stretch budget, and a risky budget.
          These ranges are not exact financial advice, but they are useful starting
          points when planning your next vehicle purchase.
        </p>
      </section>

      <section style={cardsGridStyle}>
        <div style={{ ...topCardStyle, border: "2px solid #22c55e" }}>
          <div style={greenLabelStyle}>Safe budget</div>
          <div style={cardValueStyle}>{money(safeCar)}</div>
        </div>

        <div style={{ ...topCardStyle, border: "2px solid #facc15" }}>
          <div style={yellowLabelStyle}>Stretch budget</div>
          <div style={cardValueStyle}>{money(stretchCar)}</div>
        </div>

        <div style={{ ...topCardStyle, border: "2px solid #ef4444" }}>
          <div style={redLabelStyle}>Risky budget</div>
          <div style={cardValueStyle}>{money(riskyCar)}</div>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={h2Style}>How much car can you usually afford on this salary?</h2>

        <p style={paragraphStyle}>
          A person making {money(income)} per year can often afford a vehicle in the
          range of {money(safeCar)} to {money(stretchCar)} depending on debt, rent,
          insurance, fuel costs, and loan terms. A car above {money(riskyCar)} may
          become difficult to manage unless expenses are low or the down payment is high.
        </p>

        <p style={paragraphStyle}>
          In general, the safest approach is to keep your total vehicle cost low enough
          that you still have room for savings, emergencies, and everyday living costs.
          That is why a safe range is usually more sustainable than simply stretching
          for the highest car price a lender might approve.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={h2Style}>Can I afford a {money(30000)} car with a {money(income)} salary?</h2>

        <p style={paragraphStyle}>
          Whether you can afford a {money(30000)} car on a {money(income)} salary depends
          on more than just income. Interest rate, down payment, insurance, gas,
          maintenance, taxes, and your monthly fixed expenses all matter. If your budget
          is tight, even a moderate car payment can become stressful when insurance and
          fuel are added on top.
        </p>

        <p style={paragraphStyle}>
          That is why many people searching for terms like “what car can I afford with a
          {money(income)} salary” or “can I afford a {money(30000)} car” should compare
          both price-based pages and salary-based pages before deciding.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={h2Style}>Popular car price pages for this salary</h2>

        <div style={linksGridStyle}>
          {relatedPrices.map((price) => (
            <a
              key={price}
              href={`/can-i-afford-a/${price}?region=${regionKey}`}
              style={linkCardStyle}
            >
              Can I afford a {money(price)} car?
            </a>
          ))}
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={h2Style}>Related salary pages</h2>

        <div style={linksGridStyle}>
          {nearbyIncomes.map((value) => (
            <a
              key={value}
              href={`/salary/${value}?region=${regionKey}`}
              style={linkCardStyle}
            >
              What car can I afford with a {money(value)} salary?
            </a>
          ))}
        </div>
      </section>

      <section style={ctaSectionStyle}>
        <h2 style={{ marginTop: 0, fontSize: "30px" }}>
          Want a more accurate answer?
        </h2>

        <p style={{ color: "#d1d5db", fontSize: "17px", lineHeight: 1.8 }}>
          Use the full AffordThisCar calculator to include your expenses, down payment,
          interest rate, insurance, and fuel costs.
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