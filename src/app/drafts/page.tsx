import { collection } from "firebase/firestore";
import { getArticles } from "../_firebase/firestore";
import ArticleCard from "../components/ArticleCard";
import { db } from "../_firebase/config";

const Drafts = async () => {
  const articles = await getArticles(collection(db, "drafts"));
  console.log(articles);

  return (
    <main>
      <h1 className='mx-auto mt-12 w-fit font-kurale text-5xl font-semibold text-primary dark:text-darkPrimary'>
        Your drafts
      </h1>
      <section className='my-16 flex flex-col px-6 lg:px-32'>
        <article className='grid gap-12 md:grid-cols-2 md:gap-10 xl:grid-cols-3'>
          {articles.map((article) => {
            return <ArticleCard {...article} type='drafts' key={article.id} />;
          })}
        </article>
      </section>
    </main>
  );
};
export default Drafts;
