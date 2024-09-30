"use client";
import { useEffect, useRef, useState } from "react";
import { getTags, Tags } from "../../_firebase/firestore";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

const Tagsection = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tags, setTags] = useState<Tags[]>([]);
  const [displayedTags, setDisplayedTags] = useState<Tags[]>(tags);

  useEffect(() => {
    getTags()
      .then((result) =>
        setTags(result.sort((a, b) => b.articles.length - a.articles.length))
      )
      .catch((error) =>
        console.error("Error getting tags in blog page:", error)
      );
  }, [searchParams]);

  useEffect(() => {
    setDisplayedTags(tags);
  }, [tags]);

  const tagsContainerRef = useRef<HTMLDivElement>(null);

  const scrollTagsToStart = () => {
    if (tagsContainerRef.current) {
      tagsContainerRef.current.scrollTo({
        left: 0,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (searchParams.has("tag")) {
      const currentTag = searchParams.get("tag");
      if (currentTag) {
        const newResult: Tags[] = [
          { articles: [], title: currentTag, id: currentTag },
          ...tags.filter((tag) => tag.title !== currentTag),
        ];

        setDisplayedTags(newResult);
        scrollTagsToStart();
      }
    }
  }, [searchParams, tags]);

  return (
    <>
      <section className='mt-7'>
        <div
          ref={tagsContainerRef}
          className='pt-3 pb-2 bg-gradient-to-r overflow-x-scroll w-full scrollbar-none'
        >
          <div className='w-max flex gap-2 text-base'>
            <button
              onClick={() => router.push("/blog", { scroll: false })}
              className={`border transition-[background-color] px-4 py-2 rounded-2xl grid place-items-center font-semibold font-kreon ${
                !searchParams.has("tag")
                  ? "bg-[#212121] border-[#323232] text-[#e1e4e6] hover:bg-[#212121] hover:text-[#e1e4e6] dark:bg-[#e1e4e6] dark:text-primary dark:hover:bg-[#e1e4e6] dark:hover:text-primary"
                  : "dark:text-darkPrimary dark:bg-[#212121] dark:border-[#323232] dark:hover:bg-[#323232] border-[#e1e1e1] bg-[#f1f1f1] hover:bg-[#e1e1e1]"
              }`}
            >
              <p>All</p>
            </button>
            {displayedTags.map((tag) => {
              return (
                <button
                  onClick={() =>
                    router.push(`/blog?tag=${tag.title}`, { scroll: false })
                  }
                  key={tag.id}
                  className={`border transition-[background-color] px-4 py-2 rounded-2xl grid place-items-center font-semibold font-kreon ${
                    searchParams.has("tag", tag.title)
                      ? "bg-[#212121] border-[#323232] text-[#e1e4e6] hover:bg-[#212121] hover:text-[#e1e4e6] dark:bg-[#e1e4e6] dark:text-primary dark:hover:bg-[#e1e4e6] dark:hover:text-primary"
                      : "dark:text-darkPrimary dark:bg-[#212121] dark:border-[#323232] dark:hover:bg-[#323232] border-[#e1e1e1] bg-[#f1f1f1] hover:bg-[#e1e1e1]"
                  }`}
                >
                  <p>#{tag.title}</p>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};
export default Tagsection;
