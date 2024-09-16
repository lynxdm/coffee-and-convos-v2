"use client";
import React, { useContext, useState, useEffect } from "react";
import { auth, admin } from "@/app/_firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { updateNotifications } from "../_firebase/notifications";
import { Notification } from "../_firebase/notifications";

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
  userNotifications: Notification[];
}

const AppContext = React.createContext<AppContextType | undefined>(undefined);

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState({
    displayName: "Guest User",
    email: "",
    photoURL: "",
    userId: "",
  });

  const [theme, setTheme] = useState("light");
  const [isAdmin, setIsAdmin] = useState(false);
  const [userNotifications, setUserNotifications] = useState<Notification[]>(
    []
  );

  // Safe localStorage access for theme
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme");
      if (storedTheme) {
        setTheme(storedTheme);
      }
    }
  }, []);

  // Update theme in localStorage and apply it to the root element
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", theme);
      const root = window.document.documentElement;
      if (theme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  }, [theme]);

  // Safe sessionStorage access for notifications
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedNotifications = sessionStorage.getItem("userNotifications");
      if (storedNotifications) {
        setUserNotifications(JSON.parse(storedNotifications));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "userNotifications",
        JSON.stringify(userNotifications)
      );
    }
  }, [userNotifications]);

  // Check if the current user is an admin
  const checkUser = () => {
    if (user.email === admin.email) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  };

  // Handle Firebase authentication state change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log("User logged in");
        const { displayName, email, photoURL, uid } = currentUser;
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
        setIsAdmin(false);
        console.log("No user logged in");
      }
    });

    return () => unsubscribe();
  }, []);

  // Update UI and notifications for the logged-in user
  const updateUIForUser = async () => {
    if (user.email) {
      checkUser();
      const newNotifications = await updateNotifications(user);
      if (newNotifications) setUserNotifications(newNotifications);
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

// Custom hook for consuming the global context
export const useGlobalContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within an AppProvider");
  }
  return context;
};

export default AppProvider;
