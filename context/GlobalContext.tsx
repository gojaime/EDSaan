import React, { createContext, useContext, useState, ReactNode } from "react";

interface GlobalState {
  destinationIndex: number;
  setDestinationIndex: (index: number) => void;
  direction: string;
  setDirection: (dir: string) => void;
}

const GlobalContext = createContext<GlobalState | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [destinationIndex, setDestinationIndex] = useState<number>(-1);
  const [direction, setDirection] = useState<string>("Southbound");

  return (
    <GlobalContext.Provider value={{ destinationIndex, setDestinationIndex, direction, setDirection }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalState = (): GlobalState => {
  const context = useContext(GlobalContext);
  if (!context) throw new Error("useGlobalState must be used within a GlobalProvider");
  return context;
};
