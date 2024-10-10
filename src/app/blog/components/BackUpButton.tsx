"use client";
import { useEffect, useState } from "react";
import { IoArrowUpOutline } from "react-icons/io5";

const BackUpButton = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <button
      aria-label='Go up'
      className={`fixed bottom-8 right-8 bg-[#242424a5] dark:hover:bg-[#ffffff9b] dark:bg-[#ffffff72] hover:bg-[#242424] text-[#e9e7e7] dark:text-[#272626cd] size-[3rem] grid place-items-center rounded-full ${
        !showButton
          ? "opacity-0 pointer-events-none"
          : "opacity-90 pointer-events-auto"
      } transition-opacity duration-300`}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <IoArrowUpOutline className='size-[1.5rem]' />
    </button>
  );
};
export default BackUpButton;
