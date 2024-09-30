"use client";
import { useState, useEffect, ChangeEvent } from "react";
import { deleteObject, ref, listAll, uploadBytes } from "firebase/storage";
import { db, storage } from "../_firebase/config";
import { ScaleLoader } from "react-spinners";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useWarningContext } from "../contexts/WarningModalContext";
import { publishArticle } from "../_firebase/firestore";
import { v4 } from "uuid";
import { useRouter } from "next/navigation";
import EditorNav from "./components/EditorNav";
import { formatLink } from "../_lib/accessoryFunctions";
import Editor from "./components/Editor";
import Preview from "./components/Preview";
import { ArticleDraft } from "../_firebase/firestore";
import { getTags, Tags } from "../_firebase/firestore";
import PostOptions from "./components/PostOptions";

const initialDraft = {
  coverImg: "",
  title: "",
  content: "",
  publishDate: "",
  selectedTags: [],
  seoTitle: "",
  seoDescription: "",
  canonicalUrl: "",
  details: { type: "new", id: v4().split("-").join("") },
};

const New = () => {
  const router = useRouter();
  const { setIsModalWarningOpen, setWarningContent } = useWarningContext();
  const [articleDraft, setArticleDraft] = useState<ArticleDraft>(initialDraft);
  const [isLoading, setIsLoading] = useState({ show: false, message: "" });
  const [isWriting, setIsWriting] = useState(true);
  const [errorComponent, setErrorComponent] = useState({
    show: false,
    content: "",
  });

  const [tags, setTags] = useState<Tags[]>([]);

  useEffect(() => {
    if (typeof window !== undefined) {
      const savedDraft = localStorage.getItem("articleDraft");
      if (savedDraft) setArticleDraft(JSON.parse(savedDraft));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("articleDraft", JSON.stringify(articleDraft));
  }, [articleDraft]);

  useEffect(() => {
    getTags().then((result) => {
      setTags(result.sort((a, b) => b.articles.length - a.articles.length));
    });
  }, []);

  useEffect(() => {
    if (errorComponent.show) {
      setTimeout(() => {
        setErrorComponent({
          show: false,
          content: "",
        });
      }, 4000);
    }
  }, [errorComponent]);

  const handleChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setArticleDraft({ ...articleDraft, [name]: value });
  };

  const checkTags = async () => {
    try {
      for (const tag of articleDraft.selectedTags) {
        const checkTag = tags.find((item) => item.title === tag);
        if (!checkTag) {
          const tagData = {
            title: tag,
            articles: [formatLink(articleDraft.title)],
          };
          await addDoc(collection(db, "tags"), tagData);
        } else {
          const newTagData = {
            ...checkTag,
            articles: [...checkTag.articles, formatLink(articleDraft.title)],
          };
          await updateDoc(doc(db, `tags/${checkTag.id}`), newTagData);
        }
      }
    } catch (error) {
      console.error("Error adding tags: ", error);
    }
  };

  const handlePublishing = (type: string) => {
    // no article title, then return
    if (!articleDraft.title) {
      setErrorComponent({ show: true, content: "The title cannot be blank" });
      return;
    }

    //  start loading
    setIsLoading({
      show: true,
      message: `${
        type === "articles" ? "Publishing Article..." : "Saving Draft..."
      }`,
    });

    //  article publishing data
    const articleData = {
      title: articleDraft.title,
      cover: {
        image: articleDraft.coverImg,
        alt: `${articleDraft.title} cover image`,
      },
      date: `${
        articleDraft.publishDate
          ? articleDraft.publishDate
          : new Date().toISOString()
      }`,
      publishLink: formatLink(articleDraft.title),
      tags: articleDraft.selectedTags,
      seoTitle: articleDraft.seoTitle,
      canonicalUrl: articleDraft.canonicalUrl,
      seoDescription: articleDraft.seoDescription,
    };

    const markdownContent = new Blob([articleDraft.content], {
      type: "text/markdown",
    });
    const markdownRef = ref(
      storage,
      `${type}/${articleDraft.details.id}/content.md`
    );

    // delete previous draft content
    if (articleDraft.details.type === "drafts") {
      const draftRef = ref(storage, `drafts/${articleDraft.details.id}`);
      listAll(draftRef)
        .then(({ items }) => {
          const deletePromises = items.map((fileRef) => deleteObject(fileRef));
          return Promise.all(deletePromises);
        })
        .then(() => {
          return deleteDoc(doc(db, "drafts", `${articleDraft.details.id}`));
        })
        .catch((error) => {
          console.log("Error deleting files or draft:", error);
        });
    }

    //  upload markdown
    uploadBytes(markdownRef, markdownContent)
      .then(() => {
        if (articleDraft.details.type === "article") {
          updateDoc(
            doc(db, `articles/${articleDraft.details.id}`),
            articleData
          );
          checkTags();
          localStorage.removeItem("articleDraft");
          router.push("/blog");
          return;
        }
        publishArticle(articleData, articleDraft.details.id, type);
        checkTags();
        localStorage.removeItem("articleDraft");
        router.push(`${type === "articles" ? "/blog" : "/drafts"}`);
      })
      .catch((error) => {
        setErrorComponent({
          show: true,
          content: `${
            type === "articles"
              ? "whoops there was a problem publishing:"
              : "whoops there was a problem saving the draft"
          }`,
        });
        console.log(error);
      });
  };

  const deleteDraft = async () => {
    try {
      deleteDoc(doc(db, "drafts", `${articleDraft.details.id}`));

      const { items } = await listAll(
        ref(storage, `drafts/${articleDraft.details.id}`)
      );
      const deletePromise = items.map((fileRef) => deleteObject(fileRef));
      await Promise.all(deletePromise);

      localStorage.removeItem("articleDraft");
      router.push("/");
    } catch (error) {
      console.log("Error deleting draft", error);
      throw new Error("Error deleting draft");
    }
  };

  const clearEditor = () => {
    localStorage.removeItem("articleDraft");
    router.push("/");
  };

  return (
    <>
      <EditorNav
        articleDraft={articleDraft}
        clearEditor={clearEditor}
        isWriting={isWriting}
        setIsWriting={setIsWriting}
      />
      <main className='flex min-h-[100vh] flex-col gap-4 bg-[#f5f5f5] dark:bg-[rgb(0,0,0)] lg:px-32'>
        <section
          className={` min-h-[30rem] h-[82vh] overflow-y-hidden border border-gray-300 bg-white dark:bg-darkBg dark:border-[#181818] lg:rounded-md xl:w-[57rem] ${
            (articleDraft.content.length > 250 || !isWriting) &&
            "overflow-y-scroll scrollbar scrollbar-track-[#d6d7d8] scrollbar-thumb-[#626262] dark:scrollbar-track-[#262626] dark:scrollbar-thumb-[#575656]"
          } relative`}
        >
          {errorComponent.show && (
            <div className='m-0 grid items-center bg-red-100 px-10 py-4 pb-5 font-bold text-red-700'>
              <p className='m-0 h-fit py-0 text-2xl'>
                {errorComponent.content}
              </p>
            </div>
          )}
          {isWriting ? (
            <Editor
              articleDraft={articleDraft}
              handleChange={handleChange}
              setArticleDraft={setArticleDraft}
              setErrorComponent={setErrorComponent}
            />
          ) : (
            <Preview articleDraft={articleDraft} />
          )}
        </section>
        <div className='flex items-center gap-2 px-3 pb-4'>
          {isLoading.show ? (
            <div className='flex gap-2 rounded-md px-4 py-[0.4rem] bg-blue-700 font-semibold text-white'>
              <ScaleLoader
                color='rgba(256, 256, 256, 1)'
                height={12}
                radius={5}
                width={2}
              />
              <p>{isLoading.message}</p>
            </div>
          ) : (
            <>
              <PostOptions
                tags={tags}
                articleDraft={articleDraft}
                setArticleDraft={setArticleDraft}
                handleChange={handleChange}
                handlePublishing={handlePublishing}
              />
              {articleDraft.details.type !== "articles" && (
                <button
                  className='hover:bg-gray-300 rounded-md px-4 py-[0.4rem] dark:hover:bg-[#262626]'
                  onClick={() => handlePublishing("drafts")}
                >
                  Save draft
                </button>
              )}
              {articleDraft.details.type === "drafts" && (
                <button
                  className='self-end bg-red-600 rounded-md px-4 py-[0.4rem] text-white hover:bg-red-700'
                  onClick={() => {
                    setWarningContent({
                      proceed: deleteDraft,
                      proceedText: "Delete",
                      content:
                        "Are you sure you want to delete your saved work?",
                      header: "You're about to delete a draft",
                      cancelText: "Cancel",
                    });
                    setIsModalWarningOpen(true);
                  }}
                >
                  Delete
                </button>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
};
export default New;
