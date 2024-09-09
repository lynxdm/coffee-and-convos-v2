"use client";
import React, { useContext, useState, useEffect } from "react";
import { auth } from "@/app/_firebase/config";
import { onAuthStateChanged } from "firebase/auth";

interface AppContextType {
  admin: {};
  isAdmin: boolean;
  user: {};
  theme: string;
  setTheme: (theme: string) => void;
}

const AppContext = React.createContext<AppContextType | undefined>(undefined);
const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState({
    displayName: "guest user",
    email: "",
    photoURL: "",
    userId: "",
  });

  const [theme, setTheme] = useState(localStorage?.getItem("theme") || "light");

  const admin = { displayName: "Ajayi Ayobami", email: "lynxdm32@gmail.com" };
  const [isAdmin, setIsAdmin] = useState(false);

  const checkUser = () => {
    if (user.email === admin.email) {
      setIsAdmin(true);
    }
  };

  useEffect(() => {
    localStorage.setItem("theme", theme);
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("user logged in", user);
        const { displayName, email, photoURL, uid } = user;
        setUser({
          displayName: displayName ?? "Guest User",
          email: email ?? "",
          photoURL: photoURL ?? "",
          userId: uid,
        });
      } else {
        setUser({
          displayName: "Guest User",
          email: "",
          photoURL: "",
          userId: "",
        });
        console.log("no user logged in");
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (user.email !== "") {
      checkUser();
    }
  }, [user]);

  return (
    <AppContext.Provider value={{ admin, isAdmin, user, theme, setTheme }}>
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};

export default AppProvider;
