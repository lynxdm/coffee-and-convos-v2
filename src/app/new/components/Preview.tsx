"use client";
import remarkGfm from "remark-gfm";
import { ArticleDraft } from "../../_firebase/firestore";
import ReactMarkdown from "react-markdown";

const Preview = ({ articleDraft }: { articleDraft: ArticleDraft }) => {
  const { content, coverImg, title } = articleDraft;

  return (
    <article className='p-6 lg:p-10'>
      <h1 className='mx-auto max-w-[50rem] text-center font-kreon text-3xl font-bold leading-10 lg:mb-8 lg:text-6xl lg:leading-[5rem]'>
        {title}
      </h1>
      <div className='relative grid place-items-center border-primary py-8 pb-4 lg:py-12 lg:pb-8'>
        {coverImg && (
          <img
            src={coverImg}
            alt={title + "cover image"}
            className='aspect-[16/9] w-[60rem] rounded-lg object-cover object-center'
          />
        )}
      </div>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        className='markdown-styles'
      >
        {content}
      </ReactMarkdown>
    </article>
  );
};
export default Preview;
