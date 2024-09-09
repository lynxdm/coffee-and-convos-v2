"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Timestamp } from "firebase/firestore";
import { fetchArticleContent } from "../_firebase/storage";
import { timeAgo, formatLink } from "../accessoryFunctions";

const ArticleCard = ({
  title,
  cover,
  date,
  id,
  type,
}: {
  title: string;
  cover: { alt: string; image: string };
  date: string;
  id: string;
  type: string;
}) => {
  const router = useRouter();
  const [content, setContent] = useState("");

  useEffect(() => {
    fetchArticleContent(id, type).then((result) => {
      if (result) setContent(result);
    });
  }, []);

  const handleEditing = () => {
    let articleDraft = {
      coverImg: cover.image,
      title: title,
      content: content,
      details: { type: "drafts", id: id },
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
          <ReactMarkdown
            children={content}
            className='prose line-clamp-3 leading-loose prose-headings:hidden prose-p:my-0 prose-img:hidden dark:text-darkSecondary'
          />
        </li>
      </ul>
    );
  }
};
export default ArticleCard;
