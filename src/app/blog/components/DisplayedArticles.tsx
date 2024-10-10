"use client";
import { ArticleData } from "@/app/_firebase/firestore";
import Tagsection from "./Tagsection";
import ArticleCard from "@/app/components/ArticleCard";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

const DisplayedArticles = ({ articles }: { articles: ArticleData[] }) => {
  const [isFiltered, setIsfiltered] = useState(true);
  const searchParams = useSearchParams();

  const displayedArticles = useMemo(() => {
    if (searchParams.has("tag")) {
      setIsfiltered(false);
      const currentTag = searchParams.get("tag");
      return articles.filter((article) => article.tags.includes(currentTag!));
    }

    setIsfiltered(true);
    return articles;
  }, [searchParams, articles]);

  return (
    <>
      <Tagsection />
      <section className='py-12'>
        <article className='grid gap-12 md:grid-cols-2 xl:grid-cols-3'>
          {displayedArticles.map((article) => {
            return (
              <ArticleCard article={article} key={article.id} type='articles' />
            );
          })}
        </article>
        {isFiltered && (
          <p className='font-kurale font-semibold text-2xl text-center mt-8'>
            You&#39;ve reached the end! 😘
          </p>
        )}
      </section>
    </>
  );
};

export default DisplayedArticles;
