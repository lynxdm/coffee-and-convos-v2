"use client";
import { Ref, useEffect } from "react";

const useTextarea = (
  textAreaRef: Ref<HTMLTextAreaElement>,
  newText: string
) => {
  useEffect(() => {
    if (textAreaRef && "current" in textAreaRef && textAreaRef.current) {
      textAreaRef.current.style.height = "70px";
      const scrollHeight = textAreaRef.current.scrollHeight;
      textAreaRef.current.style.height = scrollHeight + "px";
    }
  }, [textAreaRef, newText]);
};

export default useTextarea;
