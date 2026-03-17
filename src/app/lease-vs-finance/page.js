"use client";

import { useMemo, useState } from "react";
import { usePreferences } from "../../context/PreferencesContext";

export default function LeaseVsFinancePage() {
  const { preferences, taxRate, countryLabel, subdivisionLabel } = usePreferences();

  const [vehicleName, setVehicleName] = useState("");
  const [vehiclePrice, setVehiclePrice] = useState("");
  const [financeDownPayment, setFinanceDownPayment] = useState("");
  const [financeRate, setFinanceRate] = useState("");
  const [financeTermYears, setFinanceTermYears] = useState("");
  const [leaseMonthlyPayment, setLeaseMonthlyPayment] = useState("");
  const [leaseTermYears, setLeaseTermYears] = useState("");
  const [leaseDownPayment, setLeaseDownPayment] = useState("");
  const [leaseBuyoutPrice, setLeaseBuyoutPrice] = useState("");
  const [result, setResult] = useState(null);

  const locale = useMemo(() => {
    if (preferences.language === "fr") return "fr-CA";
    if (preferences.language === "es") return "es-MX";
    if (preferences.currency === "USD") return "en-US";
    if (preferences.currency === "EUR") return "de-DE";
    if (preferences.currency === "MXN") return "es-MX";
    return "en-CA";
  }, [preferences.language, preferences.currency]);

  const text = useMemo(() => {
    if (preferences.language === "fr") {
      return {
        eyebrow: "Location vs Financement",
        title: "Calculateur Location vs Financement",
        subtitle:
          "Comparez le cout total de location et de financement avec votre devise et votre region fiscale enregistrees.",
        inputs: "Entrees",
        results: "Resultats",
        vehicleName: "Nom du vehicule",
        vehiclePrice: "Prix du vehicule avant taxes",
        financeDownPayment: "Mise de fonds financement",
        financeRate: "Taux financement (%)",
        financeTermYears: "Duree financement (annees)",
        leaseMonthlyPayment: "Paiement mensuel location",
        leaseTermYears: "Duree location (annees)",
        leaseDownPayment: "Mise de fonds location",
        leaseBuyoutPrice: "Prix de rachat",
        compare: "Comparer location et financement",
        empty:
          "Entrez vos chiffres pour comparer le cout total de location et de financement.",
        error:
          "Veuillez remplir le prix du vehicule, la duree du financement, la duree de location et le paiement mensuel de location.",
        vehicle: "Vehicule",
        taxRegion: "Region fiscale",
        priceAfterTax: "Prix apres taxes",
        financeMonthly: "Paiement mensuel financement",
        financeTotal: "Total paye financement",
        financeInterest: "Interets payes financement",
        leaseTotal: "Total paye location",
        leaseBuyout: "Prix de rachat location",
        leaseWithBuyout: "Location + rachat",
        recommendation: "Recommandation",
        unnamed: "Vehicule sans nom",
      };
    }

    if (preferences.language === "es") {
      return {
        eyebrow: "Arrendamiento vs Financiamiento",
        title: "Calculadora de Arrendamiento vs Financiamiento",
        subtitle:
          "Compara el costo total de arrendar y financiar usando tu moneda y region fiscal guardadas.",
        inputs: "Datos",
        results: "Resultados",
        vehicleName: "Nombre del vehiculo",
        vehiclePrice: "Precio del vehiculo antes de impuestos",
        financeDownPayment: "Pago inicial financiamiento",
        financeRate: "Tasa financiamiento (%)",
        financeTermYears: "Plazo financiamiento (anos)",
        leaseMonthlyPayment: "Pago mensual arrendamiento",
        leaseTermYears: "Plazo arrendamiento (anos)",
        leaseDownPayment: "Pago inicial arrendamiento",
        leaseBuyoutPrice: "Precio de compra final",
        compare: "Comparar arrendamiento y financiamiento",
        empty:
          "Ingresa tus cifras para comparar el costo total de arrendar y financiar.",
        error:
          "Completa precio del vehiculo, plazo de financiamiento, plazo de arrendamiento y pago mensual de arrendamiento.",
        vehicle: "Vehiculo",
        taxRegion: "Region fiscal",
        priceAfterTax: "Precio despues de impuestos",
        financeMonthly: "Pago mensual financiamiento",
        financeTotal: "Total pagado financiamiento",
        financeInterest: "Intereses pagados financiamiento",
        leaseTotal: "Total pagado arrendamiento",
        leaseBuyout: "Compra final arrendamiento",
        leaseWithBuyout: "Arrendamiento + compra final",
        recommendation: "Recomendacion",
        unnamed: "Vehiculo sin nombre",
      };
    }

    return {
      eyebrow: "Lease vs Finance",
      title: "Lease vs Finance Calculator",
      subtitle:
        "Compare total lease and finance costs using your saved currency and tax region.",
      inputs: "Inputs",
      results: "Results",
      vehicleName: "Vehicle Name",
      vehiclePrice: "Vehicle Price Before Tax",
      financeDownPayment: "Finance Down Payment",
      financeRate: "Finance Interest Rate (%)",
      financeTermYears: "Finance Term (Years)",
      leaseMonthlyPayment: "Lease Monthly Payment",
      leaseTermYears: "Lease Term (Years)",
      leaseDownPayment: "Lease Down Payment",
      leaseBuyoutPrice: "Lease Buyout Price",
      compare: "Compare Lease vs Finance",
      empty: "Enter your numbers to compare total lease and finance costs.",
      error:
        "Please fill in vehicle price, finance term, lease term, and lease monthly payment.",
      vehicle: "Vehicle",
      taxRegion: "Tax Region",
      priceAfterTax: "After-Tax Price",
      financeMonthly: "Finance Monthly Payment",
      financeTotal: "Finance Total Paid",
      financeInterest: "Finance Interest Paid",
      leaseTotal: "Lease Total Paid",
      leaseBuyout: "Lease Buyout Price",
      leaseWithBuyout: "Lease + Buyout Total",
      recommendation: "Recommendation",
      unnamed: "Unnamed vehicle",
    };
  }, [preferences.language]);

  function formatCurrency(value) {
    return Number(value || 0).toLocaleString(locale, {
      style: "currency",
      currency: preferences.currency,
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

  function calculate() {
    const basePrice = Number(vehiclePrice) || 0;
    const financeDown = Number(financeDownPayment) || 0;
    const annualRate = Number(financeRate) || 0;
    const financeYears = Number(financeTermYears) || 0;
    const leaseMonthly = Number(leaseMonthlyPayment) || 0;
    const leaseYears = Number(leaseTermYears) || 0;
    const leaseDown = Number(leaseDownPayment) || 0;
    const buyout = Number(leaseBuyoutPrice) || 0;

    if (!basePrice || !financeYears || !leaseYears || !leaseMonthly) {
      setResult(text.error);
      return;
    }

    const taxedPrice = basePrice * (1 + taxRate);
    const financedAmount = Math.max(taxedPrice - financeDown, 0);

    const financeMonthly = calculateMonthlyPayment(
      financedAmount,
      annualRate,
      financeYears
    );

    const financeTotalPaid = financeMonthly * financeYears * 12 + financeDown;
    const financeInterestPaid = Math.max(0, financeTotalPaid - taxedPrice);

    const leaseTotalPaid = leaseMonthly * leaseYears * 12 + leaseDown;
    const leaseWithBuyout = leaseTotalPaid + buyout;

    let recommendation = "";

    if (financeTotalPaid < leaseWithBuyout) {
      recommendation =
        preferences.language === "fr"
          ? "Le financement coute moins cher si vous gardez le vehicule."
          : preferences.language === "es"
          ? "Financiar cuesta menos si planeas quedarte con el vehiculo."
          : "Financing costs less if you plan to keep the vehicle.";
    } else if (leaseWithBuyout < financeTotalPaid) {
      recommendation =
        preferences.language === "fr"
          ? "La location peut couter moins cher au total, meme avec le rachat."
          : preferences.language === "es"
          ? "Arrendar puede costar menos en total, incluso con la compra final."
          : "Leasing can cost less overall, even after the buyout.";
    } else {
      recommendation =
        preferences.language === "fr"
          ? "La location et le financement sont tres proches en cout total."
          : preferences.language === "es"
          ? "Arrendar y financiar son muy parecidos en costo total."
          : "Lease and finance are very close in total cost.";
    }

    setResult({
      vehicleName,
      taxedPrice,
      financeMonthly,
      financeTotalPaid,
      financeInterestPaid,
      leaseTotalPaid,
      buyout,
      leaseWithBuyout,
      recommendation,
    });
  }

  return (
    <div style={pageStyle}>
      <section style={cardStyle}>
        <p style={eyebrowStyle}>{text.eyebrow}</p>
        <h1 style={titleStyle}>{text.title}</h1>
        <p style={subtitleStyle}>
          {text.subtitle} <strong>{countryLabel}</strong> /{" "}
          <strong>{subdivisionLabel}</strong>.
        </p>
      </section>

      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>{text.inputs}</h2>

        <div style={gridStyle}>
          <div>
            <label style={labelStyle}>{text.vehicleName}</label>
            <input
              type="text"
              value={vehicleName}
              onChange={(e) => setVehicleName(e.target.value)}
              placeholder="Mazda CX-5"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>{text.vehiclePrice}</label>
            <input
              type="number"
              value={vehiclePrice}
              onChange={(e) => setVehiclePrice(e.target.value)}
              placeholder="32000"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>{text.financeDownPayment}</label>
            <input
              type="number"
              value={financeDownPayment}
              onChange={(e) => setFinanceDownPayment(e.target.value)}
              placeholder="5000"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>{text.financeRate}</label>
            <input
              type="number"
              value={financeRate}
              onChange={(e) => setFinanceRate(e.target.value)}
              placeholder="6.9"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>{text.financeTermYears}</label>
            <input
              type="number"
              value={financeTermYears}
              onChange={(e) => setFinanceTermYears(e.target.value)}
              placeholder="5"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>{text.leaseMonthlyPayment}</label>
            <input
              type="number"
              value={leaseMonthlyPayment}
              onChange={(e) => setLeaseMonthlyPayment(e.target.value)}
              placeholder="479"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>{text.leaseTermYears}</label>
            <input
              type="number"
              value={leaseTermYears}
              onChange={(e) => setLeaseTermYears(e.target.value)}
              placeholder="4"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>{text.leaseDownPayment}</label>
            <input
              type="number"
              value={leaseDownPayment}
              onChange={(e) => setLeaseDownPayment(e.target.value)}
              placeholder="2000"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>{text.leaseBuyoutPrice}</label>
            <input
              type="number"
              value={leaseBuyoutPrice}
              onChange={(e) => setLeaseBuyoutPrice(e.target.value)}
              placeholder="18000"
              style={inputStyle}
            />
          </div>
        </div>

        <button onClick={calculate} style={buttonStyle}>
          {text.compare}
        </button>
      </section>

      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>{text.results}</h2>

        {!result && <p style={mutedTextStyle}>{text.empty}</p>}

        {typeof result === "string" && <div style={errorStyle}>{result}</div>}

        {result && typeof result === "object" && (
          <div>
            <div style={statsGridStyle}>
              <div style={statStyle}>
                <div style={smallLabelStyle}>{text.vehicle}</div>
                <div style={statValueStyle}>
                  {result.vehicleName || text.unnamed}
                </div>
              </div>

              <div style={statStyle}>
                <div style={smallLabelStyle}>{text.taxRegion}</div>
                <div style={statValueStyle}>
                  {countryLabel} / {subdivisionLabel}
                </div>
              </div>

              <div style={statStyle}>
                <div style={smallLabelStyle}>{text.priceAfterTax}</div>
                <div style={statValueStyle}>
                  {formatCurrency(result.taxedPrice)}
                </div>
              </div>

              <div style={statStyle}>
                <div style={smallLabelStyle}>{text.financeMonthly}</div>
                <div style={statValueStyle}>
                  {formatCurrency(result.financeMonthly)}
                </div>
              </div>

              <div style={statStyle}>
                <div style={smallLabelStyle}>{text.financeTotal}</div>
                <div style={statValueStyle}>
                  {formatCurrency(result.financeTotalPaid)}
                </div>
              </div>

              <div style={statStyle}>
                <div style={smallLabelStyle}>{text.financeInterest}</div>
                <div style={statValueStyle}>
                  {formatCurrency(result.financeInterestPaid)}
                </div>
              </div>

              <div style={statStyle}>
                <div style={smallLabelStyle}>{text.leaseTotal}</div>
                <div style={statValueStyle}>
                  {formatCurrency(result.leaseTotalPaid)}
                </div>
              </div>

              <div style={statStyle}>
                <div style={smallLabelStyle}>{text.leaseBuyout}</div>
                <div style={statValueStyle}>{formatCurrency(result.buyout)}</div>
              </div>

              <div style={statStyle}>
                <div style={smallLabelStyle}>{text.leaseWithBuyout}</div>
                <div style={statValueStyle}>
                  {formatCurrency(result.leaseWithBuyout)}
                </div>
              </div>
            </div>

            <div style={recommendationWrapStyle}>
              <div style={smallLabelStyle}>{text.recommendation}</div>
              <div style={recommendationTextStyle}>{result.recommendation}</div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

const pageStyle = {
  maxWidth: "1100px",
  margin: "0 auto",
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
  fontSize: "44px",
  lineHeight: 1.1,
};

const subtitleStyle = {
  margin: 0,
  color: "#475569",
  fontSize: "18px",
  lineHeight: 1.7,
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

const smallLabelStyle = {
  fontSize: "14px",
  color: "#64748b",
  marginBottom: "8px",
  fontWeight: "700",
  textTransform: "uppercase",
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

const recommendationTextStyle = {
  fontSize: "20px",
  fontWeight: "700",
  color: "#111827",
};