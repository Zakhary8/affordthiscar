"use client";

import { useState } from "react";
import { regions } from "../../data/regions";

export default function DealReviewPage() {
  const [regionKey, setRegionKey] = useState("canada");
  const [vehicleName, setVehicleName] = useState("");
  const [vehiclePrice, setVehiclePrice] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [tradeValue, setTradeValue] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanTerm, setLoanTerm] = useState("");
  const [fees, setFees] = useState("");
  const [monthlyPaymentQuoted, setMonthlyPaymentQuoted] = useState("");
  const [insurance, setInsurance] = useState("");
  const [gas, setGas] = useState("");
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

  function reviewDeal() {
    const region = regions[regionKey] || regions.canada;
    const currency = region.currency;
    const taxRate = region.taxRate;

    const price = Number(vehiclePrice) || 0;
    const down = Number(downPayment) || 0;
    const trade = Number(tradeValue) || 0;
    const rate = Number(interestRate) || 0;
    const term = Number(loanTerm) || 0;
    const extraFees = Number(fees) || 0;
    const quotedPayment = Number(monthlyPaymentQuoted) || 0;
    const monthlyInsurance = Number(insurance) || 0;
    const monthlyGas = Number(gas) || 0;

    if (!price || !term) {
      setResult("Please fill in at least the vehicle price and loan term.");
      return;
    }

    const taxableAmount = Math.max(price - trade, 0);
    const taxAmount = taxableAmount * taxRate;
    const totalBeforeDown = taxableAmount + taxAmount + extraFees;
    const financedAmount = Math.max(totalBeforeDown - down, 0);

    const estimatedPayment = calculateMonthlyPayment(financedAmount, rate, term);
    const monthlyMaintenance = 75;
    const trueMonthlyCost =
      estimatedPayment + monthlyInsurance + monthlyGas + monthlyMaintenance;

    let verdict = "Fair";
    let verdictColor = "#f59e0b";
    let paymentDifference = 0;

    if (quotedPayment > 0) {
      paymentDifference = quotedPayment - estimatedPayment;

      if (paymentDifference > 75) {
        verdict = "Possibly overpriced";
        verdictColor = "#ef4444";
      } else if (paymentDifference < -50) {
        verdict = "Better than expected";
        verdictColor = "#22c55e";
      } else {
        verdict = "Fair";
        verdictColor = "#f59e0b";
      }
    }

    setResult({
      currency,
      taxAmount,
      totalBeforeDown,
      financedAmount,
      estimatedPayment,
      quotedPayment,
      paymentDifference,
      trueMonthlyCost,
      monthlyInsurance,
      monthlyGas,
      monthlyMaintenance,
      verdict,
      verdictColor,
    });
  }

  return (
    <div style={{ maxWidth: "1050px", margin: "0 auto" }}>
      <section style={heroStyle}>
        <p style={eyebrowStyle}>Deal review</p>
        <h1 style={titleStyle}>Review a car deal before you sign</h1>
        <p style={leadStyle}>
          Enter the numbers from a dealership quote and compare the quoted payment
          to an estimated fair payment based on tax, financing, trade value, and fees.
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
            <label style={labelStyle}>Vehicle Name</label>
            <input
              value={vehicleName}
              onChange={(e) => setVehicleName(e.target.value)}
              placeholder="Mazda CX-5 GS"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Vehicle Price</label>
            <input
              value={vehiclePrice}
              onChange={(e) => setVehiclePrice(e.target.value)}
              placeholder="30000"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Down Payment</label>
            <input
              value={downPayment}
              onChange={(e) => setDownPayment(e.target.value)}
              placeholder="5000"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Trade Value</label>
            <input
              value={tradeValue}
              onChange={(e) => setTradeValue(e.target.value)}
              placeholder="4000"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Interest Rate (%)</label>
            <input
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              placeholder="6.9"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Loan Term (Years)</label>
            <input
              value={loanTerm}
              onChange={(e) => setLoanTerm(e.target.value)}
              placeholder="5"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Dealer Fees / Extras</label>
            <input
              value={fees}
              onChange={(e) => setFees(e.target.value)}
              placeholder="1200"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Quoted Monthly Payment</label>
            <input
              value={monthlyPaymentQuoted}
              onChange={(e) => setMonthlyPaymentQuoted(e.target.value)}
              placeholder="645"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Monthly Insurance</label>
            <input
              value={insurance}
              onChange={(e) => setInsurance(e.target.value)}
              placeholder="180"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Monthly Gas</label>
            <input
              value={gas}
              onChange={(e) => setGas(e.target.value)}
              placeholder="160"
              style={inputStyle}
            />
          </div>
        </div>

        <button onClick={reviewDeal} style={buttonStyle}>
          Review This Deal
        </button>
      </section>

      <section style={resultsSectionStyle}>
        {!result && (
          <div style={emptyStateStyle}>
            Enter the deal details above to compare the quoted payment against an estimated fair payment.
          </div>
        )}

        {typeof result === "string" && <div style={errorStyle}>{result}</div>}

        {result && typeof result === "object" && (
          <>
            <div
              style={{
                ...verdictBoxStyle,
                border: `2px solid ${result.verdictColor}`,
              }}
            >
              <div style={{ fontSize: "14px", fontWeight: "700", color: "#64748b" }}>
                Deal verdict
              </div>
              <div
                style={{
                  fontSize: "30px",
                  fontWeight: "800",
                  color: result.verdictColor,
                  marginTop: "6px",
                }}
              >
                {result.verdict}
              </div>
            </div>

            <div style={cardStyle}>
              <h2 style={sectionTitleStyle}>Deal breakdown</h2>

              <div style={gridStyle}>
                <div style={statCardStyle}>
                  <div style={statLabelStyle}>Estimated Tax</div>
                  <div style={statValueStyle}>
                    {money(result.taxAmount, result.currency)}
                  </div>
                </div>

                <div style={statCardStyle}>
                  <div style={statLabelStyle}>Total Before Down Payment</div>
                  <div style={statValueStyle}>
                    {money(result.totalBeforeDown, result.currency)}
                  </div>
                </div>

                <div style={statCardStyle}>
                  <div style={statLabelStyle}>Financed Amount</div>
                  <div style={statValueStyle}>
                    {money(result.financedAmount, result.currency)}
                  </div>
                </div>

                <div style={statCardStyle}>
                  <div style={statLabelStyle}>Estimated Fair Payment</div>
                  <div style={statValueStyle}>
                    {money(result.estimatedPayment, result.currency)}
                  </div>
                </div>

                <div style={statCardStyle}>
                  <div style={statLabelStyle}>Quoted Monthly Payment</div>
                  <div style={statValueStyle}>
                    {money(result.quotedPayment, result.currency)}
                  </div>
                </div>

                <div style={statCardStyle}>
                  <div style={statLabelStyle}>Payment Difference</div>
                  <div style={statValueStyle}>
                    {money(result.paymentDifference, result.currency)}
                  </div>
                </div>
              </div>

              <div style={highlightBoxStyle}>
                <div style={highlightLabelStyle}>Estimated True Monthly Cost</div>
                <div style={highlightValueStyle}>
                  {money(result.trueMonthlyCost, result.currency)}
                </div>
                <div style={{ color: "#cbd5e1", marginTop: "8px", fontSize: "14px" }}>
                  Includes payment, insurance, gas, and a maintenance buffer.
                </div>
              </div>
            </div>

            <div style={ctaSectionStyle}>
              <h2 style={{ marginTop: 0, fontSize: "30px" }}>
                Want a personal review of this deal?
              </h2>

              <p style={{ color: "#d1d5db", fontSize: "17px", lineHeight: 1.8 }}>
                Later, this section can be connected to your paid consultation flow
                so clients can submit their quote and book a one-on-one deal review.
              </p>

              <button style={ctaButtonStyle}>Book a Deal Review Call</button>
            </div>
          </>
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

const verdictBoxStyle = {
  backgroundColor: "white",
  borderRadius: "20px",
  padding: "22px",
  marginBottom: "24px",
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
  border: "none",
  padding: "14px 20px",
  borderRadius: "14px",
  fontWeight: "800",
  cursor: "pointer",
};