const supportedIncomes = [
  30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000, 120000, 150000,
];

const supportedPrices = [
  15000, 20000, 25000, 30000, 35000, 40000, 45000, 50000, 55000, 60000,
  65000, 70000, 75000, 80000, 85000, 90000, 95000, 100000,
];

const DEFAULT_RATE = 6.9;
const DEFAULT_TERM = 5;
const DEFAULT_DOWN_PAYMENT_RATE = 0.1;

export async function generateStaticParams() {
  return supportedIncomes.map((income) => ({
    income: income.toString(),
  }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const income = parseInt(resolvedParams.income, 10);

  return {
    title: `How much car can I afford with a $${income.toLocaleString()} salary? | AffordThisCar`,
    description: `Estimate the safe, stretch, and risky car price ranges for a $${income.toLocaleString()} salary, including monthly payment guidance.`,
  };
}

function money(x) {
  return x.toLocaleString("en-CA", {
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

export default async function SalaryPage({ params }) {
  const resolvedParams = await params;
  const income = parseInt(resolvedParams.income, 10);

  if (Number.isNaN(income) || income <= 0 || !supportedIncomes.includes(income)) {
    return <div style={{ padding: 40 }}>Invalid income.</div>;
  }

  const safeCarPrice = Math.round(income * 0.35);
  const stretchCarPrice = Math.round(income * 0.5);
  const riskyCarPrice = Math.round(income * 0.65);

  const safeDownPayment = Math.round(safeCarPrice * DEFAULT_DOWN_PAYMENT_RATE);
  const stretchDownPayment = Math.round(stretchCarPrice * DEFAULT_DOWN_PAYMENT_RATE);
  const riskyDownPayment = Math.round(riskyCarPrice * DEFAULT_DOWN_PAYMENT_RATE);

  const safeMonthlyPayment = Math.round(
    calculateMonthlyPayment(safeCarPrice - safeDownPayment, DEFAULT_RATE, DEFAULT_TERM)
  );
  const stretchMonthlyPayment = Math.round(
    calculateMonthlyPayment(
      stretchCarPrice - stretchDownPayment,
      DEFAULT_RATE,
      DEFAULT_TERM
    )
  );
  const riskyMonthlyPayment = Math.round(
    calculateMonthlyPayment(riskyCarPrice - riskyDownPayment, DEFAULT_RATE, DEFAULT_TERM)
  );

  const nearbyIncomes = supportedIncomes
    .filter((value) => value !== income && Math.abs(value - income) <= 30000)
    .slice(0, 4);

  const relatedPrices = [safeCarPrice, stretchCarPrice, riskyCarPrice]
    .filter((value) => supportedPrices.includes(value))
    .slice(0, 3);

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
          Salary affordability guide
        </p>

        <h1
          style={{
            fontSize: "46px",
            marginTop: 0,
            marginBottom: "16px",
            lineHeight: 1.1,
          }}
        >
          How much car can I afford with a {money(income)} salary?
        </h1>

        <p
          style={{
            margin: 0,
            fontSize: "18px",
            color: "#475569",
            lineHeight: 1.7,
          }}
        >
          Here’s a simple estimate of the vehicle price range that may fit a
          yearly income of {money(income)}, depending on whether you want to stay
          conservative, stretch your budget, or take on more risk.
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
          <div style={cardLabelGreen}>Safe car price</div>
          <div style={cardValueStyle}>{money(safeCarPrice)}</div>
        </div>

        <div
          style={{
            padding: "22px",
            border: "2px solid #facc15",
            borderRadius: "16px",
            backgroundColor: "white",
          }}
        >
          <div style={cardLabelYellow}>Stretch car price</div>
          <div style={cardValueStyle}>{money(stretchCarPrice)}</div>
        </div>

        <div
          style={{
            padding: "22px",
            border: "2px solid #ef4444",
            borderRadius: "16px",
            backgroundColor: "white",
          }}
        >
          <div style={cardLabelRed}>Risky car price</div>
          <div style={cardValueStyle}>{money(riskyCarPrice)}</div>
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
          Estimated monthly payments by budget level
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
            marginTop: "18px",
          }}
        >
          <div style={infoCardStyle}>
            <div style={infoLabelStyle}>Safe monthly payment</div>
            <div style={infoValueStyle}>{money(safeMonthlyPayment)}</div>
          </div>

          <div style={infoCardStyle}>
            <div style={infoLabelStyle}>Stretch monthly payment</div>
            <div style={infoValueStyle}>{money(stretchMonthlyPayment)}</div>
          </div>

          <div style={infoCardStyle}>
            <div style={infoLabelStyle}>Risky monthly payment</div>
            <div style={infoValueStyle}>{money(riskyMonthlyPayment)}</div>
          </div>
        </div>

        <p style={paragraphStyle}>
          These estimates assume a {DEFAULT_DOWN_PAYMENT_RATE * 100}% down payment,
          a {DEFAULT_RATE}% interest rate, and a {DEFAULT_TERM}-year loan term.
          Your real payment may vary depending on your credit, taxes, insurance,
          and lender.
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
        <h2 style={{ marginTop: 0, fontSize: "30px" }}>
          What changes how much car you can afford?
        </h2>

        <p style={paragraphStyle}>
          Salary is only one factor. Your monthly expenses, interest rate, loan
          term, insurance, fuel costs, taxes, and down payment all affect how
          much car you can truly afford.
        </p>

        <p style={paragraphStyle}>
          Someone earning {money(income)} per year may still have very different
          affordability depending on debt, rent, insurance, and savings goals.
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
          Related affordability pages
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "12px",
          }}
        >
          {nearbyIncomes.map((relatedIncome) => (
            <a
              key={relatedIncome}
              href={`/salary/${relatedIncome}`}
              style={linkCardStyle}
            >
              How much car can I afford with {money(relatedIncome)} salary?
            </a>
          ))}

          {relatedPrices.map((price) => (
            <a
              key={price}
              href={`/can-i-afford-a/${price}`}
              style={linkCardStyle}
            >
              Can I afford a {money(price)} car?
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
          Want a real answer based on your own budget?
        </h2>

        <p style={{ color: "#d1d5db", fontSize: "17px", lineHeight: 1.8 }}>
          Use the full AffordThisCar calculator to include your income,
          expenses, down payment, interest rate, insurance, and fuel costs.
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
          Open the full calculator
        </a>
      </section>
    </div>
  );
}

const cardValueStyle = {
  fontSize: "30px",
  fontWeight: "800",
};

const cardLabelGreen = {
  fontSize: "14px",
  fontWeight: "800",
  color: "#15803d",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  marginBottom: "8px",
};

const cardLabelYellow = {
  fontSize: "14px",
  fontWeight: "800",
  color: "#b45309",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  marginBottom: "8px",
};

const cardLabelRed = {
  fontSize: "14px",
  fontWeight: "800",
  color: "#b91c1c",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  marginBottom: "8px",
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