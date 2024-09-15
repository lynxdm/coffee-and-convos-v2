"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const ScrollToComments = () => {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      if (hash === "#comments") {
        const commentsSection = document.getElementById("comments");
        if (commentsSection) {
          commentsSection.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  }, [router]);

  return null;
};

export default ScrollToComments;
