"use client";
import { DotLoader } from "react-spinners";
// import { useGlobalContext } from "../context";

function Loader() {
  //   const { theme } = useGlobalContext();
  const theme = "light";

  return (
    <main className='grid h-[100vh] place-items-center'>
      <DotLoader color={`${theme ? "#D4D4D4" : "#161616"}`} />
    </main>
  );
}

export default Loader;
