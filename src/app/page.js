"use client";

import { useMemo, useState } from "react";
import { usePreferences } from "../context/PreferencesContext";

export default function Home() {
  const {
    preferences,
    taxRate,
    countryLabel,
    subdivisionLabel,
    safeSubdivisionKey,
  } = usePreferences();

  const [income, setIncome] = useState("");
  const [frequency, setFrequency] = useState("yearly");
  const [expenses, setExpenses] = useState("");
  const [carName, setCarName] = useState("");
  const [carPrice, setCarPrice] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanTerm, setLoanTerm] = useState("");
  const [insurance, setInsurance] = useState("");
  const [gas, setGas] = useState("");
  const [result, setResult] = useState(null);

  const locale = useMemo(() => {
    if (preferences.language === "fr") return "fr-CA";
    if (preferences.language === "es") return "es-ES";
    if (preferences.currency === "USD") return "en-US";
    if (preferences.currency === "EUR") return "de-DE";
    if (preferences.currency === "MXN") return "es-MX";
    return "en-CA";
  }, [preferences.language, preferences.currency]);

  function formatCurrency(value) {
    return Number(value || 0).toLocaleString(locale, {
      style: "currency",
      currency: preferences.currency,
      maximumFractionDigits: 0,
    });
  }

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

  function reverseCarPriceFromMonthlyBudget(
    targetMonthlyCarCost,
    insuranceCost,
    gasCost,
    maintenanceBuffer,
    annualRate,
    termYears,
    downPaymentAmount,
    localTaxRate
  ) {
    const paymentBudget =
      targetMonthlyCarCost - insuranceCost - gasCost - maintenanceBuffer;

    if (paymentBudget <= 0) return 0;

    const monthlyRate = annualRate / 100 / 12;
    const numberOfPayments = termYears * 12;

    if (!numberOfPayments || numberOfPayments <= 0) return 0;

    let supportedLoanAmount = 0;

    if (monthlyRate === 0) {
      supportedLoanAmount = paymentBudget * numberOfPayments;
    } else {
      supportedLoanAmount =
        paymentBudget *
        ((1 - Math.pow(1 + monthlyRate, -numberOfPayments)) / monthlyRate);
    }

    const preTaxAffordablePrice = Math.max(
      0,
      (supportedLoanAmount + downPaymentAmount) / (1 + localTaxRate)
    );

    return preTaxAffordablePrice;
  }

  function calculate() {
    const monthlyIncome = getMonthlyIncome(income, frequency);
    const monthlyExpenses = Number(expenses) || 0;
    const basePrice = Number(carPrice) || 0;
    const down = Number(downPayment) || 0;
    const rate = Number(interestRate) || 0;
    const termYears = Number(loanTerm) || 0;
    const monthlyInsurance = Number(insurance) || 0;
    const monthlyGas = Number(gas) || 0;

    if (!monthlyIncome || !basePrice || !termYears) {
      setResult("Please fill in income, car price, and loan term.");
      return;
    }

    const taxedPrice = basePrice * (1 + taxRate);
    const totalTaxAmount = taxedPrice - basePrice;
    const loanAmount = Math.max(taxedPrice - down, 0);
    const monthlyPayment = calculateMonthlyPayment(loanAmount, rate, termYears);

    const maintenanceBuffer = 75;
    const totalMonthlyCarCost =
      monthlyPayment + monthlyInsurance + monthlyGas + maintenanceBuffer;

    const carCostPercent = (totalMonthlyCarCost / monthlyIncome) * 100;
    const moneyLeft = monthlyIncome - monthlyExpenses - totalMonthlyCarCost;
    const score = calculateScore(carCostPercent, moneyLeft);

    const safeTargetMonthlyCarCost = monthlyIncome * 0.15;
    const stretchTargetMonthlyCarCost = monthlyIncome * 0.22;
    const riskyTargetMonthlyCarCost = monthlyIncome * 0.3;

    const safeCarPrice = Math.round(
      reverseCarPriceFromMonthlyBudget(
        safeTargetMonthlyCarCost,
        monthlyInsurance,
        monthlyGas,
        maintenanceBuffer,
        rate,
        termYears,
        down,
        taxRate
      )
    );

    const stretchCarPrice = Math.round(
      reverseCarPriceFromMonthlyBudget(
        stretchTargetMonthlyCarCost,
        monthlyInsurance,
        monthlyGas,
        maintenanceBuffer,
        rate,
        termYears,
        down,
        taxRate
      )
    );

    const riskyCarPrice = Math.round(
      reverseCarPriceFromMonthlyBudget(
        riskyTargetMonthlyCarCost,
        monthlyInsurance,
        monthlyGas,
        maintenanceBuffer,
        rate,
        termYears,
        down,
        taxRate
      )
    );

    setResult({
      carName,
      monthlyIncome,
      monthlyPayment,
      totalMonthlyCarCost,
      carCostPercent,
      moneyLeft,
      maintenanceBuffer,
      score,
      verdict: getVerdict(score),
      scoreColor: getScoreColor(score),
      taxedPrice,
      basePrice,
      totalTaxAmount,
      taxRate,
      safeCarPrice,
      stretchCarPrice,
      riskyCarPrice,
      countryLabel,
      subdivisionLabel,
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
            review dealership deals, and explore payment guides with your saved
            language, currency, and tax region.
          </p>

          <div style={pillRowStyle}>
            <span style={pillStyle}>Language: {preferences.language.toUpperCase()}</span>
            <span style={pillStyle}>Currency: {preferences.currency}</span>
            <span style={pillStyle}>
              Tax area: {countryLabel} / {subdivisionLabel}
            </span>
          </div>

          <div style={buttonRowStyle}>
            <a href="/compare" style={secondaryLinkStyle}>
              Compare Cars
            </a>
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
        <div style={sectionHeaderStyle}>
          <h2 style={sectionTitleStyle}>Affordability Calculator</h2>
          <p style={sectionSubtitleStyle}>
            Your selected region is currently <strong>{subdivisionLabel}</strong> in{" "}
            <strong>{countryLabel}</strong>, using a tax rate of{" "}
            <strong>{(taxRate * 100).toFixed(3).replace(/\.?0+$/, "")}%</strong>.
          </p>
        </div>

        <div style={gridStyle}>
          <div>
            <label style={labelStyle}>Vehicle Name</label>
            <input
              type="text"
              value={carName}
              onChange={(e) => setCarName(e.target.value)}
              placeholder="Mazda CX-5"
              style={inputStyle}
            />
          </div>

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
            <label style={labelStyle}>Vehicle Price Before Tax</label>
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
            Enter your numbers to see your affordability result with your saved
            tax region and currency.
          </p>
        )}

        {typeof result === "string" && <div style={errorStyle}>{result}</div>}

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
                <div style={smallLabelStyle}>Vehicle</div>
                <div style={statValueStyle}>{result.carName || "Unnamed vehicle"}</div>
              </div>

              <div style={statStyle}>
                <div style={smallLabelStyle}>Tax Region</div>
                <div style={statValueStyle}>
                  {result.countryLabel} / {result.subdivisionLabel}
                </div>
              </div>

              <div style={statStyle}>
                <div style={smallLabelStyle}>Price Before Tax</div>
                <div style={statValueStyle}>{formatCurrency(result.basePrice)}</div>
              </div>

              <div style={statStyle}>
                <div style={smallLabelStyle}>Sales Tax Amount</div>
                <div style={statValueStyle}>{formatCurrency(result.totalTaxAmount)}</div>
              </div>

              <div style={statStyle}>
                <div style={smallLabelStyle}>Price After Tax</div>
                <div style={statValueStyle}>{formatCurrency(result.taxedPrice)}</div>
              </div>

              <div style={statStyle}>
                <div style={smallLabelStyle}>Monthly Income</div>
                <div style={statValueStyle}>{formatCurrency(result.monthlyIncome)}</div>
              </div>

              <div style={statStyle}>
                <div style={smallLabelStyle}>Monthly Payment</div>
                <div style={statValueStyle}>{formatCurrency(result.monthlyPayment)}</div>
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
                <div style={statValueStyle}>{formatCurrency(result.moneyLeft)}</div>
              </div>

              <div style={statStyle}>
                <div style={smallLabelStyle}>Maintenance Buffer</div>
                <div style={statValueStyle}>
                  {formatCurrency(result.maintenanceBuffer)}
                </div>
              </div>

              <div style={statStyle}>
                <div style={smallLabelStyle}>Applied Tax Rate</div>
                <div style={statValueStyle}>
                  {(result.taxRate * 100).toFixed(3).replace(/\.?0+$/, "")}%
                </div>
              </div>
            </div>

            <div style={recommendationWrapStyle}>
              <h3 style={recommendationTitleStyle}>Recommended Price Ranges</h3>

              <div style={rangeGridStyle}>
                <div style={{ ...rangeCardStyle, borderColor: "#bbf7d0" }}>
                  <div style={{ ...rangeLabelStyle, color: "#15803d" }}>Safe</div>
                  <div style={rangeValueStyle}>
                    {formatCurrency(result.safeCarPrice)}
                  </div>
                  <div style={rangeNoteStyle}>Before tax vehicle price</div>
                </div>

                <div style={{ ...rangeCardStyle, borderColor: "#fde68a" }}>
                  <div style={{ ...rangeLabelStyle, color: "#b45309" }}>Stretch</div>
                  <div style={rangeValueStyle}>
                    {formatCurrency(result.stretchCarPrice)}
                  </div>
                  <div style={rangeNoteStyle}>Before tax vehicle price</div>
                </div>

                <div style={{ ...rangeCardStyle, borderColor: "#fecaca" }}>
                  <div style={{ ...rangeLabelStyle, color: "#b91c1c" }}>Risky</div>
                  <div style={rangeValueStyle}>
                    {formatCurrency(result.riskyCarPrice)}
                  </div>
                  <div style={rangeNoteStyle}>Before tax vehicle price</div>
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

      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>Current Preference Debug</h2>
        <div style={statsGridStyle}>
          <div style={statStyle}>
            <div style={smallLabelStyle}>Language</div>
            <div style={statValueStyle}>{preferences.language}</div>
          </div>
          <div style={statStyle}>
            <div style={smallLabelStyle}>Country</div>
            <div style={statValueStyle}>{countryLabel}</div>
          </div>
          <div style={statStyle}>
            <div style={smallLabelStyle}>Province / State</div>
            <div style={statValueStyle}>{subdivisionLabel}</div>
          </div>
          <div style={statStyle}>
            <div style={smallLabelStyle}>Subdivision Key</div>
            <div style={statValueStyle}>{safeSubdivisionKey}</div>
          </div>
          <div style={statStyle}>
            <div style={smallLabelStyle}>Currency</div>
            <div style={statValueStyle}>{preferences.currency}</div>
          </div>
          <div style={statStyle}>
            <div style={smallLabelStyle}>Tax Rate</div>
            <div style={statValueStyle}>
              {(taxRate * 100).toFixed(3).replace(/\.?0+$/, "")}%
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const pageStyle = {
  maxWidth: "1100px",
  margin: "0 auto",
  padding: "0",
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

const pillRowStyle = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  marginTop: "18px",
};

const pillStyle = {
  display: "inline-block",
  padding: "10px 14px",
  borderRadius: "999px",
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  fontSize: "14px",
  fontWeight: "700",
  color: "#334155",
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

const sectionHeaderStyle = {
  marginBottom: "18px",
};

const sectionTitleStyle = {
  marginTop: 0,
  marginBottom: "8px",
  fontSize: "30px",
};

const sectionSubtitleStyle = {
  margin: 0,
  color: "#64748b",
  fontSize: "16px",
  lineHeight: 1.6,
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

const recommendationWrapStyle = {
  marginTop: "22px",
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "20px",
  padding: "22px",
};

const recommendationTitleStyle = {
  marginTop: 0,
  marginBottom: "16px",
  fontSize: "24px",
};

const rangeGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "14px",
};

const rangeCardStyle = {
  backgroundColor: "white",
  border: "2px solid",
  borderRadius: "16px",
  padding: "18px",
};

const rangeLabelStyle = {
  fontSize: "14px",
  fontWeight: "800",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  marginBottom: "8px",
};

const rangeValueStyle = {
  fontSize: "24px",
  fontWeight: "800",
  color: "#111827",
};

const rangeNoteStyle = {
  marginTop: "6px",
  color: "#64748b",
  fontSize: "13px",
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