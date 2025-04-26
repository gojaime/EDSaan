import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import * as Location from "expo-location"; // Import Expo Location API

import { sbstations } from '@/constants/Stations';
import { nbstations } from '@/constants/Stations';

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
  currentStation: number | null; // ✅ Added this
  setCurrentStation: (index: number | null) => void; // ✅ Added setter
  currentNearStation: number | null; // ✅ Added this
  setCurrentNearStation: (index: number | null) => void; // ✅ Added setter,
  vibrate: boolean;
  setVibrate: (value: boolean) => void;
  ring: boolean;
  setRing: (value: boolean) => void;
}

const GlobalContext = createContext<GlobalState | undefined>(undefined);

const findNearestStation = (latitude: number, longitude: number, stations: { lat: number; lon: number }[]) => {
  if (stations.length === 0) return null; // Return null if no stations exist

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

export const GlobalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [destinationIndex, setDestinationIndex] = useState<number>(-1);
  const [direction, setDirection] = useState<string>("Southbound");
  const [nextStation, setNextStation] = useState<number>(-1);
  const [longitude, setLongitude] = useState<number>(0);
  const [latitude, setLatitude] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [hasSetNextStation, setHasSetNextStation] = useState<boolean>(false);
  const [currentStation, setCurrentStation] = useState<number | null>(null); // ✅ Added this
  const [currentNearStation, setCurrentNearStation] = useState<number | null>(null); // ✅ Added this
  const [vibrate, setVibrate] = useState<boolean>(true); // default true or false as needed
  const [ring, setRing] = useState<boolean>(true);   


  // Select the station list based on direction
  const stations = direction === "Southbound" ? sbstations : nbstations;

  // Effect to fetch and update location
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
        currentStation, // ✅ Added this
        setCurrentStation, // ✅ Added setter
        currentNearStation, // ✅ Added this
        setCurrentNearStation, // ✅ Added setter,
        vibrate,
        setVibrate,
        ring,
        setRing
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
