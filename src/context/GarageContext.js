"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const GarageContext = createContext();

export function GarageProvider({ children }) {
  const [vehicles, setVehicles] = useState([]);
  const [activeVehicleId, setActiveVehicleId] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("garage_data");

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setVehicles(Array.isArray(parsed.vehicles) ? parsed.vehicles : []);
        setActiveVehicleId(parsed.activeVehicleId || null);
      } catch (error) {
        console.error("Failed to load garage data:", error);
      }
    }

    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    localStorage.setItem(
      "garage_data",
      JSON.stringify({
        vehicles,
        activeVehicleId,
      })
    );
  }, [vehicles, activeVehicleId, hydrated]);

  function normalizeVehicle(vehicle = {}) {
    return {
      id: vehicle.id || Date.now().toString() + Math.random().toString(36).slice(2, 7),
      name: vehicle.name || "",
      price: vehicle.price || "",
      interestRate: vehicle.interestRate || "",
      term: vehicle.term || "",
      downPayment: vehicle.downPayment || "",
      insurance: vehicle.insurance || "",
      gas: vehicle.gas || "",
    };
  }

  function saveVehicle(vehicle) {
    if (!vehicle?.price && !vehicle?.name) return;

    const normalized = normalizeVehicle(vehicle);

    const duplicate = vehicles.find(
      (v) =>
        String(v.name || "").trim().toLowerCase() ===
          String(normalized.name || "").trim().toLowerCase() &&
        String(v.price || "").trim() === String(normalized.price || "").trim()
    );

    if (duplicate) {
      setActiveVehicleId(duplicate.id);
      return;
    }

    setVehicles((prev) => [normalized, ...prev]);
    setActiveVehicleId(normalized.id);
  }

  function setActiveVehicle(id) {
    setActiveVehicleId(id);
  }

  function deleteVehicle(id) {
    setVehicles((prev) => {
      const updated = prev.filter((v) => v.id !== id);

      if (activeVehicleId === id) {
        setActiveVehicleId(updated[0]?.id || null);
      }

      return updated;
    });
  }

  function clearGarage() {
    setVehicles([]);
    setActiveVehicleId(null);
  }

  const activeVehicle = useMemo(() => {
    return vehicles.find((v) => v.id === activeVehicleId) || null;
  }, [vehicles, activeVehicleId]);

  return (
    <GarageContext.Provider
      value={{
        hydrated,
        vehicles,
        activeVehicle,
        activeVehicleId,
        saveVehicle,
        setActiveVehicle,
        deleteVehicle,
        clearGarage,
      }}
    >
      {children}
    </GarageContext.Provider>
  );
}

export function useGarage() {
  return useContext(GarageContext);
}