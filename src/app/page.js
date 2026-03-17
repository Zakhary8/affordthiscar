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

  const text = useMemo(() => {
    if (preferences.language === "fr") {
      return {
        heroEyebrow: "AffordThisCar",
        heroTitle: "Pouvez-vous vraiment vous permettre cette voiture ?",
        heroSubtitle:
          "Calculez l abordabilite, comparez des vehicules, estimez le cout total de possession et analysez une offre de concessionnaire avec vos preferences enregistrees.",
        compareCars: "Comparer voitures",
        paymentGuides: "Guides de paiement",
        incomeNeeded: "Revenu requis",
        dealReview: "Analyse d offre",
        calculatorTitle: "Calculateur d abordabilite",
        calculatorSubtitle:
          "Votre region fiscale, votre devise et votre langue sont maintenant conservees automatiquement entre les pages.",
        vehicleName: "Nom du vehicule",
        incomeAmount: "Revenu",
        incomeFrequency: "Frequence du revenu",
        monthlyExpenses: "Depenses mensuelles",
        vehiclePrice: "Prix du vehicule avant taxes",
        downPayment: "Mise de fonds",
        interestRate: "Taux d interet (%)",
        loanTerm: "Duree du pret (annees)",
        monthlyInsurance: "Assurance mensuelle",
        monthlyGas: "Essence mensuelle",
        yearly: "Annuel",
        monthly: "Mensuel",
        biweekly: "Aux deux semaines",
        weekly: "Hebdomadaire",
        calculate: "Calculer",
        results: "Resultats",
        emptyResults:
          "Entrez vos chiffres pour voir votre resultat d abordabilite selon votre devise et votre region fiscale enregistrees.",
        fillRequired:
          "Veuillez remplir le revenu, le prix du vehicule et la duree du pret.",
        affordabilityScore: "Score d abordabilite",
        vehicle: "Vehicule",
        taxRegion: "Region fiscale",
        priceBeforeTax: "Prix avant taxes",
        salesTaxAmount: "Montant des taxes",
        priceAfterTax: "Prix apres taxes",
        monthlyIncome: "Revenu mensuel",
        monthlyPayment: "Paiement mensuel",
        trueMonthlyCost: "Vrai cout mensuel",
        costPercent: "Pourcentage du revenu",
        moneyLeft: "Reste du budget",
        maintenanceBuffer: "Reserve entretien",
        appliedTaxRate: "Taux de taxe applique",
        recommendedRanges: "Fourchettes recommandees",
        safe: "Securitaire",
        stretch: "A surveiller",
        risky: "Risque",
        beforeTaxNote: "Prix du vehicule avant taxes",
        popularPages: "Pages populaires",
        frenchPage: "Page d abordabilite francaise",
        spanishPage: "Page d abordabilite espagnole",
        debugTitle: "Etat actuel des preferences",
        language: "Langue",
        country: "Pays",
        provinceState: "Province / Etat",
        subdivisionKey: "Cle subdivision",
        currency: "Devise",
        taxRateLabel: "Taux de taxe",
      };
    }

    if (preferences.language === "es") {
      return {
        heroEyebrow: "AffordThisCar",
        heroTitle: "Realmente puedes pagar ese auto?",
        heroSubtitle:
          "Calcula asequibilidad, compara vehiculos, estima el costo total de propiedad y revisa una oferta del concesionario con tus preferencias guardadas.",
        compareCars: "Comparar autos",
        paymentGuides: "Guias de pago",
        incomeNeeded: "Ingreso necesario",
        dealReview: "Revision de oferta",
        calculatorTitle: "Calculadora de asequibilidad",
        calculatorSubtitle:
          "Tu region fiscal, moneda e idioma ahora se conservan automaticamente entre paginas.",
        vehicleName: "Nombre del vehiculo",
        incomeAmount: "Ingreso",
        incomeFrequency: "Frecuencia del ingreso",
        monthlyExpenses: "Gastos mensuales",
        vehiclePrice: "Precio del vehiculo antes de impuestos",
        downPayment: "Pago inicial",
        interestRate: "Tasa de interes (%)",
        loanTerm: "Plazo del prestamo (anos)",
        monthlyInsurance: "Seguro mensual",
        monthlyGas: "Gasolina mensual",
        yearly: "Anual",
        monthly: "Mensual",
        biweekly: "Quincenal",
        weekly: "Semanal",
        calculate: "Calcular",
        results: "Resultados",
        emptyResults:
          "Ingresa tus datos para ver tu resultado de asequibilidad con tu moneda y region fiscal guardadas.",
        fillRequired:
          "Completa ingreso, precio del vehiculo y plazo del prestamo.",
        affordabilityScore: "Puntaje de asequibilidad",
        vehicle: "Vehiculo",
        taxRegion: "Region fiscal",
        priceBeforeTax: "Precio antes de impuestos",
        salesTaxAmount: "Impuestos",
        priceAfterTax: "Precio despues de impuestos",
        monthlyIncome: "Ingreso mensual",
        monthlyPayment: "Pago mensual",
        trueMonthlyCost: "Costo mensual real",
        costPercent: "Porcentaje del ingreso",
        moneyLeft: "Dinero restante",
        maintenanceBuffer: "Reserva de mantenimiento",
        appliedTaxRate: "Tasa de impuesto aplicada",
        recommendedRanges: "Rangos recomendados",
        safe: "Seguro",
        stretch: "Ajustado",
        risky: "Riesgoso",
        beforeTaxNote: "Precio del vehiculo antes de impuestos",
        popularPages: "Paginas populares",
        frenchPage: "Pagina francesa de asequibilidad",
        spanishPage: "Pagina espanola de asequibilidad",
        debugTitle: "Estado actual de preferencias",
        language: "Idioma",
        country: "Pais",
        provinceState: "Provincia / Estado",
        subdivisionKey: "Clave subdivision",
        currency: "Moneda",
        taxRateLabel: "Tasa de impuesto",
      };
    }

    return {
      heroEyebrow: "AffordThisCar",
      heroTitle: "Can You Actually Afford That Car?",
      heroSubtitle:
        "Check affordability, compare vehicles, estimate ownership cost, review dealership deals, and explore payment guides with your saved preferences.",
      compareCars: "Compare Cars",
      paymentGuides: "Payment Guides",
      incomeNeeded: "Income Needed",
      dealReview: "Deal Review",
      calculatorTitle: "Affordability Calculator",
      calculatorSubtitle:
        "Your tax region, currency, and language are now saved automatically across pages.",
      vehicleName: "Vehicle Name",
      incomeAmount: "Income Amount",
      incomeFrequency: "Income Frequency",
      monthlyExpenses: "Monthly Expenses",
      vehiclePrice: "Vehicle Price Before Tax",
      downPayment: "Down Payment",
      interestRate: "Interest Rate (%)",
      loanTerm: "Loan Term (Years)",
      monthlyInsurance: "Monthly Insurance",
      monthlyGas: "Monthly Gas",
      yearly: "Yearly",
      monthly: "Monthly",
      biweekly: "Biweekly",
      weekly: "Weekly",
      calculate: "Calculate",
      results: "Results",
      emptyResults:
        "Enter your numbers to see your affordability result with your saved currency and tax region.",
      fillRequired: "Please fill in income, car price, and loan term.",
      affordabilityScore: "Affordability Score",
      vehicle: "Vehicle",
      taxRegion: "Tax Region",
      priceBeforeTax: "Price Before Tax",
      salesTaxAmount: "Sales Tax Amount",
      priceAfterTax: "Price After Tax",
      monthlyIncome: "Monthly Income",
      monthlyPayment: "Monthly Payment",
      trueMonthlyCost: "True Monthly Cost",
      costPercent: "Cost Percent of Income",
      moneyLeft: "Money Left",
      maintenanceBuffer: "Maintenance Buffer",
      appliedTaxRate: "Applied Tax Rate",
      recommendedRanges: "Recommended Price Ranges",
      safe: "Safe",
      stretch: "Stretch",
      risky: "Risky",
      beforeTaxNote: "Before tax vehicle price",
      popularPages: "Popular Search Pages",
      frenchPage: "French affordability page",
      spanishPage: "Spanish affordability page",
      debugTitle: "Current Preference Debug",
      language: "Language",
      country: "Country",
      provinceState: "Province / State",
      subdivisionKey: "Subdivision Key",
      currency: "Currency",
      taxRateLabel: "Tax Rate",
    };
  }, [preferences.language]);

  const localizedLinks = useMemo(() => {
    const isFr = preferences.language === "fr";
    const isEs = preferences.language === "es";

    return {
      compare: "/compare",
      dealReview: "/deal-review",
      paymentGuides: isFr
        ? "/fr/paiement-auto/30000"
        : isEs
        ? "/es/pago-auto/30000"
        : "/car-payment/30000",
      incomeNeeded: isFr
        ? "/fr/salaire/70000"
        : isEs
        ? "/es/salario/70000"
        : "/income-needed/30000",
      salaryPage: isFr
        ? "/fr/salaire/70000"
        : isEs
        ? "/es/salario/70000"
        : "/salary/70000",
      affordabilityPage: isFr
        ? "/fr/puis-je-me-permettre-une-voiture/30000"
        : isEs
        ? "/es/puedo-permitirme-un-auto/30000"
        : "/can-i-afford-a/30000",
      frenchAffordability: "/fr/puis-je-me-permettre-une-voiture/30000",
      spanishAffordability: "/es/puedo-permitirme-un-auto/30000",
    };
  }, [preferences.language]);

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
    if (preferences.language === "fr") {
      if (score >= 75) return text.safe;
      if (score >= 50) return text.stretch;
      return text.risky;
    }

    if (preferences.language === "es") {
      if (score >= 75) return text.safe;
      if (score >= 50) return text.stretch;
      return text.risky;
    }

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
      setResult(text.fillRequired);
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
          <p style={eyebrowStyle}>{text.heroEyebrow}</p>
          <h1 style={titleStyle}>{text.heroTitle}</h1>
          <p style={subtitleStyle}>{text.heroSubtitle}</p>

          <div style={pillRowStyle}>
            <span style={pillStyle}>
              {text.language}: {preferences.language.toUpperCase()}
            </span>
            <span style={pillStyle}>
              {text.currency}: {preferences.currency}
            </span>
            <span style={pillStyle}>
              {text.taxRegion}: {countryLabel} / {subdivisionLabel}
            </span>
          </div>

          <div style={buttonRowStyle}>
            <a href={localizedLinks.compare} style={secondaryLinkStyle}>
              {text.compareCars}
            </a>
            <a href={localizedLinks.paymentGuides} style={secondaryLinkStyle}>
              {text.paymentGuides}
            </a>
            <a href={localizedLinks.incomeNeeded} style={secondaryLinkStyle}>
              {text.incomeNeeded}
            </a>
            <a href={localizedLinks.dealReview} style={primaryLinkStyle}>
              {text.dealReview}
            </a>
          </div>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={sectionHeaderStyle}>
          <h2 style={sectionTitleStyle}>{text.calculatorTitle}</h2>
          <p style={sectionSubtitleStyle}>
            {text.calculatorSubtitle} <strong>{subdivisionLabel}</strong> in{" "}
            <strong>{countryLabel}</strong>,{" "}
            <strong>{(taxRate * 100).toFixed(3).replace(/\.?0+$/, "")}%</strong>.
          </p>
        </div>

        <div style={gridStyle}>
          <div>
            <label style={labelStyle}>{text.vehicleName}</label>
            <input
              type="text"
              value={carName}
              onChange={(e) => setCarName(e.target.value)}
              placeholder="Mazda CX-5"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>{text.incomeAmount}</label>
            <input
              type="number"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              placeholder="70000"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>{text.incomeFrequency}</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              style={inputStyle}
            >
              <option value="yearly">{text.yearly}</option>
              <option value="monthly">{text.monthly}</option>
              <option value="biweekly">{text.biweekly}</option>
              <option value="weekly">{text.weekly}</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>{text.monthlyExpenses}</label>
            <input
              type="number"
              value={expenses}
              onChange={(e) => setExpenses(e.target.value)}
              placeholder="1800"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>{text.vehiclePrice}</label>
            <input
              type="number"
              value={carPrice}
              onChange={(e) => setCarPrice(e.target.value)}
              placeholder="30000"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>{text.downPayment}</label>
            <input
              type="number"
              value={downPayment}
              onChange={(e) => setDownPayment(e.target.value)}
              placeholder="5000"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>{text.interestRate}</label>
            <input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              placeholder="6.9"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>{text.loanTerm}</label>
            <input
              type="number"
              value={loanTerm}
              onChange={(e) => setLoanTerm(e.target.value)}
              placeholder="5"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>{text.monthlyInsurance}</label>
            <input
              type="number"
              value={insurance}
              onChange={(e) => setInsurance(e.target.value)}
              placeholder="180"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>{text.monthlyGas}</label>
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
          {text.calculate}
        </button>
      </section>

      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>{text.results}</h2>

        {!result && <p style={mutedTextStyle}>{text.emptyResults}</p>}

        {typeof result === "string" && <div style={errorStyle}>{result}</div>}

        {result && typeof result === "object" && (
          <div>
            <div style={resultTopStyle}>
              <div>
                <div style={smallLabelStyle}>{text.affordabilityScore}</div>
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
                <div style={smallLabelStyle}>{text.vehicle}</div>
                <div style={statValueStyle}>{result.carName || "Unnamed vehicle"}</div>
              </div>

              <div style={statStyle}>
                <div style={smallLabelStyle}>{text.taxRegion}</div>
                <div style={statValueStyle}>
                  {result.countryLabel} / {result.subdivisionLabel}
                </div>
              </div>

              <div style={statStyle}>
                <div style={smallLabelStyle}>{text.priceBeforeTax}</div>
                <div style={statValueStyle}>{formatCurrency(result.basePrice)}</div>
              </div>

              <div style={statStyle}>
                <div style={smallLabelStyle}>{text.salesTaxAmount}</div>
                <div style={statValueStyle}>{formatCurrency(result.totalTaxAmount)}</div>
              </div>

              <div style={statStyle}>
                <div style={smallLabelStyle}>{text.priceAfterTax}</div>
                <div style={statValueStyle}>{formatCurrency(result.taxedPrice)}</div>
              </div>

              <div style={statStyle}>
                <div style={smallLabelStyle}>{text.monthlyIncome}</div>
                <div style={statValueStyle}>{formatCurrency(result.monthlyIncome)}</div>
              </div>

              <div style={statStyle}>
                <div style={smallLabelStyle}>{text.monthlyPayment}</div>
                <div style={statValueStyle}>{formatCurrency(result.monthlyPayment)}</div>
              </div>

              <div style={statStyle}>
                <div style={smallLabelStyle}>{text.trueMonthlyCost}</div>
                <div style={statValueStyle}>
                  {formatCurrency(result.totalMonthlyCarCost)}
                </div>
              </div>

              <div style={statStyle}>
                <div style={smallLabelStyle}>{text.costPercent}</div>
                <div style={statValueStyle}>
                  {result.carCostPercent.toFixed(1)}%
                </div>
              </div>

              <div style={statStyle}>
                <div style={smallLabelStyle}>{text.moneyLeft}</div>
                <div style={statValueStyle}>{formatCurrency(result.moneyLeft)}</div>
              </div>

              <div style={statStyle}>
                <div style={smallLabelStyle}>{text.maintenanceBuffer}</div>
                <div style={statValueStyle}>
                  {formatCurrency(result.maintenanceBuffer)}
                </div>
              </div>

              <div style={statStyle}>
                <div style={smallLabelStyle}>{text.appliedTaxRate}</div>
                <div style={statValueStyle}>
                  {(result.taxRate * 100).toFixed(3).replace(/\.?0+$/, "")}%
                </div>
              </div>
            </div>

            <div style={recommendationWrapStyle}>
              <h3 style={recommendationTitleStyle}>{text.recommendedRanges}</h3>

              <div style={rangeGridStyle}>
                <div style={{ ...rangeCardStyle, borderColor: "#bbf7d0" }}>
                  <div style={{ ...rangeLabelStyle, color: "#15803d" }}>{text.safe}</div>
                  <div style={rangeValueStyle}>
                    {formatCurrency(result.safeCarPrice)}
                  </div>
                  <div style={rangeNoteStyle}>{text.beforeTaxNote}</div>
                </div>

                <div style={{ ...rangeCardStyle, borderColor: "#fde68a" }}>
                  <div style={{ ...rangeLabelStyle, color: "#b45309" }}>{text.stretch}</div>
                  <div style={rangeValueStyle}>
                    {formatCurrency(result.stretchCarPrice)}
                  </div>
                  <div style={rangeNoteStyle}>{text.beforeTaxNote}</div>
                </div>

                <div style={{ ...rangeCardStyle, borderColor: "#fecaca" }}>
                  <div style={{ ...rangeLabelStyle, color: "#b91c1c" }}>{text.risky}</div>
                  <div style={rangeValueStyle}>
                    {formatCurrency(result.riskyCarPrice)}
                  </div>
                  <div style={rangeNoteStyle}>{text.beforeTaxNote}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>{text.popularPages}</h2>

        <div style={gridStyle}>
          <a href={localizedLinks.salaryPage} style={linkCardStyle}>
            What car can I afford with a 70000 salary
          </a>
          <a href={localizedLinks.affordabilityPage} style={linkCardStyle}>
            Can I afford a 30000 car
          </a>
          <a href={localizedLinks.paymentGuides} style={linkCardStyle}>
            Monthly payment on a 30000 car
          </a>
          <a href={localizedLinks.incomeNeeded} style={linkCardStyle}>
            Income needed for a 30000 car
          </a>
          <a href={localizedLinks.frenchAffordability} style={linkCardStyle}>
            {text.frenchPage}
          </a>
          <a href={localizedLinks.spanishAffordability} style={linkCardStyle}>
            {text.spanishPage}
          </a>
        </div>
      </section>

      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>{text.debugTitle}</h2>
        <div style={statsGridStyle}>
          <div style={statStyle}>
            <div style={smallLabelStyle}>{text.language}</div>
            <div style={statValueStyle}>{preferences.language}</div>
          </div>
          <div style={statStyle}>
            <div style={smallLabelStyle}>{text.country}</div>
            <div style={statValueStyle}>{countryLabel}</div>
          </div>
          <div style={statStyle}>
            <div style={smallLabelStyle}>{text.provinceState}</div>
            <div style={statValueStyle}>{subdivisionLabel}</div>
          </div>
          <div style={statStyle}>
            <div style={smallLabelStyle}>{text.subdivisionKey}</div>
            <div style={statValueStyle}>{safeSubdivisionKey}</div>
          </div>
          <div style={statStyle}>
            <div style={smallLabelStyle}>{text.currency}</div>
            <div style={statValueStyle}>{preferences.currency}</div>
          </div>
          <div style={statStyle}>
            <div style={smallLabelStyle}>{text.taxRateLabel}</div>
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