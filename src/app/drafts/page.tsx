"use client";
import { collection } from "firebase/firestore";
import { Doc, getArticles } from "../_firebase/firestore";
import ArticleCard from "../components/ArticleCard";
import { db } from "../_firebase/config";
import { useEffect, useState } from "react";
import useCheckUser from "../hooks/useCheckUser";
import { useGlobalContext } from "../contexts/AppContext";

const Drafts = () => {
  useCheckUser(true);
  const {
    currentAdmin: { isAdmin },
  } = useGlobalContext();
  const [articles, setArticles] = useState<Doc[]>([]);

  useEffect(() => {
    const fetchArticles = async () => {
      const articles = await getArticles(collection(db, "drafts"));
      if (articles) {
        setArticles(articles);
      }
    };
    fetchArticles();
  }, []);

  if (!isAdmin) {
    return null;
  }

  return (
    <main>
      <h1 className='mx-auto mt-12 w-fit font-kurale text-5xl font-semibold text-primary dark:text-darkPrimary'>
        Your drafts
      </h1>
      <section className='my-16 flex flex-col px-6 lg:px-32'>
        {articles.length > 0 ? (
          <article className='grid gap-12 md:grid-cols-2 md:gap-10 xl:grid-cols-3'>
            {articles.map((article) => {
              return (
                <ArticleCard article={article} type='drafts' key={article.id} />
              );
            })}
          </article>
        ) : (
          <p className='text-2xl font-kurale font-semibold text-center mt-10'>
            Nothing here yet babe.💕
          </p>
        )}
      </section>
    </main>
  );
};
export default Drafts;
