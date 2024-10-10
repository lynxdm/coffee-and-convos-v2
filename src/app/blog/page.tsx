import Footer from "../components/Footer";
import { Doc, getArticles } from "../_firebase/firestore";
import { collection, orderBy, query } from "firebase/firestore";
import { db } from "../_firebase/config";
import { fetchArticleContent } from "../_firebase/storage";
import PinnedArticle from "./components/PinnedArticle";
import DisplayedArticles from "./components/DisplayedArticles";
import BackUpButton from "./components/BackUpButton";

export const dynamic = "force-dynamic";

const Blog = async () => {
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

  return (
    <>
      <main className='px-6 lg:px-32 min-h-[90vh]'>
        {pinnedArticle && (
          <PinnedArticle
            pinnedArticle={pinnedArticle}
            previewContent={previewContent}
          />
        )}
        <DisplayedArticles articles={articles} />
      </main>
      <Footer />
      <BackUpButton />
    </>
  );
};
export default Blog;
