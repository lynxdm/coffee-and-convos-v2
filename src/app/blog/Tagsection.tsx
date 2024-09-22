"use client";
import { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Mousewheel } from "swiper/modules";
import { getTags, Tags } from "../_firebase/firestore";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/mousewheel";
import Link from "next/link";

const Tagsection = () => {
  const [tags, setTags] = useState<Tags[]>([]);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  useEffect(() => {
    getTags()
      .then((result) =>
        setTags(result.sort((a, b) => b.articles.length - a.articles.length))
      )
      .catch((error) =>
        console.error("Error getting tags in blog page:", error)
      );
  }, []);

  useEffect(() => {
    if (prevRef.current && nextRef.current) {
      const swiperInstance = (
        document.querySelector(".swiper-container") as any
      ).swiper;
      if (swiperInstance) {
        swiperInstance.params.navigation.prevEl = prevRef.current;
        swiperInstance.params.navigation.nextEl = nextRef.current;
        swiperInstance.navigation.init();
        swiperInstance.navigation.update();
      }
    }
  }, [tags]);
  return (
    <>
      <section className='mt-7'>
        <div className='flex pt-3 gap-2 overflow-x-scroll w-full scrollbar-none'>
          {/* <Link
              href={"/blog"}
              className='flex transition-[background-color] gap-1 px-3 rounded-lg py-[0.4rem] bg-[#424244] text-white bg-gradient-to-br font-kreon font-[600]'
            >
              <p>All</p>
            </Link> */}
          {tags.map((tag) => {
            return (
              <Link
                href={`/blog?tag=${tag.title}`}
                key={tag.id}
                className='flex hover:bg-primary hover:text-white border-2 border-primary text-primary transition-[background-color_transform] duration-200 gap-1 px-3 rounded-xl py-[0.4rem] bg-[#] bg-gradient-to-br font-kreon font-[600]'
              >
                <p>#{tag.title}</p>
              </Link>
            );
          })}
        </div>
      </section>
      <section className='relative mt-7'>
        <Swiper
          slidesPerView={"auto"}
          modules={[Navigation, Mousewheel]}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          spaceBetween={10}
          freeMode={true}
          mousewheel={true}
          onSlideChange={(swiper) => {
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
        >
          <SwiperSlide className='!w-auto'>
            <Link
              href={`/blog`}
              className='flex hover:bg-primary hover:text-white border-2 border-primary text-primary transition-[background-color_transform] duration-200 gap-1 px-3 rounded-xl py-[0.4rem] bg-[#] bg-gradient-to-br font-kreon font-[600]'
            >
              <p>All</p>
            </Link>
          </SwiperSlide>
          {tags.map((tag) => {
            return (
              <SwiperSlide key={tag.id} className='!w-auto'>
                <Link
                  href={`/blog?tag=${tag.title}`}
                  className='flex hover:bg-primary hover:text-white border-2 border-primary text-primary transition-[background-color_transform] duration-200 gap-1 px-3 rounded-xl py-[0.4rem] bg-[#] bg-gradient-to-br font-kreon font-[600]'
                >
                  <p>#{tag.title}</p>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
        {!isBeginning && (
          <button
            ref={prevRef}
            className='absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-gray-300 rounded-full cursor-pointer'
          >
            {/* Icon for Prev */}
            <svg
              className='h-6 w-6 text-gray-600'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 19l-7-7 7-7'
              />
            </svg>
          </button>
        )}
        {!isEnd && (
          <button
            ref={nextRef}
            className='absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-gray-300 rounded-full cursor-pointer'
          >
            {/* Icon for Next */}
            <svg
              className='h-6 w-6 text-gray-600'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 5l7 7-7 7'
              />
            </svg>
          </button>
        )}
      </section>
    </>
  );
};
export default Tagsection;
