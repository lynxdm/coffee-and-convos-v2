import ArticleCard from "../components/ArticleCard";
import Footer from "../components/Footer";
import { Doc, getArticles } from "../_firebase/firestore";
import { collection, orderBy, query } from "firebase/firestore";
import { db } from "../_firebase/config";
import { fetchArticleContent } from "../_firebase/storage";
// import Tagsection from "./Tagsection";
import PinnedArticle from "./PinnedArticle";

export const dynamic = "force-dynamic";

const Blog = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  let articles: Doc[] = [];

  articles = await getArticles(
    query(collection(db, "articles"), orderBy("date", "desc"))
  );

  const pinnedArticle = articles?.find((article) => {
    if (article.pinned === true) return article;
  });

  let previewContent;
  if (pinnedArticle)
    previewContent = await fetchArticleContent(pinnedArticle?.id, "articles");

  if (searchParams.tag) {
    articles = articles.reduce((acc: Doc[], article) => {
      article.tags.forEach((tag) => {
        if (tag === searchParams.tag) {
          acc.push(article);
        }
      });
      return acc;
    }, []);
  }

  return (
    <>
      <main className='px-6 lg:px-32 min-h-[90vh]'>
        {pinnedArticle && (
          <PinnedArticle
            pinnedArticle={pinnedArticle}
            previewContent={previewContent}
          />
        )}
        {/* <Tagsection /> */}
        <section className='py-12'>
          <article className='grid gap-12 md:grid-cols-2 xl:grid-cols-3'>
            {articles?.map((article) => {
              return (
                <ArticleCard
                  article={article}
                  key={article.id}
                  type='articles'
                />
              );
            })}
          </article>
        </section>
      </main>
      <Footer />
    </>
  );
};
export default Blog;
