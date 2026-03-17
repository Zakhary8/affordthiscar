"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const PreferencesContext = createContext();

const locationData = {
  canada: {
    label: "Canada",
    defaultCurrency: "CAD",
    subdivisions: {
      alberta: { label: "Alberta", taxRate: 0.05 },
      british_columbia: { label: "British Columbia", taxRate: 0.12 },
      manitoba: { label: "Manitoba", taxRate: 0.12 },
      new_brunswick: { label: "New Brunswick", taxRate: 0.15 },
      newfoundland_and_labrador: {
        label: "Newfoundland and Labrador",
        taxRate: 0.15,
      },
      northwest_territories: { label: "Northwest Territories", taxRate: 0.05 },
      nova_scotia: { label: "Nova Scotia", taxRate: 0.14 },
      nunavut: { label: "Nunavut", taxRate: 0.05 },
      ontario: { label: "Ontario", taxRate: 0.13 },
      prince_edward_island: { label: "Prince Edward Island", taxRate: 0.15 },
      quebec: { label: "Quebec", taxRate: 0.14975 },
      saskatchewan: { label: "Saskatchewan", taxRate: 0.11 },
      yukon: { label: "Yukon", taxRate: 0.05 },
    },
  },

  usa: {
    label: "United States",
    defaultCurrency: "USD",
    subdivisions: {
      alabama: { label: "Alabama", taxRate: 0.04 },
      alaska: { label: "Alaska", taxRate: 0.0 },
      arizona: { label: "Arizona", taxRate: 0.056 },
      arkansas: { label: "Arkansas", taxRate: 0.065 },
      california: { label: "California", taxRate: 0.0725 },
      colorado: { label: "Colorado", taxRate: 0.029 },
      connecticut: { label: "Connecticut", taxRate: 0.0635 },
      delaware: { label: "Delaware", taxRate: 0.0 },
      florida: { label: "Florida", taxRate: 0.06 },
      georgia: { label: "Georgia", taxRate: 0.04 },
      hawaii: { label: "Hawaii", taxRate: 0.04 },
      idaho: { label: "Idaho", taxRate: 0.06 },
      illinois: { label: "Illinois", taxRate: 0.0625 },
      indiana: { label: "Indiana", taxRate: 0.07 },
      iowa: { label: "Iowa", taxRate: 0.06 },
      kansas: { label: "Kansas", taxRate: 0.065 },
      kentucky: { label: "Kentucky", taxRate: 0.06 },
      louisiana: { label: "Louisiana", taxRate: 0.05 },
      maine: { label: "Maine", taxRate: 0.055 },
      maryland: { label: "Maryland", taxRate: 0.06 },
      massachusetts: { label: "Massachusetts", taxRate: 0.0625 },
      michigan: { label: "Michigan", taxRate: 0.06 },
      minnesota: { label: "Minnesota", taxRate: 0.06875 },
      mississippi: { label: "Mississippi", taxRate: 0.07 },
      missouri: { label: "Missouri", taxRate: 0.04225 },
      montana: { label: "Montana", taxRate: 0.0 },
      nebraska: { label: "Nebraska", taxRate: 0.055 },
      nevada: { label: "Nevada", taxRate: 0.0685 },
      new_hampshire: { label: "New Hampshire", taxRate: 0.0 },
      new_jersey: { label: "New Jersey", taxRate: 0.06625 },
      new_mexico: { label: "New Mexico", taxRate: 0.04875 },
      new_york: { label: "New York", taxRate: 0.04 },
      north_carolina: { label: "North Carolina", taxRate: 0.0475 },
      north_dakota: { label: "North Dakota", taxRate: 0.05 },
      ohio: { label: "Ohio", taxRate: 0.0575 },
      oklahoma: { label: "Oklahoma", taxRate: 0.045 },
      oregon: { label: "Oregon", taxRate: 0.0 },
      pennsylvania: { label: "Pennsylvania", taxRate: 0.06 },
      rhode_island: { label: "Rhode Island", taxRate: 0.07 },
      south_carolina: { label: "South Carolina", taxRate: 0.06 },
      south_dakota: { label: "South Dakota", taxRate: 0.042 },
      tennessee: { label: "Tennessee", taxRate: 0.07 },
      texas: { label: "Texas", taxRate: 0.0625 },
      utah: { label: "Utah", taxRate: 0.061 },
      vermont: { label: "Vermont", taxRate: 0.06 },
      virginia: { label: "Virginia", taxRate: 0.053 },
      washington: { label: "Washington", taxRate: 0.065 },
      west_virginia: { label: "West Virginia", taxRate: 0.06 },
      wisconsin: { label: "Wisconsin", taxRate: 0.05 },
      wyoming: { label: "Wyoming", taxRate: 0.04 },
      district_of_columbia: {
        label: "District of Columbia",
        taxRate: 0.06,
      },
    },
  },

  europe: {
    label: "Europe",
    defaultCurrency: "EUR",
    subdivisions: {
      france: { label: "France", taxRate: 0.2 },
      germany: { label: "Germany", taxRate: 0.19 },
      spain: { label: "Spain", taxRate: 0.21 },
      italy: { label: "Italy", taxRate: 0.22 },
    },
  },

  mexico: {
    label: "Mexico",
    defaultCurrency: "MXN",
    subdivisions: {
      cdmx: { label: "Mexico City", taxRate: 0.16 },
      jalisco: { label: "Jalisco", taxRate: 0.16 },
      nuevo_leon: { label: "Nuevo Leon", taxRate: 0.16 },
    },
  },
};

