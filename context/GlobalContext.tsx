import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import * as Location from "expo-location"; // Import Expo Location API
import { sbstations, nbstations } from "@/constants/Stations";

// Define the shape of the global state
interface GlobalState {
  destinationIndex: number;
  setDestinationIndex: (index: number) => void;
  direction: string;
  setDirection: (dir: string) => void;
  nextStation: number;
  setNextStation: (index: number) => void;
  longitude: number;
  latitude: number;
  errorMsg: string | null;
  currentStation: number | null;
  setCurrentStation: (index: number | null) => void;
  currentNearStation: number | null;
  setCurrentNearStation: (index: number | null) => void;
  vibrate: boolean;
  setVibrate: (value: boolean) => void;
  ring: boolean;
  setRing: (value: boolean) => void;
  stationBefore: number;
  setStationBefore: (index: number) => void;
}

const GlobalContext = createContext<GlobalState | undefined>(undefined);

// Haversine formula to calculate distance between two coordinates
const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371; // Earth's radius in km

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in kilometers
};

const findNearestStation = (latitude: number, longitude: number, stations: { lat: number; lon: number }[]) => {
  if (stations.length === 0) return null;

  let nearestIndex = 0;
  let minDistance = haversineDistance(latitude, longitude, stations[0].lat, stations[0].lon);

  stations.forEach((station, index) => {
    const distance = haversineDistance(latitude, longitude, station.lat, station.lon);
    if (distance < minDistance) {
      minDistance = distance;
      nearestIndex = index;
    }
  });

  return minDistance <= 0.1 ? nearestIndex : null; // Return index if within 0.1 km, else null
};

export const GlobalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [destinationIndex, setDestinationIndex] = useState<number>(-1);
  const [direction, setDirection] = useState<string>("Southbound");
  const [nextStation, setNextStation] = useState<number>(-1);
  const [longitude, setLongitude] = useState<number>(0);
  const [latitude, setLatitude] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [currentStation, setCurrentStation] = useState<number | null>(null);
  const [currentNearStation, setCurrentNearStation] = useState<number | null>(null);
  const [vibrate, setVibrate] = useState<boolean>(true);
  const [ring, setRing] = useState<boolean>(true);
  const [stationBefore, setStationBefore] = useState<number>(1);

  const stations = direction === "Southbound" ? sbstations : nbstations;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    

    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLatitude(loc.coords.latitude);
      setLongitude(loc.coords.longitude);
      setErrorMsg(null);
    }

    getCurrentLocation();
    interval = setInterval(getCurrentLocation, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        destinationIndex,
        setDestinationIndex,
        direction,
        setDirection,
        nextStation,
        setNextStation,
        longitude,
        latitude,
        errorMsg,
        currentStation,
        setCurrentStation,
        currentNearStation,
        setCurrentNearStation,
        vibrate,
        setVibrate,
        ring,
        setRing,
        stationBefore,
        setStationBefore
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

// Custom hook for consuming global context
export const useGlobalState = (): GlobalState => {
  const context = useContext(GlobalContext);
  if (!context) throw new Error("useGlobalState must be used within a GlobalProvider");
  return context;
};
