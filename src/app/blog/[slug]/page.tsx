import { db } from "@/app/_firebase/config";
import { Doc } from "@/app/_firebase/firestore";
import Footer from "@/app/components/Footer";
import {
  collection,
  getDocs,
  Query,
  query,
  where,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";
import { timeAgo } from "@/app/_lib/accessoryFunctions";
import ReactMarkdown from "react-markdown";
import useMenu from "@/app/hooks/useMenu";
import { fetchArticleContent } from "@/app/_firebase/storage";
import ArticleOptions from "@/app/components/ArticleOptions";

interface ArticleData extends Doc {
  id: string;
}

const getArticle = async (q: Query): Promise<ArticleData | null> => {
  const docSnap: QuerySnapshot<DocumentData> = await getDocs(q);

  if (!docSnap.empty) {
    const doc = docSnap.docs[0];

    return {
      id: doc.id,
      ...(doc.data() as Omit<ArticleData, "id">),
    };
  }

  return null;
};

const SingleArticle = async ({ params }: { params: { slug: string } }) => {
  const q = query(
    collection(db, "articles"),
    where("publishLink", "==", params.slug)
  );
  const article = await getArticle(q);

  if (!article) {
    throw new Error("Article not found");
  }

  const content = await fetchArticleContent(article.id, "articles");

  return (
    <>
      <main className='mx-6 pt-10 font-inter_tight lg:mx-32'>
        <h1 className='mx-auto mb-4 max-w-[50rem] text-center font-kreon text-3xl font-bold leading-10 lg:mb-8 lg:text-6xl lg:leading-[5rem]'>
          {article.title}
        </h1>
        <div className='mx-auto flex max-w-[60rem] items-center justify-between font-kurale dark:text-darkSecondary'>
          <p className='capitalize'>{timeAgo(article.date, false)}</p>
          <div className='flex items-center gap-4'>
            <button className='underline underline-offset-2'>
              Share this post
            </button>
            <ArticleOptions article={article} content={content} />
          </div>
        </div>
        <div className='relative grid place-items-center border-primary py-10 pb-4 lg:py-12 lg:pb-8'>
          <img
            src={article.cover.image}
            alt={article.cover.alt}
            className='aspect-[16/9] w-[60rem] rounded-lg object-cover object-center'
          />
        </div>
        <ReactMarkdown
          children={content}
          className='prose-lg mx-auto max-w-[50rem] break-words font-overpass md:prose-xl prose-headings:mb-4 prose-headings:mt-8 prose-headings:font-kreon prose-headings:font-bold prose-h2:font-extrabold prose-p:my-4 prose-li:list-disc lg:prose-h2:text-4xl'
        />
      </main>
      <Footer />
    </>
  );
};
export default SingleArticle;
