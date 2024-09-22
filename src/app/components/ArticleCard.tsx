"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchArticleContent } from "../_firebase/storage";
import { timeAgo, formatLink } from "../_lib/accessoryFunctions";
import { ArticleDraft, Doc } from "../_firebase/firestore";

const ArticleCard = ({ type, article }: { type: string; article: Doc }) => {
  const {
    title,
    cover,
    date,
    id,
    canonicalUrl,
    seoDescription,
    seoTitle,
    tags,
  } = article;
  const router = useRouter();
  const [content, setContent] = useState("");

  useEffect(() => {
    fetchArticleContent(id, type).then((result) => {
      if (result) setContent(result);
    });
  }, [id, type]);

  const handleEditing = () => {
    const articleDraft: ArticleDraft = {
      coverImg: cover.image,
      title: title,
      content: content,
      details: { type: "drafts", id: id },
      canonicalUrl,
      seoDescription,
      seoTitle,
      selectedTags: tags,
      publishDate: "",
    };

    localStorage.setItem("articleDraft", JSON.stringify(articleDraft));
    router.push("/new");
  };

  if (content) {
    return (
      <ul
        className='border-2 border-primary py-3 dark:border-[#3a3a3a]'
        key={id}
      >
        <li className='flex items-center justify-between border-b-2 border-primary px-2 pb-2 dark:border-[#3a3a3a] dark:text-darkSecondary'>
          <p className='text-sm font-semibold capitalize'>
            {timeAgo(date, false)}
          </p>
          {type === "articles" ? (
            <Link
              href={`/blog/${formatLink(title)}`}
              className='flex w-fit items-center gap-1 self-end lg:gap-2'
            >
              <p className='lg:text-md text-sm font-semibold'>Read</p>
              <HiOutlineArrowNarrowRight className='lg:size-5' />
            </Link>
          ) : (
            <button
              className='flex w-fit items-center gap-2 self-end'
              onClick={handleEditing}
            >
              <p className='font-semibold'>Edit</p>
              <HiOutlineArrowNarrowRight className='size-5' />
            </button>
          )}
        </li>
        <li>
          <Link
            href={`/blog/${formatLink(title)}`}
            className='block px-3 py-4 pb-2 hover:text-gray-600 dark:hover:text-gray-400 md:min-h-24 lg:min-h-28 lg:px-5'
          >
            <h3 className='font-kreon text-2xl font-semibold'>{title}</h3>
          </Link>
        </li>
        <li className='border-y border-primary relative dark:border-[#3a3a3a] aspect-[16/7] md:aspect-[3/1.5]'>
          <Image
            fill
            className='aspect-[16/7] object-cover object-center md:aspect-[3/1.5]'
            src={cover.image}
            alt={cover.alt}
          />
        </li>
        <li className='mt-6 px-2'>
          <ReactMarkdown className='prose line-clamp-3 leading-loose prose-headings:hidden prose-p:my-0 prose-img:hidden dark:text-darkSecondary'>
            {content}
          </ReactMarkdown>
        </li>
        {type !== "drafts" && (
          <li className='px-2 mt-1'>
            <div className='text-md flex gap-2 flex-wrap font-semibold font-kreon text-start'>
              {article.tags.slice(0, 3).map((tag) => {
                return (
                  <Link
                    href={`/blog?tag=${tag}`}
                    className='hover:bg-[#e1e1e1] border transition-[background-color] dark:text-darkPrimary dark:bg-[#212121] dark:border-[#323232] dark:hover:bg-[#323232] border-[#e1e1e1] px-2 py-1   rounded-xl  bg-[#f1f1f1]'
                    key={tag}
                  >
                    #{tag}
                  </Link>
                );
              })}
            </div>
          </li>
        )}
      </ul>
    );
  }
};
export default ArticleCard;
