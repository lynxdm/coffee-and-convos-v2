"use client";
import React, { useContext, useState, useEffect } from "react";
import { auth, admins } from "@/app/_firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { updateNotifications } from "../_firebase/notifications";
import { Notification } from "../_firebase/notifications";
import { SkeletonTheme } from "react-loading-skeleton";

interface AppContextType {
  currentAdmin: {
    isAdmin: boolean;
    admin: { displayName: string; email: string; userId: string };
  };
  admins: Array<{ displayName: string; email: string; userId: string }>;
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
  const [currentAdmin, setCurrentAdmin] = useState({
    isAdmin: false,
    admin: {
      displayName: "",
      email: "",
      userId: "",
    },
  });
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
    admins.forEach((admin) => {
      if (user.email === admin.email) setCurrentAdmin({ isAdmin: true, admin });
    });
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
        setCurrentAdmin({
          isAdmin: false,
          admin: {
            displayName: "",
            email: "",
            userId: "",
          },
        });
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
      value={{ currentAdmin, admins, user, theme, setTheme, userNotifications }}
    >
      <SkeletonTheme
        baseColor={theme === "light" ? "#e1e1e1" : "#202020"}
        highlightColor={theme === "light" ? "#fff" : "#444"}
      >
        {children}
      </SkeletonTheme>
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
