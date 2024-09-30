"use client";
import { useEffect, useState } from "react";
import { getTags, Tags } from "../../_firebase/firestore";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const Tagsection = () => {
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

  useEffect(() => {
    if (searchParams.has("tag")) {
      const currentTag = searchParams.get("tag");
      if (currentTag) {
        const newResult: Tags[] = [
          { articles: [], title: currentTag, id: currentTag },
          ...tags.filter((tag) => tag.title !== currentTag),
        ];

        setDisplayedTags(newResult);
      }
    }
  }, [searchParams, tags]);
  //   if (searchParams.has("tag")) {
  //     const currentTag = searchParams.get("tag");
  //     if (currentTag) {
  //       const newResult: Tags[] = [
  //         { articles: [], title: currentTag, id: currentTag },
  //         ...tags.filter((tag) => tag.title !== currentTag),
  //       ];

  //       setTags(newResult);
  //     }
  //   }
  // }, [searchParams, tags]);

  return (
    <>
      <section className='mt-7'>
        <div className='pt-3 pb-2 bg-gradient-to-r overflow-x-scroll w-full scrollbar-none'>
          <div className='w-max flex gap-2 text-base'>
            <Link
              href={"/blog"}
              className={`hover:bg-[#e1e1e1] border transition-[background-color] dark:text-darkPrimary dark:bg-[#212121] dark:border-[#323232] dark:hover:bg-[#323232] border-[#e1e1e1] px-4 py-2 rounded-2xl bg-[#f1f1f1] grid place-items-center font-semibold font-kreon ${
                !searchParams.has("tag")
                  ? "bg-[#212121] border-[#323232] text-[#e1e4e6] hover:bg-[#212121] hover:text-[#e1e4e6] dark:bg-[#e1e4e6] dark:text-primary dark:hover:bg-[#e1e4e6] dark:hover:text-primary"
                  : ""
              }`}
            >
              <p>All</p>
            </Link>
            {displayedTags.map((tag) => {
              return (
                <Link
                  href={`/blog?tag=${tag.title}`}
                  key={tag.id}
                  className={`hover:bg-[#e1e1e1] border transition-[background-color] dark:text-darkPrimary dark:bg-[#212121] dark:border-[#323232] dark:hover:bg-[#323232] border-[#e1e1e1] px-4 py-2 rounded-2xl bg-[#f1f1f1] grid place-items-center font-semibold font-kreon ${
                    searchParams.has("tag", tag.title)
                      ? "bg-[#212121] border-[#323232] text-[#e1e4e6] hover:bg-[#212121] hover:text-[#e1e4e6] dark:bg-[#e1e4e6] dark:text-primary dark:hover:bg-[#e1e4e6] dark:hover:text-primary"
                      : ""
                  }`}
                >
                  <p>#{tag.title}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};
export default Tagsection;
