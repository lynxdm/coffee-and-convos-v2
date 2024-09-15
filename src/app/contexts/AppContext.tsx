"use client";
import React, { useContext, useState, useEffect } from "react";
import { auth } from "@/app/_firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { admin } from "@/app/_firebase/config";
import { updateNotifications } from "../_firebase/notifications";

interface AppContextType {
  admin: { displayName: string; email: string };
  isAdmin: boolean;
  user: {
    email: string;
    photoURL: string;
    displayName: string;
    userId: string;
  };
  theme: string;
  setTheme: (theme: string) => void;
  userNotifications: [];
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

  useEffect(() => {
    localStorage.setItem("theme", theme);
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const [isAdmin, setIsAdmin] = useState(false);

  const checkUser = () => {
    if (user.email === admin.email) {
      setIsAdmin(true);
    }
  };

  const [userNotifications, setUserNotifications] = useState(
    JSON.parse(sessionStorage.getItem("userNotifications") || "[]")
  );

  useEffect(() => {
    sessionStorage.setItem(
      "userNotifications",
      JSON.stringify(userNotifications)
    );
  }, [userNotifications]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("user logged in");
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

  const updateUIForUser = async () => {
    if (user.email) {
      checkUser();
      const newNotifications = await updateNotifications(user);
      setUserNotifications(newNotifications);
    }
  };

  useEffect(() => {
    updateUIForUser();
  }, [user]);

  return (
    <AppContext.Provider
      value={{ admin, isAdmin, user, theme, setTheme, userNotifications }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error(
      "useGlobalContext must be used within a WarningModalProvider"
    );
  }
  return context;
};

export default AppProvider;
