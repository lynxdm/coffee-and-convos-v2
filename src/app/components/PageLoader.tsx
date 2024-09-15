"use client";
import { usePathname } from "next/navigation";
import { DotLoader } from "react-spinners";
import { useGlobalContext } from "@/app/contexts/AppContext";

function Loader() {
  const { theme } = useGlobalContext();
  const currentPage = usePathname();

  return (
    <main
      className={`grid h-[90vh] place-items-center ${
        currentPage === "/notifications" && theme === "light" && "bg-[#f5f5f5]"
      }
        ${
          currentPage === "/notifications/read" &&
          theme === "light" &&
          "bg-[#f5f5f5]"
        }`}
    >
      <DotLoader color={`${theme === "dark" ? "#D4D4D4" : "#161616"}`} />
    </main>
  );
}

export default Loader;
