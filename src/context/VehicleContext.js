"use client";

import { createContext, useContext, useState } from "react";

const VehicleContext = createContext();

const emptyVehicle = {
  name: "",
  price: "",
  interestRate: "",
  term: "",
  downPayment: "",
  insurance: "",
  monthlyInsurance: "",
  gas: "",
  monthlyGas: "",
};

export function VehicleProvider({ children }) {
  const [vehicle, setVehicle] = useState(emptyVehicle);

  function updateVehicle(key, value) {
    setVehicle((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function setFullVehicle(newVehicle) {
    setVehicle({
      ...emptyVehicle,
      ...(newVehicle || {}),
    });
  }

  function clearVehicle() {
    setVehicle(emptyVehicle);
  }

  return (
    <VehicleContext.Provider
      value={{
        vehicle,
        updateVehicle,
        setFullVehicle,
        clearVehicle,
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
}

export function useVehicle() {
  return useContext(VehicleContext);
}