import dynamic from "next/dynamic";
import { db } from "@/app/_firebase/config";
import Footer from "@/app/components/Footer";
import { collection, getDocs, query, where } from "firebase/firestore";
import { timeAgo } from "@/app/_lib/accessoryFunctions";
import ReactMarkdown from "react-markdown";
import { fetchArticleContent } from "@/app/_firebase/storage";
import ArticleOptions from "@/app/blog/components/ArticleOptions";
import CommentSection from "@/app/blog/components/CommentSection";
import Image from "next/image";
import placeholderImg from "@/app/assets/images/placeholder.jpg";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getArticle } from "@/app/_firebase/firestore";
import ShareOptions from "../components/ShareOptions";
import Link from "next/link";

// Dynamically import the ScrollToComments component (client-side only)
const ScrollToComments = dynamic(
  () => import("@/app/blog/components/ScrollToComments"),
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

    const content = await fetchArticleContent(article.id, "articles");

    return {
      title: article.seoTitle || article.title,
      description:
        article.seoDescription ||
        `${content?.slice(0, 100)}... ${
          article.tags.length > 0
            ? `Tagged with ${article.tags.join(", ")}`
            : ""
        }`,
      creator: "Adesegun Adefunke",
      alternates: {
        canonical: article.canonicalUrl || `/blog/${article.publishLink}`,
      },
      twitter: {
        card: "summary_large_image",
        title: article.seoTitle || article.title,
        description:
          article.seoDescription ||
          `${content?.slice(0, 100)}... ${
            article.tags.length > 0
              ? `Tagged with ${article.tags.join(", ")}`
              : ""
          }`,
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
            <ShareOptions {...article} />
            <ArticleOptions article={article} content={content} />
          </div>
        </div>
        <div className='relative grid place-items-center border-primary my-10 mb-2 lg:my-12 lg:mb-6 w-fit mx-auto'>
          <Image
            width={3255}
            height={2449}
            priority
            src={article.cover.image || placeholderImg}
            alt={article.cover.alt}
            className='rounded-lg w-[60rem] aspect-[16/9] object-cover object-center'
          />
        </div>
        <ReactMarkdown className='prose-lg mx-auto max-w-[50rem] break-words font-overpass md:prose-xl prose-headings:mb-4 prose-headings:mt-8 prose-headings:font-kreon prose-headings:font-bold prose-h2:font-extrabold prose-p:my-4 prose-li:list-disc lg:prose-h2:text-4xl'>
          {content}
        </ReactMarkdown>
        <div className='font-kreon gap-3 flex flex-wrap text-lg justify-center w-full max-w-[50rem] mx-auto my-8'>
          {article.tags.map((tag) => {
            return (
              <Link
                href={`/blog?tag=${tag}`}
                key={tag}
                className='hover:bg-[#e1e1e1] dark:text-darkPrimary dark:bg-[#212121] dark:border-[#323232] dark:hover:bg-[#323232] border transition-[background-color] border-[#e1e1e1] p-2 rounded-xl  bg-[#f1f1f1]'
              >
                #{tag}
              </Link>
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
