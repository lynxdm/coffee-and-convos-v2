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
  const [displayedTags, setDisplayedTags] = useState<Tags[]>([]);

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
    if (tags.length > 0) {
      if (articleDraft.selectedTags.length > 0) {
        const newTags = articleDraft.selectedTags.reduce((acc, item) => {
          return acc.filter((tag: Tags) => tag.title !== item);
        }, tags);
        setDisplayedTags(newTags);
      } else {
        setDisplayedTags(tags);
      }
    }
  }, [tags, articleDraft.selectedTags]);

  useEffect(() => {
    if (tagSearch) {
      const filteredTags = displayedTags.filter((tag) =>
        tag.title.startsWith(tagSearch)
      );
      if (filteredTags.length > 0) setFilterTags(filteredTags);
      else setFilterTags([{ title: tagSearch, id: "", articles: [] }]);
    } else {
      setFilterTags(displayedTags);
    }
  }, [displayedTags, tagSearch]);

  const seoTitleRef = useRef(null);
  const seoDescriptionRef = useRef(null);
  useTextarea(seoTitleRef, articleDraft.seoTitle, "70px");
  useTextarea(seoDescriptionRef, articleDraft.seoDescription, "70px");

  const handleClearTag = (tag: string) => {
    const newTag = tags.find((item) => item.title === tag) ?? {
      title: tag,
      articles: [],
      id: "",
    };

    const newDisplayedTags = [...displayedTags, newTag];
    setDisplayedTags(
      newDisplayedTags.sort((a, b) => a.title.localeCompare(b.title))
    );

    const newTags = articleDraft.selectedTags.filter((item) => item !== tag);
    setArticleDraft({
      ...articleDraft,
      selectedTags: newTags,
    });
  };

  return (
    <div className='relative'>
      <button
        className='bg-blue-700 dark:bg-blue-800 dark:hover:bg-blue-700 font-semibold text-white rounded-md px-4 py-[0.4rem] hover:bg-blue-800'
        onClick={() => setIsPublishing(!isPublishing)}
        ref={publishBtn}
      >
        Publish
      </button>
      <div
        ref={publishMenu}
        className={`post-options scrollbar-thin shadow-lg dark:border-[#3a3a3a] dark:scrollbar-track-[#232425]  dark:scrollbar-thumb-[#535253] w-[93vw] max-w-[25rem]
          ${
            articleDraft.selectedTags.length > 3 &&
            "max-h-[40rem] overflow-y-scroll"
          }
           ${isPublishing ? "flex" : "hidden"} post-options-dark`}
      >
        <h3 className='text-xl font-bold font-inter mb-4'>Post options</h3>
        <div>
          <label htmlFor='tags' className='post-options-label-style'>
            Select tags
          </label>
          <ul className='flex gap-2 flex-wrap'>
            {articleDraft.selectedTags.map((tag, index) => {
              return (
                <li
                  key={index}
                  className='flex rounded px-1 dark:bg-[#171770b6] gap-2 py-[0.3rem] bg-[#6f727518]'
                >
                  <p className='text-gray-600 dark:text-[#eaeaea]'>#{tag}</p>
                  <button
                    className='hover:*:text-[#df1919]'
                    onClick={() => handleClearTag(tag)}
                  >
                    <FaXmark className='size-5 dark:text-[#eaeaea]' />
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
              className='post-options-input-style'
            />
            {isTagInputFocused && (
              <div
                className='max-h-[15rem] absolute bottom-0 translate-y-[103%] w-full bg-white border dark:bg-[#090909] overflow-y-scroll rounded-lg  scrollbar-thin shadow-lg dark:border-[#3a3a3a] dark:scrollbar-track-[#232425] dark:scrollbar-thumb-[#535253]'
                ref={filteredSearchTags}
              >
                {!tagSearch && (
                  <div>
                    <h4 className='text-lg mx-2 font-inter font-bold px-2 py-4 border-b dark:border-[#3a3a3a]'>
                      Previous Tags
                    </h4>
                  </div>
                )}
                {filterTags.map((tag) => {
                  return (
                    <button
                      key={tag.title}
                      onClick={() => {
                        setDisplayedTags(
                          displayedTags.filter(
                            (item) => item.title !== tag.title
                          )
                        );
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
                      className='flex p-2 items-start flex-col gap-1 hover:bg-[#888b8e26] [&_.font-semibold]:text-[#2525b8] dark:hover:bg-[#1717702f]'
                    >
                      <p className='font-semibold'>#{tag.title}</p>
                      {tag?.articles?.length > 0 && (
                        <p className='text-sm dark:text-[#7a7a7b]'>
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
          <label htmlFor='seoTitle' className='post-options-label-style'>
            SEO title
          </label>
          <textarea
            name='seoTitle'
            id='seoTitle'
            ref={seoTitleRef}
            value={articleDraft.seoTitle}
            className='post-options-textarea-style resize-none w-full overflow-hidden'
            onChange={handleChange}
            placeholder='Enter meta title'
          />
        </div>
        <div>
          <label htmlFor='seoDescription' className='post-options-label-style'>
            SEO description
          </label>
          <textarea
            name='seoDescription'
            id='seoDescription'
            ref={seoDescriptionRef}
            onChange={handleChange}
            value={articleDraft.seoDescription}
            className='post-options-textarea-style resize-none w-full overflow-hidden'
            placeholder='Enter meta description'
          />
        </div>
        <div>
          <label htmlFor='canonicalUrl' className='post-options-label-style'>
            Canonical URL
          </label>
          <p className='text-md text-gray-500 dark:text-white -mt-1'>
            Change <code>canonical_url</code> meta tag if this article was first
            published elsewhere
          </p>
          <input
            type='url'
            name='canonicalUrl'
            id='canonicalUrl'
            onChange={handleChange}
            placeholder='Enter original url'
            className='post-options-input-style'
          />
        </div>
        <button
          className='w-full py-[0.5rem] rounded-md bg-blue-700 text-white font-semibold hover:bg-blue-800 dark:bg-[#2a2a7dcb] dark:hover:bg-blue-800 mt-4'
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