const defaultPreferences = {
  language: "en",
  country: "canada",
  subdivision: "quebec",
  currency: "CAD",
};

export function PreferencesProvider({ children }) {
  const [preferences, setPreferences] = useState(defaultPreferences);

  useEffect(() => {
    const saved = localStorage.getItem("atc_preferences");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPreferences({ ...defaultPreferences, ...parsed });
      } catch (error) {
        console.error("Failed to parse saved preferences:", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("atc_preferences", JSON.stringify(preferences));
  }, [preferences]);

  const computed = useMemo(() => {
    const countryData = locationData[preferences.country] || locationData.canada;
    const subdivisionKeys = Object.keys(countryData.subdivisions);
    const safeSubdivisionKey = countryData.subdivisions[preferences.subdivision]
      ? preferences.subdivision
      : subdivisionKeys[0];

    const subdivisionData = countryData.subdivisions[safeSubdivisionKey];

    return {
      countryLabel: countryData.label,
      subdivisionLabel: subdivisionData.label,
      taxRate: subdivisionData.taxRate,
      defaultCurrency: countryData.defaultCurrency,
      availableCountries: locationData,
      subdivisionOptions: countryData.subdivisions,
      safeSubdivisionKey,
    };
  }, [preferences.country, preferences.subdivision]);

  function updateLanguage(language) {
    setPreferences((prev) => ({
      ...prev,
      language,
    }));
  }

  function updateCountry(country) {
    const countryData = locationData[country] || locationData.canada;
    const firstSubdivisionKey = Object.keys(countryData.subdivisions)[0];

    setPreferences((prev) => ({
      ...prev,
      country,
      subdivision: firstSubdivisionKey,
      currency: countryData.defaultCurrency,
    }));
  }

  function updateSubdivision(subdivision) {
    setPreferences((prev) => ({
      ...prev,
      subdivision,
    }));
  }

  function updateCurrency(currency) {
    setPreferences((prev) => ({
      ...prev,
      currency,
    }));
  }

  return (
    <PreferencesContext.Provider
      value={{
        preferences,
        setPreferences,
        updateLanguage,
        updateCountry,
        updateSubdivision,
        updateCurrency,
        locationData,
        ...computed,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  return useContext(PreferencesContext);
}