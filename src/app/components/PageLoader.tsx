"use client";
import { DotLoader } from "react-spinners";
import { useGlobalContext } from "@/app/contexts/AppContext";

function Loader() {
  const { theme } = useGlobalContext();

  return (
    <main className='grid h-[90vh] place-items-center'>
      <DotLoader color={`${theme === "dark" ? "#D4D4D4" : "#161616"}`} />
    </main>
  );
}

export default Loader;
