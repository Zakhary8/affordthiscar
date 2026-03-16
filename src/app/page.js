"use client";

import { useState } from "react";

export default function Home() {
  const [income, setIncome] = useState("");
  const [frequency, setFrequency] = useState("yearly");
  const [expenses, setExpenses] = useState("");
  const [carPrice, setCarPrice] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanTerm, setLoanTerm] = useState("");
  const [insurance, setInsurance] = useState("");
  const [gas, setGas] = useState("");
  const [result, setResult] = useState(null);

  function getMonthlyIncome(amount, incomeFrequency) {
    const value = Number(amount);

    if (incomeFrequency === "weekly") return value * 4.33;
    if (incomeFrequency === "biweekly") return value * 2.17;
    if (incomeFrequency === "monthly") return value;
    return value / 12;
  }

  function calculateMonthlyPayment(loanAmount, annualRate, termYears) {
    const monthlyRate = annualRate / 100 / 12;
    const numberOfPayments = termYears * 12;

    if (!numberOfPayments || numberOfPayments <= 0) return 0;

    if (monthlyRate === 0) return loanAmount / numberOfPayments;

    return (
      (loanAmount * monthlyRate) /
      (1 - Math.pow(1 + monthlyRate, -numberOfPayments))
    );
  }

  function calculateScore(carPercent, moneyLeft) {
    let score = 100;

    if (carPercent > 15) score -= (carPercent - 15) * 2.5;
    if (moneyLeft < 1500) score -= (1500 - moneyLeft) / 20;

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  function getVerdict(score) {
    if (score >= 75) return "Safe";
    if (score >= 50) return "Stretch";
    return "Risky";
  }

  function getScoreColor(score) {
    if (score >= 75) return "#22c55e";
    if (score >= 50) return "#f59e0b";
    return "#ef4444";
  }

  function formatCurrency(value) {
    return value.toLocaleString("en-CA", {
      style: "currency",
      currency: "CAD",
      maximumFractionDigits: 0,
    });
  }

  function calculate() {
    const monthlyIncome = getMonthlyIncome(income, frequency);
    const monthlyExpenses = Number(expenses) || 0;
    const price = Number(carPrice) || 0;
    const down = Number(downPayment) || 0;
    const rate = Number(interestRate) || 0;
    const years = Number(loanTerm) || 0;
    const monthlyInsurance = Number(insurance) || 0;
    const monthlyGas = Number(gas) || 0;

    if (!monthlyIncome || !price || !years) {
      setResult("Please fill in income, car price, and loan term.");
      return;
    }

    const loanAmount = Math.max(price - down, 0);
    const monthlyPayment = calculateMonthlyPayment(loanAmount, rate, years);
    const maintenance = 75;
    const totalMonthlyCarCost =
      monthlyPayment + monthlyInsurance + monthlyGas + maintenance;

    const carCostPercent = (totalMonthlyCarCost / monthlyIncome) * 100;
    const moneyLeft = monthlyIncome - monthlyExpenses - totalMonthlyCarCost;
    const score = calculateScore(carCostPercent, moneyLeft);

    setResult({
      monthlyIncome,
      monthlyPayment,
      totalMonthlyCarCost,
      carCostPercent,
      moneyLeft,
      maintenance,
      score,
      verdict: getVerdict(score),
      scoreColor: getScoreColor(score),
    });
  }

  return (
    <div style={pageStyle}>
      <section style={heroStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>AffordThisCar</p>
          <h1 style={titleStyle}>Can You Actually Afford That Car?</h1>
          <p style={subtitleStyle}>
            Check affordability, compare vehicles, estimate ownership cost,
            review dealership deals, and explore payment guides.
          </p>

          <div style={buttonRowStyle}>
            <a href="/car-payment/30000" style={secondaryLinkStyle}>
              Payment Guides
            </a>
            <a href="/income-needed/30000" style={secondaryLinkStyle}>
              Income Needed
            </a>
            <a href="/deal-review" style={primaryLinkStyle}>
              Deal Review
            </a>
          </div>
        </div>
      </section>

      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>Affordability Calculator</h2>

        <div style={gridStyle}>
          <div>
            <label style={labelStyle}>Income Amount</label>
            <input
              type="number"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              placeholder="70000"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Income Frequency</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              style={inputStyle}
            >
              <option value="yearly">Yearly</option>
              <option value="monthly">Monthly</option>
              <option value="biweekly">Biweekly</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>Monthly Expenses</label>
            <input
              type="number"
              value={expenses}
              onChange={(e) => setExpenses(e.target.value)}
              placeholder="1800"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Car Price</label>
            <input
              type="number"
              value={carPrice}
              onChange={(e) => setCarPrice(e.target.value)}
              placeholder="30000"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Down Payment</label>
            <input
              type="number"
              value={downPayment}
              onChange={(e) => setDownPayment(e.target.value)}
              placeholder="5000"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Interest Rate</label>
            <input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              placeholder="6.9"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Loan Term (Years)</label>
            <input
              type="number"
              value={loanTerm}
              onChange={(e) => setLoanTerm(e.target.value)}
              placeholder="5"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Monthly Insurance</label>
            <input
              type="number"
              value={insurance}
              onChange={(e) => setInsurance(e.target.value)}
              placeholder="180"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Monthly Gas</label>
            <input
              type="number"
              value={gas}
              onChange={(e) => setGas(e.target.value)}
              placeholder="160"
              style={inputStyle}
            />
          </div>
        </div>

        <button onClick={calculate} style={buttonStyle}>
          Calculate
        </button>
      </section>

      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>Results</h2>

        {!result && (
          <p style={mutedTextStyle}>
            Enter your numbers to see your affordability result.
          </p>
        )}

        {typeof result === "string" && (
          <div style={errorStyle}>{result}</div>
        )}

        {result && typeof result === "object" && (
          <div>
            <div style={resultTopStyle}>
              <div>
                <div style={smallLabelStyle}>Affordability Score</div>
                <div style={scoreStyle}>{result.score}/100</div>
              </div>

              <div
                style={{
                  ...badgeStyle,
                  backgroundColor: result.scoreColor,
                }}
              >
                {result.verdict}
              </div>
            </div>

            <div style={statsGridStyle}>
              <div style={statStyle}>
                <div style={smallLabelStyle}>Monthly Income</div>
                <div style={statValueStyle}>
                  {formatCurrency(result.monthlyIncome)}
                </div>
              </div>

              <div style={statStyle}>
                <div style={smallLabelStyle}>Monthly Payment</div>
                <div style={statValueStyle}>
                  {formatCurrency(result.monthlyPayment)}
                </div>
              </div>

              <div style={statStyle}>
                <div style={smallLabelStyle}>True Monthly Car Cost</div>
                <div style={statValueStyle}>
                  {formatCurrency(result.totalMonthlyCarCost)}
                </div>
              </div>

              <div style={statStyle}>
                <div style={smallLabelStyle}>Cost Percent of Income</div>
                <div style={statValueStyle}>
                  {result.carCostPercent.toFixed(1)}%
                </div>
              </div>

              <div style={statStyle}>
                <div style={smallLabelStyle}>Money Left</div>
                <div style={statValueStyle}>
                  {formatCurrency(result.moneyLeft)}
                </div>
              </div>

              <div style={statStyle}>
                <div style={smallLabelStyle}>Maintenance Buffer</div>
                <div style={statValueStyle}>
                  {formatCurrency(result.maintenance)}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>Popular Search Pages</h2>

        <div style={gridStyle}>
          <a href="/salary/70000" style={linkCardStyle}>
            What car can I afford with a 70000 salary
          </a>
          <a href="/can-i-afford-a/30000" style={linkCardStyle}>
            Can I afford a 30000 car
          </a>
          <a href="/car-payment/30000" style={linkCardStyle}>
            Monthly payment on a 30000 car
          </a>
          <a href="/income-needed/30000" style={linkCardStyle}>
            Income needed for a 30000 car
          </a>
          <a href="/fr/puis-je-me-permettre-une-voiture/30000" style={linkCardStyle}>
            French affordability page
          </a>
          <a href="/es/puedo-permitirme-un-auto/30000" style={linkCardStyle}>
            Spanish affordability page
          </a>
        </div>
      </section>
    </div>
  );
}

const pageStyle = {
  maxWidth: "1100px",
  margin: "0 auto",
  padding: "40px 20px",
};

const heroStyle = {
  marginBottom: "24px",
};

const cardStyle = {
  backgroundColor: "white",
  borderRadius: "24px",
  padding: "28px",
  border: "1px solid #e2e8f0",
  boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
  marginBottom: "24px",
};

const eyebrowStyle = {
  margin: 0,
  marginBottom: "10px",
  color: "#64748b",
  fontSize: "14px",
  fontWeight: "700",
  textTransform: "uppercase",
};

const titleStyle = {
  margin: 0,
  marginBottom: "14px",
  fontSize: "48px",
  lineHeight: 1.05,
};

const subtitleStyle = {
  margin: 0,
  color: "#475569",
  fontSize: "18px",
  lineHeight: 1.7,
};

const buttonRowStyle = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
  marginTop: "22px",
};

const primaryLinkStyle = {
  display: "inline-block",
  backgroundColor: "#111827",
  color: "white",
  textDecoration: "none",
  padding: "14px 20px",
  borderRadius: "14px",
  fontWeight: "700",
};

const secondaryLinkStyle = {
  display: "inline-block",
  backgroundColor: "white",
  color: "#111827",
  textDecoration: "none",
  padding: "14px 20px",
  borderRadius: "14px",
  fontWeight: "700",
  border: "1px solid #d1d5db",
};

const sectionTitleStyle = {
  marginTop: 0,
  marginBottom: "18px",
  fontSize: "30px",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "16px",
};

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  fontWeight: "700",
  color: "#334155",
};

const inputStyle = {
  width: "100%",
  padding: "13px",
  fontSize: "16px",
  borderRadius: "12px",
  border: "1px solid #cbd5e1",
  boxSizing: "border-box",
};

const buttonStyle = {
  marginTop: "20px",
  width: "100%",
  padding: "16px",
  border: "none",
  borderRadius: "14px",
  backgroundColor: "#111827",
  color: "white",
  fontSize: "16px",
  fontWeight: "700",
  cursor: "pointer",
};

const mutedTextStyle = {
  color: "#64748b",
  fontSize: "17px",
};

const errorStyle = {
  backgroundColor: "#fee2e2",
  color: "#991b1b",
  padding: "16px",
  borderRadius: "14px",
};

const resultTopStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
  flexWrap: "wrap",
  marginBottom: "18px",
};

const smallLabelStyle = {
  fontSize: "14px",
  color: "#64748b",
  marginBottom: "8px",
  fontWeight: "700",
  textTransform: "uppercase",
};

const scoreStyle = {
  fontSize: "32px",
  fontWeight: "800",
};

const badgeStyle = {
  color: "white",
  padding: "10px 16px",
  borderRadius: "999px",
  fontWeight: "800",
};

const statsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "14px",
};

const statStyle = {
  backgroundColor: "#f8fafc",
  padding: "18px",
  borderRadius: "16px",
  border: "1px solid #e2e8f0",
};

const statValueStyle = {
  fontSize: "22px",
  fontWeight: "800",
  color: "#111827",
};

const linkCardStyle = {
  display: "block",
  textDecoration: "none",
  color: "#111827",
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "14px",
  padding: "16px",
  fontWeight: "700",
  lineHeight: 1.5,
};