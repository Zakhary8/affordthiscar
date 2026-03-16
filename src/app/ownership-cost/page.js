"use client";

import { useState } from "react";
import { regions } from "../../data/regions";

export default function OwnershipCostPage() {
  const [carPrice, setCarPrice] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanTerm, setLoanTerm] = useState("");
  const [insurance, setInsurance] = useState("");
  const [gas, setGas] = useState("");
  const [maintenance, setMaintenance] = useState("");
  const [registration, setRegistration] = useState("");
  const [regionKey, setRegionKey] = useState("canada");
  const [result, setResult] = useState(null);

  function money(value, currency) {
    return value.toLocaleString("en-US", {
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

  function calculateOwnershipCost() {
    const region = regions[regionKey] || regions.canada;
    const currency = region.currency;
    const taxRate = region.taxRate;

    const price = Number(carPrice) || 0;
    const down = Number(downPayment) || 0;
    const rate = Number(interestRate) || 0;
    const term = Number(loanTerm) || 0;
    const monthlyInsurance = Number(insurance) || 0;
    const monthlyGas = Number(gas) || 0;
    const monthlyMaintenance = Number(maintenance) || 0;
    const yearlyRegistration = Number(registration) || 0;

    if (!price || !term) {
      setResult("Please fill in at least the car price and loan term.");
      return;
    }

    const taxAmount = price * taxRate;
    const priceAfterTax = price + taxAmount;
    const loanAmount = Math.max(priceAfterTax - down, 0);

    const monthlyPayment = calculateMonthlyPayment(loanAmount, rate, term);
    const monthlyRegistration = yearlyRegistration / 12;

    const totalMonthlyCost =
      monthlyPayment +
      monthlyInsurance +
      monthlyGas +
      monthlyMaintenance +
      monthlyRegistration;

    const yearlyOwnershipCost = totalMonthlyCost * 12;

    setResult({
      currency,
      taxAmount,
      priceAfterTax,
      loanAmount,
      monthlyPayment,
      monthlyInsurance,
      monthlyGas,
      monthlyMaintenance,
      monthlyRegistration,
      totalMonthlyCost,
      yearlyOwnershipCost,
    });
  }

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
      <section style={heroStyle}>
        <p style={eyebrowStyle}>Ownership cost calculator</p>
        <h1 style={titleStyle}>See the true cost of owning that car</h1>
        <p style={leadStyle}>
          Go beyond sticker price. Estimate your full monthly and yearly cost
          including financing, tax, insurance, gas, maintenance, and registration.
        </p>
      </section>

      <section style={cardStyle}>
        <div style={gridStyle}>
          <div>
            <label style={labelStyle}>Region</label>
            <select
              value={regionKey}
              onChange={(e) => setRegionKey(e.target.value)}
              style={inputStyle}
            >
              <option value="canada">Canada</option>
              <option value="usa">USA</option>
              <option value="europe">Europe</option>
            </select>
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
            <label style={labelStyle}>Interest Rate (%)</label>
            <input
              type="number"
              step="0.1"
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

          <div>
            <label style={labelStyle}>Monthly Maintenance</label>
            <input
              type="number"
              value={maintenance}
              onChange={(e) => setMaintenance(e.target.value)}
              placeholder="100"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Yearly Registration / Fees</label>
            <input
              type="number"
              value={registration}
              onChange={(e) => setRegistration(e.target.value)}
              placeholder="300"
              style={inputStyle}
            />
          </div>
        </div>

        <button onClick={calculateOwnershipCost} style={buttonStyle}>
          Calculate Ownership Cost
        </button>
      </section>

      <section style={resultsSectionStyle}>
        {!result && (
          <div style={emptyStateStyle}>
            Enter your numbers to estimate the full monthly and yearly ownership cost.
          </div>
        )}

        {typeof result === "string" && <div style={errorStyle}>{result}</div>}

        {result && typeof result === "object" && (
          <div style={cardStyle}>
            <h2 style={sectionTitleStyle}>Ownership cost breakdown</h2>

            <div style={gridStyle}>
              <div style={statCardStyle}>
                <div style={statLabelStyle}>Tax Amount</div>
                <div style={statValueStyle}>
                  {money(result.taxAmount, result.currency)}
                </div>
              </div>

              <div style={statCardStyle}>
                <div style={statLabelStyle}>Price After Tax</div>
                <div style={statValueStyle}>
                  {money(result.priceAfterTax, result.currency)}
                </div>
              </div>

              <div style={statCardStyle}>
                <div style={statLabelStyle}>Loan Amount</div>
                <div style={statValueStyle}>
                  {money(result.loanAmount, result.currency)}
                </div>
              </div>

              <div style={statCardStyle}>
                <div style={statLabelStyle}>Monthly Payment</div>
                <div style={statValueStyle}>
                  {money(result.monthlyPayment, result.currency)}
                </div>
              </div>

              <div style={statCardStyle}>
                <div style={statLabelStyle}>Monthly Insurance</div>
                <div style={statValueStyle}>
                  {money(result.monthlyInsurance, result.currency)}
                </div>
              </div>

              <div style={statCardStyle}>
                <div style={statLabelStyle}>Monthly Gas</div>
                <div style={statValueStyle}>
                  {money(result.monthlyGas, result.currency)}
                </div>
              </div>

              <div style={statCardStyle}>
                <div style={statLabelStyle}>Monthly Maintenance</div>
                <div style={statValueStyle}>
                  {money(result.monthlyMaintenance, result.currency)}
                </div>
              </div>

              <div style={statCardStyle}>
                <div style={statLabelStyle}>Monthly Registration</div>
                <div style={statValueStyle}>
                  {money(result.monthlyRegistration, result.currency)}
                </div>
              </div>
            </div>

            <div style={highlightBoxStyle}>
              <div style={highlightLabelStyle}>Total Monthly Ownership Cost</div>
              <div style={highlightValueStyle}>
                {money(result.totalMonthlyCost, result.currency)}
              </div>
            </div>

            <div style={highlightBoxStyle}>
              <div style={highlightLabelStyle}>Estimated Yearly Ownership Cost</div>
              <div style={highlightValueStyle}>
                {money(result.yearlyOwnershipCost, result.currency)}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

const heroStyle = {
  backgroundColor: "white",
  borderRadius: "24px",
  padding: "36px",
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

const cardStyle = {
  backgroundColor: "white",
  borderRadius: "24px",
  padding: "32px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
  border: "1px solid #e2e8f0",
  marginBottom: "24px",
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
  backgroundColor: "#ffffff",
};

const buttonStyle = {
  marginTop: "22px",
  width: "100%",
  padding: "16px",
  backgroundColor: "#111827",
  color: "white",
  border: "none",
  borderRadius: "14px",
  fontSize: "16px",
  fontWeight: "700",
  cursor: "pointer",
};

const resultsSectionStyle = {
  marginBottom: "40px",
};

const emptyStateStyle = {
  backgroundColor: "white",
  border: "1px solid #e2e8f0",
  borderRadius: "20px",
  padding: "24px",
  color: "#64748b",
  fontSize: "17px",
};

const errorStyle = {
  backgroundColor: "#fee2e2",
  color: "#991b1b",
  padding: "16px",
  borderRadius: "14px",
};

const sectionTitleStyle = {
  marginTop: 0,
  fontSize: "30px",
  marginBottom: "20px",
};

const statCardStyle = {
  backgroundColor: "#f8fafc",
  padding: "18px",
  borderRadius: "16px",
  border: "1px solid #e2e8f0",
};

const statLabelStyle = {
  fontSize: "14px",
  color: "#64748b",
  marginBottom: "8px",
  fontWeight: "600",
};

const statValueStyle = {
  fontSize: "24px",
  fontWeight: "800",
  color: "#111827",
};

const highlightBoxStyle = {
  marginTop: "20px",
  backgroundColor: "#111827",
  color: "white",
  borderRadius: "18px",
  padding: "22px",
};

const highlightLabelStyle = {
  fontSize: "14px",
  color: "#cbd5e1",
  marginBottom: "8px",
  fontWeight: "700",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const highlightValueStyle = {
  fontSize: "32px",
  fontWeight: "800",
};