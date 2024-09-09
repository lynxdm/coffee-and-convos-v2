import React, { useState, useEffect, Ref, RefObject } from "react";

function useMenu(
  btn: RefObject<HTMLButtonElement>,
  menu: RefObject<HTMLUListElement>
) {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const handleMenu = (e: MouseEvent) => {
    const target = e.target as Node;
    if (!btn?.current?.contains(target) && !menu?.current?.contains(target)) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.body.addEventListener("click", handleMenu);
    }

    return () => {
      document.body.removeEventListener("click", handleMenu);
    };
  }, [isMenuOpen]);

  return [isMenuOpen, setIsMenuOpen];
}

export default useMenu;
