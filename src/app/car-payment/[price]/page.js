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

export default async function CarPaymentPage({ params, searchParams }) {
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
    return <div style={{ padding: 40 }}>Invalid price.</div>;
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
        <p style={eyebrowStyle}>Car payment guide</p>

        <h1 style={titleStyle}>
          Monthly payment on a {money(price)} car
        </h1>

        <p style={leadStyle}>
          This page estimates the monthly payment for a car priced at {money(price)}.
          It uses regional tax assumptions, a typical down payment, and realistic
          financing conditions.
        </p>

        <div style={switcherWrapStyle}>
          <div style={switcherLabelStyle}>Choose your region</div>

          <div style={switcherRowStyle}>
            {regionOptions.map((option) => {
              const isActive = option.key === regionKey;

              return (
                <a
                  key={option.key}
                  href={`/car-payment/${price}?region=${option.key}`}
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
            Current region: <strong>{regionKey}</strong> · Currency:{" "}
            <strong>{currency}</strong> · Tax:{" "}
            <strong>{(taxRate * 100).toFixed(1)}%</strong> · Interest:{" "}
            <strong>{interestRate}%</strong>
          </p>
        </div>
      </section>

      <section style={cardsGridStyle}>
        <div style={{ ...topCardStyle, border: "2px solid #22c55e" }}>
          <div style={greenLabelStyle}>48 months</div>
          <div style={cardValueStyle}>{money(payment48)}/mo</div>
        </div>

        <div style={{ ...topCardStyle, border: "2px solid #facc15" }}>
          <div style={yellowLabelStyle}>60 months</div>
          <div style={cardValueStyle}>{money(payment60)}/mo</div>
        </div>

        <div style={{ ...topCardStyle, border: "2px solid #ef4444" }}>
          <div style={redLabelStyle}>72 months</div>
          <div style={cardValueStyle}>{money(payment72)}/mo</div>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={h2Style}>How much is the payment on a {money(price)} car?</h2>

        <p style={paragraphStyle}>
          A {money(price)} car usually costs more than the sticker price once taxes are
          included. With an estimated tax rate of {(taxRate * 100).toFixed(1)}%, the
          after-tax price is about {money(taxedPrice)}. If you put around {money(downPayment)}
          down, the financed amount may be close to {money(financedAmount)}.
        </p>

        <p style={paragraphStyle}>
          At around {interestRate}% interest, the monthly payment may land near{" "}
          {money(payment48)} on a 48-month term, {money(payment60)} on a 60-month term,
          or {money(payment72)} on a 72-month term. Longer terms reduce the monthly payment
          but usually increase the total interest paid.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={h2Style}>What changes a car payment the most?</h2>

        <p style={paragraphStyle}>
          The biggest factors are taxes, interest rate, loan term, and down payment.
          A higher down payment lowers the financed balance. A lower interest rate also
          reduces the monthly payment. Dealer fees, warranty products, and regional taxes
          can all increase the real amount financed.
        </p>

        <p style={paragraphStyle}>
          That is why buyers searching for “payment on a {money(price)} car” should also
          compare affordability, ownership cost, and total budget impact before deciding.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={h2Style}>Related payment pages</h2>

        <div style={linksGridStyle}>
          {relatedPrices.map((value) => (
            <a
              key={value}
              href={`/car-payment/${value}?region=${regionKey}`}
              style={linkCardStyle}
            >
              Monthly payment on a {money(value)} car
            </a>
          ))}
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={h2Style}>Related affordability pages</h2>

        <div style={linksGridStyle}>
          <a href={`/can-i-afford-a/${price}?region=${regionKey}`} style={linkCardStyle}>
            Can I afford a {money(price)} car?
          </a>

          <a href={`/salary/50000?region=${regionKey}`} style={linkCardStyle}>
            What car can I afford with a {money(50000)} salary?
          </a>

          <a href={`/salary/70000?region=${regionKey}`} style={linkCardStyle}>
            What car can I afford with a {money(70000)} salary?
          </a>

          <a href="/ownership-cost" style={linkCardStyle}>
            Estimate full ownership cost
          </a>
        </div>
      </section>

      <section style={ctaSectionStyle}>
        <h2 style={{ marginTop: 0, fontSize: "30px" }}>
          Want a more exact payment estimate?
        </h2>

        <p style={{ color: "#d1d5db", fontSize: "17px", lineHeight: 1.8 }}>
          Use the full AffordThisCar tools to compare cars, estimate ownership cost,
          and review real dealership quotes.
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