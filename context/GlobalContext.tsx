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
    // { name: 'Blumentritt', lat: 14.622729182722175, lon: 120.98285569880103 },
    // { name: 'Tayuman', lat: 14.616824988491773, lon: 120.98277949972521 },
    // { name: 'Bambang', lat: 14.611344590078984, lon: 120.98248220070431 },
    // { name: 'Doroteo Jose', lat: 14.60540182254872, lon: 120.98204152713323 },
    // { name: 'Carriedo', lat: 14.599110558358499, lon: 120.98133498889699 }

    { name: 'Monumento', lat: 14.657219029117009, lon: 120.98624038939495 },
    { name: 'Bagong Barrio', lat: 14.657485937483145, lon: 120.99806064378366 },
    { name: 'Balintawak', lat: 14.65755519840395, lon: 121.00479165527882 },
    { name: 'Kaingin Road', lat: 14.657721472300674, lon: 121.01152980733613 },
    { name: 'LRT 1- Roosevelt Station', lat: 14.65778465621674, lon: 121.0196870764625 },
    { name: 'MRT 3 North Avenue', lat: 14.651448496391131, lon: 121.03285691836994 },
    { name: 'MRT 3 Quezon Avenue', lat: 14.641667514884944, lon: 121.03926668810226 },
    { name: 'Nepa Q-Mart', lat: 14.629176468642413, lon: 121.04670279166625 },
    { name: 'Main Ave (Cubao)', lat: 14.614308409451436, lon: 121.05352753530148 },
    { name: 'MRT 3 Santolan Station', lat: 14.60930543443652, lon: 121.05582512841691 },
    { name: 'MRT 3 Ortigas Station', lat: 14.587185735799936, lon: 121.05637772583611 },
    { name: 'Guadalupe Bridge', lat: 14.568242797479215, lon: 121.04588947554471 },
    { name: 'MRT 3 Buendia Station', lat: 14.55523904597124, lon: 121.03484401950507 },
    { name: 'MRT 3 Ayala Station (curbside)', lat: 14.548725551548406, lon: 121.02717510650163 },
    { name: 'Tramo', lat: 14.537919674492098, lon: 121.00339234219761 },
    { name: 'Taft Avenue', lat: 14.537643850518256, lon: 120.99965756701496 },
    { name: 'Roxas Boulevard', lat: 14.537115199032753, lon: 120.99219828125118 },
    { name: 'SM Mall of Asia (curbside)', lat: 14.535488641704239, lon: 120.98335223324048 },
    { name: 'Macapagal - DFA (curbside)', lat: 14.529755974112643, lon: 120.98969071861411 },
    { name: 'Macapagal - City of Dreams (curbside)', lat: 14.523843181672278, lon: 120.9903610225918 },
    { name: 'PITX', lat: 14.5101848399529, lon: 120.99124717358177 },
  ];
  
  const nbstations = [
    { name: 'PITX', lat: 14.5101848399529, lon: 120.99124717358177 },
    { name: 'Macapagal - City of Dreams (curbside)', lat: 14.523843181735627, lon: 120.99056487037772 },
    { name: 'Macapagal - DFA (curbside)', lat: 100, lon: 400 },
    { name: 'Roxas Boulevard', lat: 14.537115199032753, lon: 120.99219828125118 },
    { name: 'Taft Avenue', lat: 14.537643850518256, lon: 120.99965756701496 },
    { name: 'MRT 3 Ayala Station (curbside)', lat: 14.549874376781167, lon: 121.02842938817616 },
    { name: 'MRT 3 Buendia Station', lat: 14.55523904597124, lon: 121.03484401950507 },
    { name: 'Guadalupe Bridge', lat: 14.568242797479215, lon: 121.04588947554471 },
    { name: 'MRT 3 Ortigas Station', lat: 14.587185735799936, lon: 121.05637772583611 },
    { name: 'MRT 3 Santolan Station', lat: 14.60930543443652, lon: 121.05582512841691 },
    { name: 'Main Ave (Cubao)', lat: 14.614308409451436, lon: 121.05352753530148 },
    { name: 'Nepa Q-Mart', lat: 14.629176468642413, lon: 121.04670279166625 },
    { name: 'MRT 3 Quezon Avenue Station', lat: 14.641667514884944, lon: 121.03926668810226 },
    { name: 'MRT 3 North Avenue', lat: 14.651448496391131, lon: 121.03285691836994 },
    { name: 'LRT-1 Roosevelt Station', lat: 14.65778465621674, lon: 121.0196870764625 },
    { name: 'Kaingin Road', lat: 14.657721472300674, lon: 121.01152980733613 },
    { name: 'Balintawak', lat: 14.65755519840395, lon: 121.00479165527882 },
    { name: 'Bagong Barrio', lat: 14.657485937483145, lon: 120.99806064378366 },
    { name: 'Monumento', lat: 14.657219029117009, lon: 120.98624038939495 }

    // { name: 'Carriedo', lat: 14.599110558358499, lon: 120.98133498889699 },
    // { name: 'Doroteo Jose', lat: 14.60540182254872, lon: 120.98204152713323 },
    // { name: 'Bambang', lat: 14.611344590078984, lon: 120.98248220070431 },
    // { name: 'Tayuman', lat: 14.616824988491773, lon: 120.98277949972521 },
    // { name: 'Blumentritt', lat: 14.622729182722175, lon: 120.98285569880103 },


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
