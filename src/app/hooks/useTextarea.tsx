"use client";
import { Ref, useEffect } from "react";

const useTextarea = (
  textAreaRef: Ref<HTMLTextAreaElement>,
  newText: string,
  initialHeight: string
) => {
  useEffect(() => {
    if (textAreaRef && "current" in textAreaRef && textAreaRef.current) {
      textAreaRef.current.style.height = initialHeight;
      if (newText) {
        const scrollHeight = textAreaRef.current.scrollHeight;
        textAreaRef.current.style.height = scrollHeight + "px";
      }
    }
  }, [textAreaRef, newText, initialHeight]);
};

export default useTextarea;
