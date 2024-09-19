"use client";
import { useRef, useState, useEffect } from "react";
import UseToolbar from "../hooks/useToolbar";
import useTextarea from "../hooks/useTextarea";
import { v4 } from "uuid";
import { uploadCoverImage, deleteCoverImage } from "@/app/_firebase/storage";
import { ScaleLoader } from "react-spinners";
import { ArticleDraft } from "../_firebase/firestore";
import { ChangeEvent, Dispatch, SetStateAction } from "react";

const Editor = ({
  articleDraft,
  handleChange,
  setArticleDraft,
  setErrorComponent,
}: {
  articleDraft: ArticleDraft;
  handleChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  setArticleDraft: Dispatch<SetStateAction<ArticleDraft>>;
  setErrorComponent: Dispatch<
    SetStateAction<{ show: boolean; content: string }>
  >;
}) => {
  const [imageIsLoading, setImageIsLoading] = useState(false);
  const [coverIsLoading, setCoverIsLoading] = useState(false);

  const textAreaRef = useRef(null);
  const titleText = useRef(null);

  useTextarea(textAreaRef, articleDraft.content, "70px");
  useTextarea(titleText, articleDraft.title, "70px");

  const headingsDropdown = useRef(null);
  const headingsButton = useRef(null);
  const [showHeadingsDropdown, setShowHeadingsDropdown] = useState(false);

  const handleDropdown = (e: MouseEvent) => {
    const target = e.target as HTMLElement;

    if (
      !headingsDropdown?.current?.contains(target) &&
      !headingsButton?.current?.contains(target)
    ) {
      setShowHeadingsDropdown(false);
    }
  };

  useEffect(() => {
    if (showHeadingsDropdown) {
      document.addEventListener("mousedown", handleDropdown);
    }

    return () => {
      document.removeEventListener("mousedown", handleDropdown);
    };
  }, [showHeadingsDropdown]);

  const {
    handleBold,
    handleItalic,
    handleStrikethrough,
    handleOrderedList,
    handleUnderline,
    handleLinking,
    handleUnOrderedList,
    handleQuote,
    handleHeadings,
    uploadImage,
  } = UseToolbar(textAreaRef, setArticleDraft, articleDraft);

  const handleUploadCoverImage = async (e: any) => {
    if (e.target.files[0]) {
      setCoverIsLoading(true);
      const { url, error } = await uploadCoverImage(e, articleDraft.details.id);
      if (url) {
        setArticleDraft({
          ...articleDraft,
          coverImg: url,
        });
        setCoverIsLoading(false);
      } else if (error) {
        setCoverIsLoading(false);
        setArticleDraft({
          ...articleDraft,
          coverImg: "",
        });
        setErrorComponent({
          show: true,
          content: "There was a problem uploading the image:",
        });
        console.log(error);
      }
    }
  };

  const handleDeleteCoverImage = async () => {
    const { result, error } = await deleteCoverImage(articleDraft.details.id);
    if (result) {
      setArticleDraft({
        ...articleDraft,
        coverImg: "",
      });
    } else if (error) {
      setErrorComponent({
        show: true,
        content: "Whoops an error occurred:",
      });
    }
  };

  const handleChangeCoverImage = async (e: any) => {
    handleUploadCoverImage(e);
  };

  const handleUploadImage = (e: any) => {
    if (e.target.files[0]) {
      setImageIsLoading(true);
      const { result, error } = uploadImage(
        e,
        textAreaRef,
        articleDraft.details.id
      );
      if (!result && error) {
        setErrorComponent({
          show: true,
          content: "There was a problem uploading the image:",
        });
        console.log(error);
      }
      setImageIsLoading(false);
    }
  };

  return (
    <form
      className='relative flex flex-col gap-6 py-8'
      onSubmit={(e) => e.preventDefault()}
    >
      {coverIsLoading ? (
        <div className='mx-4 flex items-center gap-2 lg:mx-16'>
          <ScaleLoader
            color='rgba(29, 78, 216, 1)'
            height={12}
            radius={5}
            width={2}
          />
          <p>Uploading...</p>
        </div>
      ) : articleDraft.coverImg ? (
        <div className='mx-4 flex flex-col gap-3 lg:mx-16 lg:flex-row lg:items-center lg:gap-8'>
          <div>
            <img
              src={articleDraft.coverImg}
              alt={articleDraft.title + "cover image"}
              className='max-h-[7rem] rounded object-contain lg:max-h-[9rem]'
            />
          </div>
          <div className='flex gap-2 *:rounded-md *:px-4 *:py-[0.4rem] *:font-semibold'>
            <label
              htmlFor='change-cover-img'
              className='w-fit cursor-pointer border-2 border-gray-300'
              onInput={handleChangeCoverImage}
            >
              Change
              <input
                type='file'
                name='change-cover-img'
                id='change-cover-img'
                accept='image/*'
                className='hidden'
              />
            </label>
            <button
              type='button'
              onClick={handleDeleteCoverImage}
              className='text-red-700 hover:bg-gray-200 dark:hover:bg-[#de1c1c18]'
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <label
          htmlFor='cover-img'
          className='mx-4 w-fit cursor-pointer rounded-md border-2 border-gray-300 px-3 py-[0.4rem] font-semibold dark:border-[#3a3a3a] lg:mx-16'
          onInput={handleUploadCoverImage}
        >
          Add a cover image
          <input
            type='file'
            name='cover-img'
            id='cover-img'
            accept='image/*'
            className='hidden'
          />
        </label>
      )}
      <textarea
        placeholder='Article title here'
        name='title'
        value={articleDraft.title}
        onChange={handleChange}
        ref={titleText}
        id='title'
        className='resize-none px-4 font-kreon text-4xl font-extrabold placeholder:font-extrabold placeholder:text-gray-600 focus:outline-none dark:bg-darkBg dark:text-white dark:placeholder:text-[#3a3a3a] lg:px-16 lg:text-5xl lg:placeholder:text-5xl'
      />
      <div className='sticky top-0 flex w-full flex-wrap items-center gap-3 bg-[#f5f5f5] px-2 py-3 *:flex *:size-10 *:items-center *:justify-center *:rounded dark:bg-[#090909] lg:px-16'>
        <button
          type='button'
          className='font-mono text-2xl hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-[#343434] dark:hover:text-darkPrimary'
          onClick={handleBold}
        >
          B
        </button>
        <button
          type='button'
          className='font-mono text-2xl italic hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-[#343434] dark:hover:text-darkPrimary'
          onClick={handleItalic}
        >
          I
        </button>
        <div className='relative'>
          <button
            type='button'
            className='size-10 rounded font-mono text-2xl hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-[#343434] dark:hover:text-darkPrimary'
            ref={headingsButton}
            onClick={() => {
              setShowHeadingsDropdown(!showHeadingsDropdown);
            }}
          >
            H
          </button>
          <div
            className={`absolute top-[110%] rounded border border-gray-200 bg-white *:px-5 *:py-3 hover:*:bg-blue-100 hover:*:text-blue-700 dark:border-[#3a3a3a] dark:bg-[#262626] dark:hover:*:bg-[#343434] dark:hover:*:text-darkPrimary ${
              showHeadingsDropdown ? "flex" : "hidden"
            }`}
            ref={headingsDropdown}
          >
            <button
              type='button'
              onClick={() => handleHeadings("##")}
              onMouseUp={() => setShowHeadingsDropdown(false)}
            >
              H2
            </button>
            <button
              className='border-x dark:border-[#3a3a3a]'
              type='button'
              onClick={() => handleHeadings("###")}
              onMouseUp={() => setShowHeadingsDropdown(false)}
            >
              H3
            </button>
            <button
              type='button'
              onClick={() => handleHeadings("####")}
              onMouseUp={() => setShowHeadingsDropdown(false)}
            >
              H4
            </button>
          </div>
        </div>
        <button
          type='button'
          className='font-mono text-2xl underline hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-[#343434] dark:hover:text-darkPrimary'
          onClick={handleUnderline}
        >
          U
        </button>
        <button
          type='button'
          className='font-mono text-2xl line-through hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-[#343434] dark:hover:text-darkPrimary'
          onClick={handleStrikethrough}
        >
          S
        </button>
        <button
          type='button'
          onClick={handleLinking}
          className='hover:bg-blue-100 hover:fill-blue-700 dark:hover:bg-[#343434] dark:hover:fill-darkPrimary'
        >
          <svg
            className='dark:fill-darkPrimary'
            height='24'
            viewBox='0 0 24 24'
            width='24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path d='M18.364 15.536 16.95 14.12l1.414-1.414a5.001 5.001 0 0 0-3.531-8.551 5 5 0 0 0-3.54 1.48L9.879 7.05 8.464 5.636 9.88 4.222a7 7 0 1 1 9.9 9.9l-1.415 1.414zm-2.828 2.828-1.415 1.414a7 7 0 0 1-9.9-9.9l1.415-1.414L7.05 9.88l-1.414 1.414a5 5 0 1 0 7.071 7.071l1.414-1.414 1.415 1.414zm-.708-10.607 1.415 1.415-7.071 7.07-1.415-1.414 7.071-7.07z'></path>
          </svg>
        </button>
        <button
          type='button'
          onClick={handleOrderedList}
          className='hover:bg-blue-100 hover:fill-blue-700 dark:hover:bg-[#343434] dark:hover:fill-darkPrimary'
        >
          <svg
            className='dark:fill-darkPrimary'
            height='24'
            viewBox='0 0 24 24'
            width='24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path d='M8 4h13v2H8zM5 3v3h1v1H3V6h1V4H3V3zM3 14v-2.5h2V11H3v-1h3v2.5H4v.5h2v1zm2 5.5H3v-1h2V18H3v-1h3v4H3v-1h2zM8 11h13v2H8zm0 7h13v2H8z'></path>
          </svg>
        </button>
        <button
          type='button'
          onClick={handleUnOrderedList}
          className='hover:bg-blue-100 hover:fill-blue-700 dark:hover:bg-[#343434] dark:hover:fill-darkPrimary'
        >
          <svg
            className='dark:fill-darkPrimary'
            height='24'
            viewBox='0 0 24 24'
            width='24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path d='M8 4h13v2H8zM4.5 6.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0 7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0 6.9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM8 11h13v2H8zm0 7h13v2H8z'></path>
          </svg>
        </button>
        <button
          type='button'
          onClick={handleQuote}
          className='hover:bg-blue-100 hover:fill-blue-700 dark:hover:bg-[#343434] dark:hover:fill-darkPrimary'
        >
          <svg
            className='dark:fill-darkPrimary'
            height='24'
            viewBox='0 0 24 24'
            width='24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path d='M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5 3.871 3.871 0 0 1-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5 3.871 3.871 0 0 1-2.748-1.179z'></path>
          </svg>
        </button>
        <label
          htmlFor='add-img'
          className='hover:bg-blue-100 hover:fill-blue-700 dark:hover:bg-[#343434] dark:hover:fill-darkPrimary'
        >
          {imageIsLoading ? (
            <ScaleLoader
              color='rgba(29, 78, 216, 1)'
              height={12}
              radius={5}
              width={2}
            />
          ) : (
            <svg
              className='dark:fill-darkPrimary'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
              aria-hidden='true'
            >
              <path d='M20 5H4v14l9.292-9.294a1 1 0 011.414 0L20 15.01V5zM2 3.993A1 1 0 012.992 3h18.016c.548 0 .992.445.992.993v16.014a1 1 0 01-.992.993H2.992A.993.993 0 012 20.007V3.993zM8 11a2 2 0 110-4 2 2 0 010 4z'></path>
            </svg>
          )}
          <input
            type='file'
            className='hidden'
            name='add-img'
            id='add-img'
            accept='image/*'
            onInput={handleUploadImage}
          />
        </label>
      </div>
      <textarea
        name='content'
        id='content'
        value={articleDraft.content}
        placeholder='Article content here...'
        onChange={handleChange}
        className='resize-none overflow-hidden px-4 font-mono text-lg leading-loose placeholder:text-gray-600 focus:outline-none dark:bg-darkBg dark:text-white dark:placeholder:text-[#3a3a3a] lg:px-16'
        ref={textAreaRef}
      ></textarea>
    </form>
  );
};
export default Editor;
