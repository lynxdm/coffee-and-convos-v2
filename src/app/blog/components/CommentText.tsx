"use client";
import React, { useRef, useEffect, FormEvent } from "react";
import { ScaleLoader } from "react-spinners";

interface CommentTextProps {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  text: string;
  setText: (text: string) => void;
  handleChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  submitText: string;
  loadingText: string;
  isLoading: boolean;
  setIsTextOpen: (isOpen: boolean) => void;
  placeholder: string;
}

const CommentText: React.FC<CommentTextProps> = ({
  onSubmit,
  text,
  setText,
  handleChange,
  submitText,
  loadingText,
  isLoading,
  setIsTextOpen,
  placeholder,
}) => {
  const textRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!textRef.current) return;
    textRef.current.style.height = "70px";
    const scrollHeight = textRef.current.scrollHeight;
    textRef.current.style.height = scrollHeight + "px";
  }, [text]);

  useEffect(() => {
    if (!textRef.current) return;
    textRef.current.focus();
  }, []);

  return (
    <form className='ml-auto mt-4 w-[95%]' onSubmit={onSubmit}>
      <textarea
        name='newComment'
        id='newComment'
        ref={textRef}
        placeholder={placeholder}
        className='peer w-full resize-none overflow-hidden rounded-md border-2 border-gray-600 p-2 focus:outline-none dark:border-[#3e3b3b] dark:bg-[#101011] dark:placeholder:text-[#61626d]'
        value={text}
        onChange={handleChange}
      />
      <div className='transition-[height 1ms ease] mt-1 flex gap-3'>
        {isLoading ? (
          <div className='flex items-center gap-2 rounded-md bg-[#3e3b3b] px-4 py-2 text-white'>
            <ScaleLoader
              color='rgba(256, 256, 256, 1)'
              height={12}
              radius={5}
              width={2}
            />
            <p>{loadingText}</p>
          </div>
        ) : (
          <button
            className='rounded-md bg-[#3e3b3b] px-4 py-2 text-white hover:bg-[#343432]'
            type='submit'
          >
            {submitText}
          </button>
        )}
        <button
          className='rounded-md px-4 py-2 hover:bg-gray-200 dark:hover:bg-[#262626]'
          type='button'
          onClick={() => {
            setText("");
            setIsTextOpen(false);
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CommentText;
