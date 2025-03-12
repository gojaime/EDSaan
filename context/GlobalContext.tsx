import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import * as Location from "expo-location"; // Import Expo Location API

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
  sbstations: { name: string; lat: number; lon: number }[];
  nbstations: { name: string; lat: number; lon: number }[];
  currentStation: number | null; // ✅ Added this
  setCurrentStation: (index: number | null) => void; // ✅ Added setter
  currentNearStation: number | null; // ✅ Added this
  setCurrentNearStation: (index: number | null) => void; // ✅ Added setter
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

  // Define stations (unchanged)
  const sbstations = [
    { name: 'Blumentritt', lat: 14.622729182722175, lon: 120.98285569880103 },
    { name: 'Tayuman', lat: 14.616824988491773, lon: 120.98277949972521 },
    { name: 'Bambang', lat: 14.611344590078984, lon: 120.98248220070431 },
    { name: 'Doroteo Jose', lat: 14.60540182254872, lon: 120.98204152713323 },
    { name: 'Carriedo', lat: 14.599110558358499, lon: 120.98133498889699 }

    // { name: 'Monumento', lat: 14.163656307700219, lon: 121.24062337975099 },
    // { name: 'Bagong Barrio', lat: 14.161938421541077, lon: 121.24077583762917 },
    // { name: 'Balintawak', lat: 14.160669994994189, lon: 121.24139691650102 },
    // { name: 'Kaingin Road', lat: 14.159020309905998, lon: 121.2421926452658 },
    // { name: 'LRT 1- Roosevelt Station', lat: 14.15764243375867, lon: 121.24477550435215 },
    // { name: 'MRT 3 North Avenue', lat: 100, lon: 400 },
    // { name: 'MRT 3 Quezon Avenue', lat: 100, lon: 400 },
    // { name: 'Nepa Q-Mart', lat: 100, lon: 400 },
    // { name: 'Main Ave (Cubao)', lat: 100, lon: 400 },
    // { name: 'MRT 3 Santolan Station', lat: 100, lon: 400 },
    // { name: 'MRT 3 Ortigas Station', lat: 100, lon: 400 },
    // { name: 'Guadalupe Bridge', lat: 100, lon: 400 },
    // { name: 'MRT 3 Buendia Station', lat: 100, lon: 400 },
    // { name: 'MRT 3 Ayala Station (curbside)', lat: 100, lon: 400 },
    // { name: 'Taft Avenue', lat: 100, lon: 400 },
    // { name: 'Roxas Boulevard', lat: 100, lon: 400 },
    // { name: 'SM Mall of Asia (curbside)', lat: 100, lon: 400 },
    // { name: 'Macapagal - DFA (curbside)', lat: 100, lon: 400 },
    // { name: 'Macapagal - City of Dreams (curbside)', lat: 100, lon: 400 },
    // { name: 'PITX', lat: 100, lon: 400 },
  ];
  
  const nbstations = [
    // { name: 'PITX', lat: 100, lon: 200 },
    // { name: 'Macapagal - City of Dreams (curbside)', lat: 100, lon: 300 },
    // { name: 'Macapagal - DFA (curbside)', lat: 100, lon: 400 },
    // { name: 'Roxas Boulevard', lat: 100, lon: 400 },
    // { name: 'Taft Avenue', lat: 100, lon: 400 },
    // { name: 'MRT 3 Ayala Station (curbside)', lat: 100, lon: 400 },
    // { name: 'MRT 3 Buendia Station', lat: 100, lon: 400 },
    // { name: 'Guadalupe Bridge', lat: 100, lon: 400 },
    // { name: 'MRT 3 Ortigas Station', lat: 100, lon: 400 },
    // { name: 'MRT 3 Santolan Station', lat: 100, lon: 400 },
    // { name: 'Main Ave (Cubao)', lat: 100, lon: 400 },
    // { name: 'Nepa Q-Mart', lat: 100, lon: 400 },
    // { name: 'MRT 3 Quezon Avenue Station', lat: 100, lon: 400 },
    // { name: 'MRT 3 North Avenue', lat: 100, lon: 400 },
    // { name: 'LRT-1 Roosevelt Station', lat: 14.15764243375867, lon: 121.24477550435215 },
    // { name: 'Kaingin Road', lat: 14.159020309905998, lon: 121.2421926452658 },
    // { name: 'Balintawak', lat: 14.160669994994189, lon: 121.24139691650102 },
    // { name: 'Bagong Barrio', lat: 14.161938421541077, lon: 121.24077583762917 },
    // { name: 'Monumento', lat: 14.163656307700219, lon: 121.24062337975099 }
    { name: 'Carriedo', lat: 14.599110558358499, lon: 120.98133498889699 },
    { name: 'Doroteo Jose', lat: 14.60540182254872, lon: 120.98204152713323 },
    { name: 'Bambang', lat: 14.611344590078984, lon: 120.98248220070431 },
    { name: 'Tayuman', lat: 14.616824988491773, lon: 120.98277949972521 },
    { name: 'Blumentritt', lat: 14.622729182722175, lon: 120.98285569880103 },


  ];

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
        sbstations,
        nbstations,
        currentStation, // ✅ Added this
        setCurrentStation, // ✅ Added setter
        currentNearStation, // ✅ Added this
        setCurrentNearStation, // ✅ Added setter
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
