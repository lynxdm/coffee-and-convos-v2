"use client";
import {
  useState,
  useEffect,
  ChangeEvent,
  useRef,
  SetStateAction,
  Dispatch,
} from "react";
import { ArticleDraft, Tags } from "../_firebase/firestore";
import useMenu from "../hooks/useMenu";
import { FaXmark } from "react-icons/fa6";
import useTextarea from "../hooks/useTextarea";

const PostOptions = ({
  tags,
  articleDraft,
  setArticleDraft,
  handleChange,
  handlePublishing,
}: {
  tags: Tags[];
  articleDraft: ArticleDraft;
  setArticleDraft: Dispatch<SetStateAction<ArticleDraft>>;
  handleChange: (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
  handlePublishing: (type: string) => void;
}) => {
  const [tagSearch, setTagSearch] = useState("");
  const [filterTags, setFilterTags] = useState<Tags[]>([]);

  const tagInput = useRef<HTMLInputElement>(null);
  const filteredSearchTags = useRef<HTMLDivElement>(null);
  const { isMenuOpen: isTagInputFocused, setIsMenuOpen: setIsTagInputFocused } =
    useMenu(tagInput, filteredSearchTags);

  const publishMenu = useRef<HTMLDivElement>(null);
  const publishBtn = useRef<HTMLButtonElement>(null);

  const { isMenuOpen: isPublishing, setIsMenuOpen: setIsPublishing } = useMenu(
    publishBtn,
    publishMenu
  );

  useEffect(() => {
    if (tags.length > 0) setFilterTags(tags);
  }, [tags]);

  useEffect(() => {
    if (tagSearch) {
      const filteredTags = tags.filter((tag) =>
        tag.title.startsWith(tagSearch)
      );
      if (filteredTags.length > 0) setFilterTags(filteredTags);
      else setFilterTags([{ title: tagSearch, id: "", articles: [] }]);
    } else {
      setFilterTags(tags);
    }
  }, [tagSearch]);

  const seoTitleRef = useRef(null);
  const seoDescriptionRef = useRef(null);
  useTextarea(seoTitleRef, articleDraft.seoTitle, "70px");
  useTextarea(seoDescriptionRef, articleDraft.seoDescription, "70px");

  return (
    <div className='relative'>
      <button
        className='bg-blue-700 font-semibold text-white rounded-md px-4 py-[0.4rem] hover:bg-blue-800'
        onClick={() => setIsPublishing(!isPublishing)}
        ref={publishBtn}
      >
        Publish
      </button>
      <div
        ref={publishMenu}
        className={`absolute border shadow-md flex-col gap-2 bg-white top-0 left-0 -translate-y-[102%] rounded-lg w-[25rem] p-4 [&_div_label]:font-inter [&_div_label]:text- [&_div_label]:font-semibold [&_div]:flex [&_div]:flex-col [&_div]:gap-[0.25rem] [&_div_input]:border [&_div_input]:rounded-md [&_div_input]:p-2 [&_div_textarea]:border [&_div_textarea]:rounded-md [&_div_textarea]:p-2 ${
          isPublishing ? "flex" : "hidden"
        }`}
      >
        <h3 className='text-xl font-bold font-inter mb-4'>Post options</h3>
        <div>
          <label htmlFor='tags'>Select tags</label>
          <ul className='flex gap-2 flex-wrap'>
            {articleDraft.selectedTags.map((tag, index) => {
              return (
                <li
                  key={index}
                  className='flex rounded px-1 gap-2 py-[0.3rem] bg-[#6f727518]'
                >
                  <p className='text-gray-600'>#{tag}</p>
                  <button className='hover:*:text-[#df1919]'>
                    <FaXmark className='size-5' />
                  </button>
                </li>
              );
            })}
          </ul>
          <div className='relative'>
            <input
              type='text'
              name='tags'
              id='tags'
              ref={tagInput}
              value={tagSearch}
              onClick={() => setIsTagInputFocused(true)}
              onChange={(e) => setTagSearch(e.target.value)}
              placeholder='Start typing to search'
            />
            {isTagInputFocused && (
              <div
                className='max-h-[15rem] absolute bottom-0 translate-y-[102%] w-full bg-white border overflow-y-scroll rounded-lg  scrollbar-thin shadow-lg'
                ref={filteredSearchTags}
              >
                {!tagSearch && (
                  <div>
                    <h4 className='text-lg mx-2 font-inter font-bold px-2 py-4 border-b'>
                      Previous Tags
                    </h4>
                  </div>
                )}
                {filterTags.map((tag) => {
                  return (
                    <button
                      key={tag.title}
                      onClick={() => {
                        setArticleDraft({
                          ...articleDraft,
                          selectedTags: [
                            ...articleDraft.selectedTags,
                            tag.title,
                          ],
                        });
                        setTagSearch("");
                        tagInput.current?.focus();
                      }}
                      className='flex p-2 items-start flex-col gap-1 hover:bg-[#888b8e26] [&_.font-semibold]:text-[#2525b8]'
                    >
                      <p className='font-semibold'>#{tag.title}</p>
                      {tag?.articles?.length > 0 && (
                        <p className='text-sm'>
                          {tag.articles.length}{" "}
                          {tag.articles.length > 1 ? "articles" : "article"}
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <div>
          <label htmlFor='seoTitle'>SEO title</label>
          <textarea
            name='seoTitle'
            id='seoTitle'
            ref={seoTitleRef}
            value={articleDraft.seoTitle}
            className='resize-none w-full overflow-hidden'
            onChange={handleChange}
            placeholder='Enter meta title'
          />
        </div>
        <div>
          <label htmlFor='seoDescription'>SEO description</label>
          <textarea
            name='seoDescription'
            id='seoDescription'
            ref={seoDescriptionRef}
            onChange={handleChange}
            value={articleDraft.seoDescription}
            className='resize-none w-full overflow-hidden'
            placeholder='Enter meta description'
          />
        </div>
        <div>
          <label htmlFor='canonicalUrl'>Canonical URL</label>
          <p className='text-md text-gray-500 -mt-1'>
            Change <code>canonical_url</code> meta tag if this article was first
            published elsewhere
          </p>
          <input
            type='url'
            name='canonicalUrl'
            id='canonicalUrl'
            onChange={handleChange}
            placeholder='Enter original url'
          />
        </div>
        <button
          className='w-full py-[0.5rem] rounded-md bg-blue-700 text-white font-semibold hover:bg-blue-800 mt-6'
          onClick={() => {
            setIsPublishing(false);
            handlePublishing("articles");
          }}
        >
          Proceed
        </button>
      </div>
    </div>
  );
};
export default PostOptions;
