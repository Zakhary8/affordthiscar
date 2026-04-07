"use client";

import { useEffect, useMemo, useState } from "react";
import { usePreferences } from "../context/PreferencesContext";
import { useVehicle } from "../context/VehicleContext";
import { useGarage } from "../context/GarageContext";

export default function Home() {
  const { preferences } = usePreferences();

  const {
    vehicle,
    updateVehicle,
    setFullVehicle,
    clearVehicle,
  } = useVehicle();

  const {
    vehicles,
    activeVehicle,
    saveVehicle,
    setActiveVehicle,
    deleteVehicle,
  } = useGarage();

  const [result, setResult] = useState(null);

  useEffect(() => {
    if (activeVehicle) {
      setFullVehicle({
        ...activeVehicle,
        monthlyInsurance:
          activeVehicle.monthlyInsurance || activeVehicle.insurance || "",
        monthlyGas: activeVehicle.monthlyGas || activeVehicle.gas || "",
      });
    }
  }, [activeVehicle, setFullVehicle]);

  const incomeMultiplier = useMemo(() => {
    switch (vehicle.incomeFrequency) {
      case "Weekly":
        return 52;
      case "Biweekly":
        return 26;
      case "Monthly":
        return 12;
      case "Yearly":
      default:
        return 1;
    }
  }, [vehicle.incomeFrequency]);

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

  function calculate() {
    const price = Number(vehicle.price) || 0;
    const downPayment = Number(vehicle.downPayment) || 0;
    const interestRate = Number(vehicle.interestRate) || 0;
    const loanTerm = Number(vehicle.term) || 0;
    const incomeAmount = Number(vehicle.incomeAmount) || 0;
    const monthlyExpenses = Number(vehicle.monthlyExpenses) || 0;
    const monthlyInsurance = Number(vehicle.monthlyInsurance) || 0;
    const monthlyGas = Number(vehicle.monthlyGas) || 0;

    if (!price || !loanTerm || !incomeAmount) {
      setResult(null);
      return;
    }

    const taxRate =
      preferences?.taxRegion === "Canada / Quebec" ? 0.14975 : 0.13;

    const yearlyIncome =
      vehicle.incomeFrequency === "Yearly"
        ? incomeAmount
        : incomeAmount * incomeMultiplier;

    const monthlyIncome = yearlyIncome / 12;
    const priceAfterTax = price * (1 + taxRate);
    const loanAmount = Math.max(priceAfterTax - downPayment, 0);
    const monthlyPayment = calculateMonthlyPayment(
      loanAmount,
      interestRate,
      loanTerm
    );
    const totalMonthlyVehicleCost =
      monthlyPayment + monthlyInsurance + monthlyGas;
    const leftoverAfterBills =
      monthlyIncome - monthlyExpenses - totalMonthlyVehicleCost;
    const vehiclePercentOfIncome =
      monthlyIncome > 0 ? (totalMonthlyVehicleCost / monthlyIncome) * 100 : 0;

    let affordabilityLabel = "Stretch";
    if (vehiclePercentOfIncome <= 15) affordabilityLabel = "Comfortable";
    else if (vehiclePercentOfIncome <= 20) affordabilityLabel = "Reasonable";
    else if (vehiclePercentOfIncome <= 25) affordabilityLabel = "Tight";

    setResult({
      taxRate,
      yearlyIncome,
      monthlyIncome,
      priceAfterTax,
      loanAmount,
      monthlyPayment,
      totalMonthlyVehicleCost,
      leftoverAfterBills,
      vehiclePercentOfIncome,
      affordabilityLabel,
    });
  }

  function handleSaveVehicle() {
    saveVehicle({
      ...vehicle,
      insurance: vehicle.monthlyInsurance || "",
      gas: vehicle.monthlyGas || "",
    });
  }

  function handleClear() {
    clearVehicle();
    setResult(null);
    setActiveVehicle(null);
  }

  return (
    <div style={pageWrap}>
      <section style={heroCard}>
        <p style={eyebrowStyle}>Calculator</p>
        <h1 style={titleStyle}>Affordability Calculator</h1>
        <p style={leadStyle}>
          Your tax region, currency, and language are saved automatically across
          pages.
          <strong> {preferences?.taxRegion || "Canada / Quebec"}</strong>
          {preferences?.taxRegion === "Canada / Quebec" ? ", 14.975%." : "."}
        </p>
      </section>

      <section style={mainGrid}>
        <div style={cardStyle}>
          <div style={sectionHeaderRow}>
            <div>
              <h2 style={sectionTitleStyle}>Calculator</h2>
              <p style={sectionTextStyle}>
                Your active vehicle fills this form automatically.
              </p>
            </div>
          </div>

          <div style={activeVehicleBox}>
            <strong>Active Vehicle:</strong>{" "}
            {vehicle?.name || "None"} — ${vehicle?.price || "—"}
          </div>

          <div style={gridStyle}>
            <div>
              <label style={labelStyle}>Vehicle Name</label>
              <input
                placeholder="Mazda CX-5"
                value={vehicle.name}
                onChange={(e) => updateVehicle("name", e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Income Amount</label>
              <input
                placeholder="70000"
                value={vehicle.incomeAmount}
                onChange={(e) => updateVehicle("incomeAmount", e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Income Frequency</label>
              <select
                value={vehicle.incomeFrequency || "Yearly"}
                onChange={(e) => updateVehicle("incomeFrequency", e.target.value)}
                style={inputStyle}
              >
                <option value="Yearly">Yearly</option>
                <option value="Monthly">Monthly</option>
                <option value="Biweekly">Biweekly</option>
                <option value="Weekly">Weekly</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Monthly Expenses</label>
              <input
                placeholder="1800"
                value={vehicle.monthlyExpenses}
                onChange={(e) => updateVehicle("monthlyExpenses", e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Vehicle Price Before Tax</label>
              <input
                placeholder="30000"
                value={vehicle.price}
                onChange={(e) => updateVehicle("price", e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Down Payment</label>
              <input
                placeholder="5000"
                value={vehicle.downPayment}
                onChange={(e) => updateVehicle("downPayment", e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Interest Rate (%)</label>
              <input
                placeholder="6.9"
                value={vehicle.interestRate}
                onChange={(e) => updateVehicle("interestRate", e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Loan Term (Years)</label>
              <input
                placeholder="5"
                value={vehicle.term}
                onChange={(e) => updateVehicle("term", e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Monthly Insurance</label>
              <input
                placeholder="180"
                value={vehicle.monthlyInsurance}
                onChange={(e) => updateVehicle("monthlyInsurance", e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Monthly Gas</label>
              <input
                placeholder="160"
                value={vehicle.monthlyGas}
                onChange={(e) => updateVehicle("monthlyGas", e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          <div style={buttonRow}>
            <button onClick={calculate} style={primaryButton}>
              Calculate
            </button>

            <button onClick={handleSaveVehicle} style={greenButton}>
              Save Vehicle
            </button>

            <button onClick={handleClear} style={secondaryButton}>
              Clear
            </button>
          </div>

          {result && (
            <div style={resultWrap}>
              <div style={summaryBanner}>
                <div style={summaryLabel}>Affordability</div>
                <div style={summaryValue}>{result.affordabilityLabel}</div>
              </div>

              <div style={resultGrid}>
                <div style={statCard}>
                  <div style={statLabel}>Price After Tax</div>
                  <div style={statValue}>${result.priceAfterTax.toFixed(0)}</div>
                </div>

                <div style={statCard}>
                  <div style={statLabel}>Loan Amount</div>
                  <div style={statValue}>${result.loanAmount.toFixed(0)}</div>
                </div>

                <div style={statCard}>
                  <div style={statLabel}>Monthly Payment</div>
                  <div style={statValue}>${result.monthlyPayment.toFixed(0)}</div>
                </div>

                <div style={statCard}>
                  <div style={statLabel}>Total Monthly Vehicle Cost</div>
                  <div style={statValue}>
                    ${result.totalMonthlyVehicleCost.toFixed(0)}
                  </div>
                </div>

                <div style={statCard}>
                  <div style={statLabel}>% of Income</div>
                  <div style={statValue}>
                    {result.vehiclePercentOfIncome.toFixed(1)}%
                  </div>
                </div>

                <div style={statCard}>
                  <div style={statLabel}>Left After Bills</div>
                  <div style={statValue}>
                    ${result.leftoverAfterBills.toFixed(0)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={cardStyle}>
          <div style={sectionHeaderRow}>
            <div>
              <h2 style={sectionTitleStyle}>Garage</h2>
              <p style={sectionTextStyle}>
                Saved vehicles stay available for compare and other tools.
              </p>
            </div>
          </div>

          {vehicles.length === 0 ? (
            <div style={emptyStateStyle}>No saved vehicles yet</div>
          ) : (
            <div style={garageListStyle}>
              {vehicles.map((v) => {
                const isActive = activeVehicle?.id === v.id;

                return (
                  <div
                    key={v.id}
                    style={{
                      ...garageCardStyle,
                      border: isActive ? "2px solid #22c55e" : "1px solid #e5e7eb",
                    }}
                  >
                    <div style={garageTopRow}>
                      <div>
                        <div style={garageNameStyle}>
                          {v.name || "Untitled Vehicle"}
                        </div>
                        <div style={garagePriceStyle}>${v.price || "—"}</div>
                      </div>

                      {isActive && <div style={activeBadgeStyle}>Active</div>}
                    </div>

                    <div style={miniMetaStyle}>
                      <span>{v.interestRate || "—"}%</span>
                      <span>{v.term || "—"} years</span>
                    </div>

                    <div style={garageButtonRow}>
                      <button
                        onClick={() => setActiveVehicle(v.id)}
                        style={smallDarkButton}
                      >
                        Use
                      </button>

                      <button
                        onClick={() => deleteVehicle(v.id)}
                        style={smallLightButton}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div style={garageTipStyle}>
            Tip: save a vehicle here, then go to Compare and drop it into Car 1
            or Car 2.
          </div>
        </div>
      </section>
    </div>
  );
}

const pageWrap = {
  display: "flex",
  flexDirection: "column",
  gap: "24px",
};

const heroCard = {
  backgroundColor: "white",
  borderRadius: "24px",
  padding: "32px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
  border: "1px solid #e2e8f0",
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
  margin: 0,
  marginBottom: "12px",
  fontSize: "42px",
  lineHeight: 1.1,
};

const leadStyle = {
  margin: 0,
  fontSize: "17px",
  lineHeight: 1.7,
  color: "#475569",
};

const mainGrid = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1.45fr) minmax(320px, 0.85fr)",
  gap: "20px",
  alignItems: "start",
};

const cardStyle = {
  backgroundColor: "white",
  borderRadius: "24px",
  padding: "28px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
  border: "1px solid #e2e8f0",
};

const sectionHeaderRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "12px",
  marginBottom: "18px",
};

const sectionTitleStyle = {
  margin: 0,
  fontSize: "28px",
};

const sectionTextStyle = {
  margin: "6px 0 0",
  color: "#64748b",
  fontSize: "15px",
};

const activeVehicleBox = {
  marginBottom: "20px",
  padding: "14px 16px",
  borderRadius: "14px",
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  fontWeight: "600",
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
  fontSize: "14px",
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

const buttonRow = {
  marginTop: "20px",
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",
};

const primaryButton = {
  padding: "12px 18px",
  borderRadius: "10px",
  border: "none",
  background: "#111827",
  color: "white",
  fontWeight: "700",
  cursor: "pointer",
};

const greenButton = {
  ...primaryButton,
  background: "#22c55e",
};

const secondaryButton = {
  padding: "12px 18px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
  background: "white",
  color: "#111827",
  fontWeight: "700",
  cursor: "pointer",
};

const resultWrap = {
  marginTop: "24px",
};

const summaryBanner = {
  backgroundColor: "#111827",
  color: "white",
  borderRadius: "18px",
  padding: "20px",
  marginBottom: "16px",
};

const summaryLabel = {
  fontSize: "13px",
  color: "#cbd5e1",
  fontWeight: "700",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  marginBottom: "8px",
};

const summaryValue = {
  fontSize: "30px",
  fontWeight: "800",
};

const resultGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "14px",
};

const statCard = {
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "16px",
  padding: "18px",
};

const statLabel = {
  fontSize: "13px",
  color: "#64748b",
  marginBottom: "8px",
  fontWeight: "700",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

const statValue = {
  fontSize: "26px",
  fontWeight: "800",
  color: "#111827",
};

const emptyStateStyle = {
  padding: "18px",
  borderRadius: "14px",
  border: "1px solid #e2e8f0",
  backgroundColor: "#f8fafc",
  color: "#64748b",
};

const garageListStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const garageCardStyle = {
  borderRadius: "16px",
  padding: "16px",
  backgroundColor: "#f8fafc",
};

const garageTopRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "10px",
};

const garageNameStyle = {
  fontWeight: "800",
  fontSize: "18px",
  color: "#111827",
};

const garagePriceStyle = {
  marginTop: "4px",
  color: "#475569",
  fontSize: "15px",
};

const activeBadgeStyle = {
  backgroundColor: "#dcfce7",
  color: "#166534",
  border: "1px solid #86efac",
  borderRadius: "999px",
  padding: "4px 10px",
  fontSize: "12px",
  fontWeight: "800",
};

const miniMetaStyle = {
  display: "flex",
  gap: "14px",
  marginTop: "10px",
  color: "#64748b",
  fontSize: "14px",
};

const garageButtonRow = {
  marginTop: "14px",
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
};

const smallDarkButton = {
  padding: "10px 14px",
  borderRadius: "10px",
  border: "none",
  background: "#111827",
  color: "white",
  fontWeight: "700",
  cursor: "pointer",
};

const smallLightButton = {
  padding: "10px 14px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
  background: "white",
  color: "#111827",
  fontWeight: "700",
  cursor: "pointer",
};

const garageTipStyle = {
  marginTop: "16px",
  color: "#64748b",
  fontSize: "14px",
  lineHeight: 1.6,
};