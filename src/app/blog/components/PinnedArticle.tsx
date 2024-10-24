import { Doc } from "../../_firebase/firestore";
import { FiArrowUpRight } from "react-icons/fi";
import { RxDrawingPinFilled } from "react-icons/rx";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import Image from "next/image";
import { formatLink, timeAgo } from "../../_lib/accessoryFunctions";
import Skeleton from "react-loading-skeleton";

const PinnedArticle = ({
  pinnedArticle,
  previewContent,
}: {
  pinnedArticle: Doc;
  previewContent: string | undefined;
}) => {
  return (
    <section className='mt-8 flex flex-col justify-between items-center gap-4 border-b-2 border-primary pb-4 dark:border-[#3a3a3a] lg:flex-row lg:gap-8 lg:border-2 lg:pb-0'>
      <Link
        href={`/blog/${formatLink(pinnedArticle.title)}`}
        className='relative h-full w-full max-w-[40rem] aspect-[2/1.5] md:aspect-[2/1.2] lg:aspect-[1/1] xl:aspect-[2/1.8] lg:w-[60%] xl:w-[55%]'
      >
        <Image
          src={pinnedArticle.cover.image}
          alt={pinnedArticle.title + "cover image"}
          className='object-cover object-center'
          fill
          priority
        />
      </Link>

      <div className='flex flex-col gap-4 border-primary px-3 py-4 xl:py-8 dark:border-[#3a3a3a] lg:gap-4 lg:px-0 lg:w-[40%] xl:w-[60%]'>
        <Link
          href={`/blog/${formatLink(pinnedArticle.title)}`}
          className='flex items-start gap-3 border-primary pr-2 hover:text-gray-600 dark:border-[#3a3a3a] dark:hover:text-gray-400 lg:border-b lg:pb-3'
        >
          <h2 className='lg:max-w-[92%] max-w-[90%] font-kreon text-3xl font-extrabold xl:text-4xl'>
            {pinnedArticle.title}
          </h2>
          <FiArrowUpRight className='size-6' />
        </Link>

        {previewContent ? (
          <Link href={`/blog/${formatLink(pinnedArticle.title)}`}>
            <ReactMarkdown className='prose line-clamp-6 pr-2 prose-headings:hidden prose-p:my-0 prose-img:hidden dark:text-darkSecondary lg:line-clamp-5 lg:leading-8 xl:max-w-[41rem] min-[1600px]:prose-lg min-[1600px]:max-w-[60rem]'>
              {previewContent}
            </ReactMarkdown>
          </Link>
        ) : (
          <Skeleton width='100%' count={5} className='leading-8' />
        )}

        <div className='font-kreon gap-2 flex flex-wrap text-lg font-semibold justify-start w-full mx-auto -mt-2'>
          {pinnedArticle.tags.map((tag) => {
            return (
              <Link
                href={`/blog?tag=${tag}`}
                className='hover:bg-[#e1e1e1] border transition-[background-color] dark:text-darkPrimary dark:bg-[#212121] dark:border-[#323232] dark:hover:bg-[#323232] border-[#e1e1e1] px-2 py-1 rounded-xl bg-[#f1f1f1]'
                key={tag}
              >
                #{tag}
              </Link>
            );
          })}
        </div>

        <div className='flex flex-col justify-center gap-1'>
          <div className='flex items-start gap-1 text-pink-700'>
            <RxDrawingPinFilled className='lg:size-5' />
            <p className='self-end font-bold'>Pinned</p>
          </div>
          <p>{timeAgo(pinnedArticle.date, false)}</p>
        </div>
      </div>
    </section>
  );
};
export default PinnedArticle;
