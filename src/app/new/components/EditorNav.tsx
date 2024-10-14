"use client";
import { FaXmark } from "react-icons/fa6";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";
import { useWarningContext } from "../../contexts/WarningModalContext";
import { ArticleDraft } from "../../_firebase/firestore";
import { useRouter } from "next/navigation";

const EditorNav = ({
  isWriting,
  setIsWriting,
  articleDraft,
  clearEditor,
}: {
  isWriting: boolean;
  setIsWriting: Dispatch<SetStateAction<boolean>>;
  articleDraft: ArticleDraft;
  clearEditor: () => void;
}) => {
  const router = useRouter();
  const { setIsModalWarningOpen, setWarningContent } = useWarningContext();

  return (
    <nav className='relative flex min-h-[5vh] items-center justify-between bg-[#f5f5f5] px-2 py-2 dark:bg-[black] lg:px-32'>
      <div className='flex min-w-[60vw] items-center justify-between'>
        <div className='hidden items-center gap-5 lg:flex'>
          <Link href={"/"} className='text-2xl font-kreon font-semibold'>
            Coffee & Convos
          </Link>
          <p className='text-lg font-semibold underline'>Markdown Editor</p>
        </div>
        <div className='flex items-center *:rounded-lg *:px-4 *:py-2 hover:*:bg-gray-300 dark:hover:*:bg-[#262626] lg:gap-5'>
          <button
            onClick={() => setIsWriting(true)}
            className={`${isWriting && "font-bold"}`}
          >
            Edit
          </button>
          <button
            onClick={() => setIsWriting(false)}
            className={`${!isWriting && "font-bold"}`}
          >
            Preview
          </button>
        </div>
      </div>
      <button
        className='absolute right-4 lg:right-[3rem]'
        title='Leave Editor'
        onClick={() => {
          if (
            articleDraft.title ||
            articleDraft.content ||
            articleDraft.coverImg
          ) {
            setWarningContent({
              proceed: clearEditor,
              proceedText: "Yes, leave this page",
              cancelText: "No, keep editing",
              content:
                "You've made some changes to this post. Do you want to leave this page?",
              header: "You have unsaved changes",
            });
            setIsModalWarningOpen(true);
          } else {
            router.push("/");
          }
        }}
      >
        <FaXmark className='size-6' />
      </button>
    </nav>
  );
};
export default EditorNav;
