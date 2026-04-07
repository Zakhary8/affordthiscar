"use client";

import { useEffect, useState } from "react";
import { regions } from "../../data/regions";
import { useGarage } from "../../context/GarageContext";

export default function ComparePage() {
  const { vehicles, activeVehicle, setActiveVehicle } = useGarage();

  const [regionKey, setRegionKey] = useState("canada");

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

  useEffect(() => {
    if (!activeVehicle) return;

    setCar1Name(activeVehicle.name || "Car 1");
    setCar1Price(activeVehicle.price || "");
    setCar1Down(activeVehicle.downPayment || "");
    setCar1Rate(activeVehicle.interestRate || "");
    setCar1Term(activeVehicle.term || "");
    setCar1Insurance(activeVehicle.insurance || activeVehicle.monthlyInsurance || "");
    setCar1Gas(activeVehicle.gas || activeVehicle.monthlyGas || "");
  }, [activeVehicle]);

  function fillCar1(vehicle) {
    setCar1Name(vehicle.name || "Car 1");
    setCar1Price(vehicle.price || "");
    setCar1Down(vehicle.downPayment || "");
    setCar1Rate(vehicle.interestRate || "");
    setCar1Term(vehicle.term || "");
    setCar1Insurance(vehicle.insurance || vehicle.monthlyInsurance || "");
    setCar1Gas(vehicle.gas || vehicle.monthlyGas || "");
  }

  function fillCar2(vehicle) {
    setCar2Name(vehicle.name || "Car 2");
    setCar2Price(vehicle.price || "");
    setCar2Down(vehicle.downPayment || "");
    setCar2Rate(vehicle.interestRate || "");
    setCar2Term(vehicle.term || "");
    setCar2Insurance(vehicle.insurance || vehicle.monthlyInsurance || "");
    setCar2Gas(vehicle.gas || vehicle.monthlyGas || "");
  }

  function money(value, currency) {
    return Number(value || 0).toLocaleString("en-US", {
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

  function analyzeCar({
    name,
    price,
    down,
    rate,
    term,
    insurance,
    gas,
    taxRate,
  }) {
    const cleanPrice = Number(price) || 0;
    const cleanDown = Number(down) || 0;
    const cleanRate = Number(rate) || 0;
    const cleanTerm = Number(term) || 0;
    const cleanInsurance = Number(insurance) || 0;
    const cleanGas = Number(gas) || 0;

    const taxAmount = cleanPrice * taxRate;
    const priceAfterTax = cleanPrice + taxAmount;
    const loanAmount = Math.max(priceAfterTax - cleanDown, 0);
    const monthlyPayment = calculateMonthlyPayment(loanAmount, cleanRate, cleanTerm);
    const maintenance = 75;
    const totalMonthlyCost =
      monthlyPayment + cleanInsurance + cleanGas + maintenance;

    return {
      name,
      price: cleanPrice,
      taxAmount,
      priceAfterTax,
      loanAmount,
      monthlyPayment,
      insurance: cleanInsurance,
      gas: cleanGas,
      maintenance,
      totalMonthlyCost,
    };
  }

  function compareCars() {
    const region = regions[regionKey] || regions.canada;
    const taxRate = region.taxRate;
    const currency = region.currency;

    if (!car1Price || !car1Term || !car2Price || !car2Term) {
      setResult("Please fill in at least price and loan term for both cars.");
      return;
    }

    const first = analyzeCar({
      name: car1Name,
      price: car1Price,
      down: car1Down,
      rate: car1Rate,
      term: car1Term,
      insurance: car1Insurance,
      gas: car1Gas,
      taxRate,
    });

    const second = analyzeCar({
      name: car2Name,
      price: car2Price,
      down: car2Down,
      rate: car2Rate,
      term: car2Term,
      insurance: car2Insurance,
      gas: car2Gas,
      taxRate,
    });

    let winner = "Both cars are very close.";
    if (first.totalMonthlyCost < second.totalMonthlyCost) {
      winner = `${first.name} is the cheaper monthly choice.`;
    } else if (second.totalMonthlyCost < first.totalMonthlyCost) {
      winner = `${second.name} is the cheaper monthly choice.`;
    }

    setResult({
      currency,
      first,
      second,
      winner,
    });
  }

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
      <section style={heroStyle}>
        <p style={eyebrowStyle}>Compare cars</p>
        <h1 style={titleStyle}>Compare two cars side by side</h1>
        <p style={leadStyle}>
          See which vehicle costs less per month once tax, financing, insurance,
          gas, and maintenance are included.
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
        </div>
      </section>

      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>Garage Vehicles</h2>

        {vehicles.length === 0 ? (
          <div style={emptyStateStyle}>
            No saved vehicles yet. Save one from the home page first.
          </div>
        ) : (
          <div style={garageGridStyle}>
            {vehicles.map((vehicle) => {
              const isActive = activeVehicle?.id === vehicle.id;

              return (
                <div
                  key={vehicle.id}
                  style={{
                    ...garageCardStyle,
                    border: isActive ? "2px solid #22c55e" : "1px solid #e2e8f0",
                  }}
                >
                  <div style={garageNameStyle}>{vehicle.name || "Untitled Vehicle"}</div>
                  <div style={garagePriceStyle}>${vehicle.price || "—"}</div>

                  <div style={garageActionRowStyle}>
                    <button
                      onClick={() => {
                        fillCar1(vehicle);
                        setActiveVehicle(vehicle.id);
                      }}
                      style={garagePrimaryButtonStyle}
                    >
                      Use as Car 1
                    </button>

                    <button
                      onClick={() => fillCar2(vehicle)}
                      style={garageSecondaryButtonStyle}
                    >
                      Use as Car 2
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section style={twoColGridStyle}>
        <div style={cardStyle}>
          <h2 style={sectionTitleStyle}>{car1Name}</h2>
          <div style={gridStyle}>
            <div>
              <label style={labelStyle}>Car Name</label>
              <input value={car1Name} onChange={(e) => setCar1Name(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Price</label>
              <input value={car1Price} onChange={(e) => setCar1Price(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Down Payment</label>
              <input value={car1Down} onChange={(e) => setCar1Down(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Interest Rate (%)</label>
              <input value={car1Rate} onChange={(e) => setCar1Rate(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Loan Term (Years)</label>
              <input value={car1Term} onChange={(e) => setCar1Term(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Monthly Insurance</label>
              <input value={car1Insurance} onChange={(e) => setCar1Insurance(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Monthly Gas</label>
              <input value={car1Gas} onChange={(e) => setCar1Gas(e.target.value)} style={inputStyle} />
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <h2 style={sectionTitleStyle}>{car2Name}</h2>
          <div style={gridStyle}>
            <div>
              <label style={labelStyle}>Car Name</label>
              <input value={car2Name} onChange={(e) => setCar2Name(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Price</label>
              <input value={car2Price} onChange={(e) => setCar2Price(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Down Payment</label>
              <input value={car2Down} onChange={(e) => setCar2Down(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Interest Rate (%)</label>
              <input value={car2Rate} onChange={(e) => setCar2Rate(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Loan Term (Years)</label>
              <input value={car2Term} onChange={(e) => setCar2Term(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Monthly Insurance</label>
              <input value={car2Insurance} onChange={(e) => setCar2Insurance(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Monthly Gas</label>
              <input value={car2Gas} onChange={(e) => setCar2Gas(e.target.value)} style={inputStyle} />
            </div>
          </div>
        </div>
      </section>

      <button onClick={compareCars} style={buttonStyle}>
        Compare Cars
      </button>

      <section style={resultsSectionStyle}>
        {!result && (
          <div style={emptyStateStyle}>
            Enter both vehicles to compare their full ownership costs.
          </div>
        )}

        {typeof result === "string" && <div style={errorStyle}>{result}</div>}

        {result && typeof result === "object" && (
          <>
            <div style={winnerBoxStyle}>{result.winner}</div>

            <div style={twoColGridStyle}>
              {[result.first, result.second].map((car) => (
                <div key={car.name} style={cardStyle}>
                  <h2 style={sectionTitleStyle}>{car.name}</h2>

                  <div style={gridStyle}>
                    <div style={statCardStyle}>
                      <div style={statLabelStyle}>Price After Tax</div>
                      <div style={statValueStyle}>
                        {money(car.priceAfterTax, result.currency)}
                      </div>
                    </div>

                    <div style={statCardStyle}>
                      <div style={statLabelStyle}>Loan Amount</div>
                      <div style={statValueStyle}>
                        {money(car.loanAmount, result.currency)}
                      </div>
                    </div>

                    <div style={statCardStyle}>
                      <div style={statLabelStyle}>Monthly Payment</div>
                      <div style={statValueStyle}>
                        {money(car.monthlyPayment, result.currency)}
                      </div>
                    </div>

                    <div style={statCardStyle}>
                      <div style={statLabelStyle}>Insurance</div>
                      <div style={statValueStyle}>
                        {money(car.insurance, result.currency)}
                      </div>
                    </div>

                    <div style={statCardStyle}>
                      <div style={statLabelStyle}>Gas</div>
                      <div style={statValueStyle}>
                        {money(car.gas, result.currency)}
                      </div>
                    </div>

                    <div style={statCardStyle}>
                      <div style={statLabelStyle}>Maintenance</div>
                      <div style={statValueStyle}>
                        {money(car.maintenance, result.currency)}
                      </div>
                    </div>
                  </div>

                  <div style={highlightBoxStyle}>
                    <div style={highlightLabelStyle}>Total Monthly Cost</div>
                    <div style={highlightValueStyle}>
                      {money(car.totalMonthlyCost, result.currency)}
                    </div>
                  </div>
                </div>
              ))}
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

const twoColGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: "20px",
};

const garageGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "16px",
};

const garageCardStyle = {
  backgroundColor: "#f8fafc",
  padding: "18px",
  borderRadius: "16px",
};

const garageNameStyle = {
  fontWeight: "800",
  fontSize: "18px",
  color: "#111827",
};

const garagePriceStyle = {
  marginTop: "6px",
  marginBottom: "14px",
  color: "#475569",
};

const garageActionRowStyle = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
};

const garagePrimaryButtonStyle = {
  padding: "12px 16px",
  backgroundColor: "#111827",
  color: "white",
  border: "none",
  borderRadius: "12px",
  fontSize: "14px",
  fontWeight: "700",
  cursor: "pointer",
};

const garageSecondaryButtonStyle = {
  padding: "12px 16px",
  backgroundColor: "white",
  color: "#111827",
  border: "1px solid #cbd5e1",
  borderRadius: "12px",
  fontSize: "14px",
  fontWeight: "700",
  cursor: "pointer",
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
  marginTop: "10px",
  marginBottom: "24px",
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

const winnerBoxStyle = {
  backgroundColor: "#ecfccb",
  color: "#3f6212",
  padding: "18px",
  borderRadius: "18px",
  fontWeight: "800",
  fontSize: "18px",
  marginBottom: "20px",
  border: "1px solid #bef264",
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