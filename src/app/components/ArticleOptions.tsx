"use client";
import { useEffect, useRef, useState } from "react";
import useMenu from "../hooks/useMenu";
import { useWarningContext } from "../contexts/WarningModalContext";
import { useGlobalContext } from "../contexts/AppContext";
import { Doc, unpinArticles, pinArticle } from "../_firebase/firestore";
import { useRouter } from "next/navigation";
import { deleteDoc, doc, collection, query, where } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { db, storage } from "../_firebase/config";

const ArticleOptions = ({
  article,
  content,
}: {
  article: Doc;
  content: string | undefined;
}) => {
  const router = useRouter();
  const { isAdmin } = useGlobalContext();
  const { setWarningContent, setIsModalWarningOpen } = useWarningContext();

  const [isPinned, setIsPinned] = useState(false);

  useEffect(() => {
    if (article.pinned) setIsPinned(true);
  }, []);

  const manageMenuRef = useRef(null);
  const manageBtnRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useMenu(manageBtnRef, manageMenuRef);

  const handleEditing = () => {
    const { cover, title, date, id } = article;
    let articleDraft = {
      coverImg: cover.image,
      title: title,
      content: content,
      details: { type: "articles", id: id },
      publishDate: date,
    };

    localStorage.setItem("articleDraft", JSON.stringify(articleDraft));
    router.push("/new");
  };

  const deleteArticle = () => {
    deleteDoc(doc(db, "articles", article.id));
    deleteObject(ref(storage, `articles/${article.id}`));
    router.push("/blog");
  };

  return (
    <>
      {isAdmin && (
        <div className='relative'>
          <button
            className='rounded p-1 px-2 font-semibold underline underline-offset-2 hover:bg-gray-200 dark:hover:bg-[#262626]'
            ref={manageBtnRef}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            Manage
          </button>
          {isMenuOpen && (
            <div
              className='absolute right-0 top-[110%] z-20 flex w-[12rem] flex-col gap-1 rounded-md border border-gray-200 bg-white p-1.5 shadow-lg *:rounded *:px-2 *:text-left dark:border-[#3a3a3a] dark:bg-darkBg'
              ref={manageMenuRef}
            >
              <button
                className='py-2 hover:bg-gray-200 dark:hover:bg-[#262626]'
                onClick={handleEditing}
              >
                Edit Article
              </button>
              <button
                className='py-2 hover:bg-gray-200 dark:hover:bg-[#262626]'
                onClick={() => {
                  console.log("delete");
                  setWarningContent({
                    proceedText: "Delete",
                    content: "Are you sure you want to delete this post?",
                    header: "You're about to delete a published article",
                    proceed: deleteArticle,
                    cancelText: "cancel",
                  });
                  setIsModalWarningOpen(true);
                }}
              >
                Delete Article
              </button>
              {!isPinned ? (
                <button
                  className='py-2 hover:bg-gray-200 dark:hover:bg-[#262626]'
                  onClick={() => {
                    setWarningContent({
                      proceedText: "Pin",
                      content:
                        "Note that any previously pinned articles will be unpinned.",
                      header: "You're about to pin this article to your blog",
                      proceed: () => {
                        pinArticle(article.id);
                        setIsModalWarningOpen(false);
                        setIsPinned(true);
                      },
                      cancelText: "cancel",
                    });
                    setIsModalWarningOpen(true);
                  }}
                >
                  Pin Article
                </button>
              ) : (
                <button
                  className='py-2 hover:bg-gray-200 dark:hover:bg-[#262626]'
                  onClick={() => {
                    setWarningContent({
                      proceedText: "Unpin",
                      content: "Are you sure you want to unpin this article?",
                      header: "You're about to unpin this article",
                      proceed: () => {
                        unpinArticles();
                        setIsPinned(false);
                        setIsModalWarningOpen(false);
                      },
                      cancelText: "cancel",
                    });
                    setIsModalWarningOpen(true);
                  }}
                >
                  Unpin Article
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};
export default ArticleOptions;
