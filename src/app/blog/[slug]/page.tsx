import dynamic from "next/dynamic";
import { db } from "@/app/_firebase/config";
import Footer from "@/app/components/Footer";
import { collection, getDocs, query, where } from "firebase/firestore";
import { timeAgo } from "@/app/_lib/accessoryFunctions";
import ReactMarkdown from "react-markdown";
import { fetchArticleContent } from "@/app/_firebase/storage";
import ArticleOptions from "@/app/components/ArticleOptions";
import CommentSection from "@/app/components/CommentSection";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getArticle } from "@/app/_firebase/firestore";
import { RxDrawingPinFilled } from "react-icons/rx";

// Dynamically import the ScrollToComments component (client-side only)
const ScrollToComments = dynamic(
  () => import("@/app/components/ScrollToComments"),
  {
    ssr: false, // Ensure it's only run on the client side
  }
);

export async function generateStaticParams() {
  const articles = await getDocs(collection(db, "articles"));
  return articles.docs.map((d) => {
    slug: d.data().publishLink;
  });
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    const article = await getArticle(
      query(collection(db, "articles"), where("publishLink", "==", params.slug))
    );

    if (!article) {
      return {
        title: "Not found",
        description: "The page you're looking for doesn't exist",
      };
    }

    return {
      title: article.title,
      description: "Article by Adesegun Adefunke",
      creator: "Adesegun Adefunke",
      alternates: {
        canonical: `/blog/${article.publishLink}`,
      },
      twitter: {
        card: "summary_large_image",
        title: article.title,
        description: "Article by Adesegun Adefunke",
        creator: "@iyamfunky",
      },
    };
  } catch (error) {
    return {
      title: "Not found",
      description: "The page you're looking for doesn't exist",
    };
  }
}

const SingleArticle = async ({ params }: { params: { slug: string } }) => {
  const q = query(
    collection(db, "articles"),
    where("publishLink", "==", params.slug)
  );
  const article = await getArticle(q);

  if (!article) notFound();

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
        <div className='relative grid place-items-center border-primary my-10 mb-2 lg:my-12 lg:mb-6 w-fit mx-auto'>
          {article.pinned && (
            <div
              className='flex gap-2 text-sm px-1 lg:px-2 rounded-lg -translate-y-[100%] py-[0.1rem] lg:py-1 bg-[#fdadb8] text-[#342f23] dark:bg-[#c26d78] rounded-b-none font-kurale font-semibold items-center w-fit absolute right-2 top-0'
            >
              <RxDrawingPinFilled />
              <p>Pinned</p>
            </div>
          )}
          <Image
            width={3255}
            height={2449}
            priority
            src={article.cover.image}
            alt={article.cover.alt}
            className='rounded-lg w-[60rem] aspect-[16/9] object-cover object-center'
          />
          <div className='font-kurale gap-2 flex max-w-[60rem] text-lg font-semibold justify-start w-full flex-wrap mt-4'>
            {article.tags.map((tag) => {
              return (
                <p key={tag} className='hover:underline'>
                  #{tag}
                </p>
              );
            })}
          </div>
        </div>
        <ReactMarkdown className='prose-lg mx-auto max-w-[50rem] break-words font-overpass md:prose-xl prose-headings:mb-4 prose-headings:mt-8 prose-headings:font-kreon prose-headings:font-bold prose-h2:font-extrabold prose-p:my-4 prose-li:list-disc lg:prose-h2:text-4xl'>
          {content}
        </ReactMarkdown>
        <div className='font-kurale gap-2 flex flex-wrap text-lg font-semibold justify-start w-full max-w-[50rem] mx-auto mt-4'>
          {article.tags.map((tag) => {
            return (
              <p key={tag} className='hover:underline'>
                #{tag}
              </p>
            );
          })}
        </div>
        <section
          id='comments'
          className='mx-auto mt-8 max-w-[60rem] border-t px-3 pt-10 dark:border-darkSecondary md:px-8'
        >
          <h2 className='text-center text-2xl md:text-3xl font-kreon font-bold lg:text-4xl'>
            Comments
          </h2>
          <CommentSection article={article} />
        </section>
      </main>
      <Footer />
      <ScrollToComments />
    </>
  );
};
export default SingleArticle;
