"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "../contexts/AppContext";

const useCheckUser = (checkAdmin: boolean) => {
  const router = useRouter();
  const {
    currentAdmin: { isAdmin },
    user,
  } = useGlobalContext();

  useEffect(() => {
    if (checkAdmin) {
      if (!isAdmin) {
        if (user?.email) router.push("/");
        else router.push("/login");
      }
    }
    if (!user?.email) router.push("/login");
  }, [checkAdmin, router, isAdmin, user]);
};
export default useCheckUser;
