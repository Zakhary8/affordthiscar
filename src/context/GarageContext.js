"use client";

import { createContext, useContext, useEffect, useState } from "react";

const GarageContext = createContext();

export function GarageProvider({ children }) {
  const [vehicles, setVehicles] = useState([]);
  const [activeVehicleId, setActiveVehicleId] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("garage_data");

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setVehicles(parsed.vehicles || []);
        setActiveVehicleId(parsed.activeVehicleId || null);
      } catch (error) {
        console.error("Failed to load garage data:", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "garage_data",
      JSON.stringify({
        vehicles,
        activeVehicleId,
      })
    );
  }, [vehicles, activeVehicleId]);

  function saveVehicle(vehicle) {
    if (!vehicle?.price && !vehicle?.name) return;

    const newVehicle = {
      id: Date.now().toString(),
      ...vehicle,
    };

    setVehicles((prev) => [newVehicle, ...prev]);
    setActiveVehicleId(newVehicle.id);
  }

  function setActiveVehicle(id) {
    setActiveVehicleId(id);
  }

  function deleteVehicle(id) {
    setVehicles((prev) => prev.filter((v) => v.id !== id));

    if (activeVehicleId === id) {
      setActiveVehicleId(null);
    }
  }

  const activeVehicle = vehicles.find((v) => v.id === activeVehicleId) || null;

  return (
    <GarageContext.Provider
      value={{
        vehicles,
        activeVehicle,
        saveVehicle,
        setActiveVehicle,
        deleteVehicle,
      }}
    >
      {children}
    </GarageContext.Provider>
  );
}

export function useGarage() {
  return useContext(GarageContext);
}