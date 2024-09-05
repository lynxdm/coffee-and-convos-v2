"use client";
import React, { useContext } from "react";

const AppContext = React.createContext("no value");
const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return <AppContext.Provider value='hello'>{children}</AppContext.Provider>;
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};

export default AppProvider;
