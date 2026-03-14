"use client";

import { useState } from "react";

export default function Home() {
  const [income, setIncome] = useState("");
  const [frequency, setFrequency] = useState("yearly");
  const [expenses, setExpenses] = useState("");

  const [car1Name, setCar1Name] = useState("Car 1");
  const [car1Price, setCar1Price] = useState("");
  const [car1Down, setCar1Down] = useState("");
  const [car1Rate, setCar1Rate] = useState("");
  const [car1Term, setCar1Term] = useState("");
  const [car1Insurance, setCar1Insurance] = useState("");
  const [car1Gas, setCar1Gas] = useState("");

  const [car2Name, setCar2Name] = useState("Car 2");
  const [car2Price, setCar2Price] = useState("");
  const [car2Down, setCar2Down] = useState("");
  const [car2Rate, setCar2Rate] = useState("");
  const [car2Term, setCar2Term] = useState("");
  const [car2Insurance, setCar2Insurance] = useState("");
  const [car2Gas, setCar2Gas] = useState("");

  const [result, setResult] = useState(null);

  function getMonthlyIncome(amount, incomeFrequency) {
    const value = Number(amount);
    if (incomeFrequency === "weekly") return value * 4.33;
    if (incomeFrequency === "biweekly") return value * 2.17;
    if (incomeFrequency === "monthly") return value;
    return value / 12;
  }

  function formatCurrency(value) {
    return value.toLocaleString("en-CA", {
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

  function calculateScore(carPercent, moneyLeft) {
    let score = 100;

    if (carPercent > 15) score -= (carPercent - 15) * 2.5;
    if (moneyLeft < 1500) score -= (1500 - moneyLeft) / 20;

    score = Math.max(0, Math.min(100, Math.round(score)));
    return score;
  }

  function getVerdictFromScore(score) {
    if (score >= 75) {
      return {
        label: "Safe",
        color: "#16a34a",
      };
    }
    if (score >= 50) {
      return {
        label: "Stretch",
        color: "#ca8a04",
      };
    }
    return {
      label: "Risky",
      color: "#dc2626",
    };
  }

  function analyzeCar(
    name,
    price,
    down,
    rate,
    term,
    insurance,
    gas,
    monthlyIncome,
    monthlyExpenses
  ) {
    const carPrice = Number(price) || 0;
    const carDown = Number(down) || 0;
    const carRate = Number(rate) || 0;
    const carTerm = Number(term) || 0;
    const carInsurance = Number(insurance) || 0;
    const carGas = Number(gas) || 0;

    const loanAmount = Math.max(carPrice - carDown, 0);
    const monthlyPayment = calculateMonthlyPayment(loanAmount, carRate, carTerm);

    const maintenance = 75;
    const totalCarCost = monthlyPayment + carInsurance + carGas + maintenance;
    const carPercent = (totalCarCost / monthlyIncome) * 100;
    const moneyLeft = monthlyIncome - monthlyExpenses - totalCarCost;
    const score = calculateScore(carPercent, moneyLeft);
    const verdict = getVerdictFromScore(score);

    const comfortableIncome = totalCarCost / 0.15 * 12;
    const stretchIncome = totalCarCost / 0.25 * 12;

    return {
      name,
      monthlyPayment,
      totalCarCost,
      carPercent,
      moneyLeft,
      score,
      verdict,
      comfortableIncome,
      stretchIncome,
    };
  }

  function calculateComparison() {
    const monthlyIncome = getMonthlyIncome(income, frequency);
    const monthlyExpenses = Number(expenses) || 0;

    if (!monthlyIncome) {
      setResult("Please fill in your income first.");
      return;
    }

    const first = analyzeCar(
      car1Name,
      car1Price,
      car1Down,
      car1Rate,
      car1Term,
      car1Insurance,
      car1Gas,
      monthlyIncome,
      monthlyExpenses
    );

    const second = analyzeCar(
      car2Name,
      car2Price,
      car2Down,
      car2Rate,
      car2Term,
      car2Insurance,
      car2Gas,
      monthlyIncome,
      monthlyExpenses
    );

    let winner = null;

    if (first.score > second.score) {
      winner = `${first.name} is the safer financial choice.`;
    } else if (second.score > first.score) {
      winner = `${second.name} is the safer financial choice.`;
    } else {
      winner = "Both cars score the same financially.";
    }

    setResult({
      monthlyIncome,
      first,
      second,
      winner,
    });
  }

  return (
    <main style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>AffordThisCar</h1>
        <p style={subtitleStyle}>
          Compare two cars and see which one is safer for your budget.
        </p>

        <div style={sectionStyle}>
          <h2 style={sectionHeading}>Your Budget</h2>
          <div style={gridStyle}>
            <div>
              <label style={labelStyle}>Income Amount</label>
              <input
                type="number"
                step="1000"
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
                step="50"
                value={expenses}
                onChange={(e) => setExpenses(e.target.value)}
                placeholder="1800"
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        <div style={compareGridStyle}>
          <div style={carBoxStyle}>
            <h2 style={sectionHeading}>Car 1</h2>
            <div style={gridStyle}>
              <input
                type="text"
                value={car1Name}
                onChange={(e) => setCar1Name(e.target.value)}
                placeholder="Car 1 name"
                style={inputStyle}
              />
              <input
                type="number"
                step="500"
                value={car1Price}
                onChange={(e) => setCar1Price(e.target.value)}
                placeholder="Car price"
                style={inputStyle}
              />
              <input
                type="number"
                step="500"
                value={car1Down}
                onChange={(e) => setCar1Down(e.target.value)}
                placeholder="Down payment"
                style={inputStyle}
              />
              <input
                type="number"
                step="0.1"
                value={car1Rate}
                onChange={(e) => setCar1Rate(e.target.value)}
                placeholder="Interest rate (%)"
                style={inputStyle}
              />
              <input
                type="number"
                step="1"
                value={car1Term}
                onChange={(e) => setCar1Term(e.target.value)}
                placeholder="Loan term (years)"
                style={inputStyle}
              />
              <input
                type="number"
                step="5"
                value={car1Insurance}
                onChange={(e) => setCar1Insurance(e.target.value)}
                placeholder="Monthly insurance"
                style={inputStyle}
              />
              <input
                type="number"
                step="5"
                value={car1Gas}
                onChange={(e) => setCar1Gas(e.target.value)}
                placeholder="Monthly gas"
                style={inputStyle}
              />
            </div>
          </div>

          <div style={carBoxStyle}>
            <h2 style={sectionHeading}>Car 2</h2>
            <div style={gridStyle}>
              <input
                type="text"
                value={car2Name}
                onChange={(e) => setCar2Name(e.target.value)}
                placeholder="Car 2 name"
                style={inputStyle}
              />
              <input
                type="number"
                step="500"
                value={car2Price}
                onChange={(e) => setCar2Price(e.target.value)}
                placeholder="Car price"
                style={inputStyle}
              />
              <input
                type="number"
                step="500"
                value={car2Down}
                onChange={(e) => setCar2Down(e.target.value)}
                placeholder="Down payment"
                style={inputStyle}
              />
              <input
                type="number"
                step="0.1"
                value={car2Rate}
                onChange={(e) => setCar2Rate(e.target.value)}
                placeholder="Interest rate (%)"
                style={inputStyle}
              />
              <input
                type="number"
                step="1"
                value={car2Term}
                onChange={(e) => setCar2Term(e.target.value)}
                placeholder="Loan term (years)"
                style={inputStyle}
              />
              <input
                type="number"
                step="5"
                value={car2Insurance}
                onChange={(e) => setCar2Insurance(e.target.value)}
                placeholder="Monthly insurance"
                style={inputStyle}
              />
              <input
                type="number"
                step="5"
                value={car2Gas}
                onChange={(e) => setCar2Gas(e.target.value)}
                placeholder="Monthly gas"
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        <button onClick={calculateComparison} style={buttonStyle}>
          Compare both cars
        </button>

        {result && typeof result === "string" && (
          <div style={errorBoxStyle}>{result}</div>
        )}

        {result && typeof result === "object" && (
          <div style={resultBoxStyle}>
            <div style={winnerBoxStyle}>{result.winner}</div>

            <div style={compareGridStyle}>
              {[result.first, result.second].map((car, index) => (
                <div key={index} style={resultCardStyle}>
                  <div
                    style={{
                      ...badgeStyle,
                      backgroundColor: car.verdict.color,
                    }}
                  >
                    {car.verdict.label}
                  </div>

                  <h3 style={{ marginTop: 0 }}>{car.name}</h3>

                  <p><strong>Score:</strong> {car.score}/100</p>
                  <p><strong>Monthly payment:</strong> {formatCurrency(car.monthlyPayment)}</p>
                  <p><strong>Total monthly car cost:</strong> {formatCurrency(car.totalCarCost)}</p>
                  <p><strong>Car cost % of income:</strong> {car.carPercent.toFixed(1)}%</p>
                  <p><strong>Money left after expenses:</strong> {formatCurrency(car.moneyLeft)}</p>
                  <p><strong>Comfortable income needed:</strong> {formatCurrency(car.comfortableIncome)}/year</p>
                  <p style={{ marginBottom: 0 }}>
                    <strong>Stretch income needed:</strong> {formatCurrency(car.stretchIncome)}/year
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

const pageStyle = {
  minHeight: "100vh",
  backgroundColor: "#f8fafc",
  padding: "40px 16px",
};

const cardStyle = {
  maxWidth: "1100px",
  margin: "0 auto",
  backgroundColor: "white",
  borderRadius: "20px",
  padding: "32px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
};

const titleStyle = {
  fontSize: "42px",
  fontWeight: "700",
  textAlign: "center",
  marginBottom: "12px",
};

const subtitleStyle = {
  textAlign: "center",
  fontSize: "18px",
  color: "#475569",
  marginBottom: "32px",
};

const sectionStyle = {
  marginBottom: "24px",
};

const sectionHeading = {
  fontSize: "24px",
  marginBottom: "16px",
};

const compareGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: "20px",
};

const gridStyle = {
  display: "grid",
  gap: "12px",
};

const carBoxStyle = {
  backgroundColor: "#f8fafc",
  padding: "20px",
  borderRadius: "16px",
  border: "1px solid #e2e8f0",
};

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  fontWeight: "600",
  color: "#334155",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  fontSize: "16px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
  boxSizing: "border-box",
};

const buttonStyle = {
  marginTop: "24px",
  width: "100%",
  padding: "16px",
  backgroundColor: "black",
  color: "white",
  border: "none",
  borderRadius: "12px",
  fontSize: "16px",
  fontWeight: "600",
  cursor: "pointer",
};

const errorBoxStyle = {
  marginTop: "24px",
  backgroundColor: "#fee2e2",
  color: "#991b1b",
  padding: "16px",
  borderRadius: "12px",
};

const resultBoxStyle = {
  marginTop: "28px",
};

const winnerBoxStyle = {
  marginBottom: "20px",
  backgroundColor: "#dcfce7",
  color: "#166534",
  padding: "16px",
  borderRadius: "12px",
  fontWeight: "700",
  fontSize: "18px",
};

const resultCardStyle = {
  backgroundColor: "#f8fafc",
  padding: "20px",
  borderRadius: "16px",
  border: "1px solid #e2e8f0",
};

const badgeStyle = {
  display: "inline-block",
  color: "white",
  padding: "8px 14px",
  borderRadius: "999px",
  fontWeight: "700",
  marginBottom: "14px",
};