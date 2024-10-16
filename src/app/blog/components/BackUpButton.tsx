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
      aria-label='Scroll up'
      title="Scroll up"
      className={`fixed bottom-8 right-8 bg-primary dark:bg-[#f5f4f8] text-[#e9e7e7] dark:text-primary size-[3rem] grid place-items-center rounded-lg ${
        !showButton
          ? "opacity-0 pointer-events-none"
          : "opacity-90 pointer-events-auto"
      } transition-[opacity_transform] duration-300 `}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <IoArrowUpOutline className='size-[1.5rem]' />
    </button>
  );
};
export default BackUpButton;
