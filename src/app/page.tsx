import Image from "next/image";
import { getArticles } from "./_firebase/firestore";
import { collection, limit, orderBy, query } from "firebase/firestore";
import { db } from "./_firebase/config";
import {
  FaXTwitter,
  FaInstagram,
  FaMedium,
  FaLinkedinIn,
} from "react-icons/fa6";
import { BiLogoGmail } from "react-icons/bi";
import Link from "next/link";
import authorHero from "@/app/assets/images/author_hero.jpg";
import heroImg from "@/app/assets/images/hero.jpg";
import ArticleCard from "./components/ArticleCard";
import Footer from "./components/Footer";

export default async function Home() {
  const articles = await getArticles(
    query(collection(db, "articles"), orderBy("date", "desc"), limit(6))
  );

  return (
    <>
      <main>
        <section className='relative grid h-fit place-items-center px-12 md:mb-20 lg:mb-0 lg:px-32'>
          <div className='absolute left-0 top-0 -z-10 aspect-[2/1.5] w-full md:aspect-[1/1.1] md:w-[50%] md:max-w-[30rem] lg:bottom-0 lg:aspect-[16/13] lg:w-[51%] lg:max-w-full'>
            <Image
              src={heroImg}
              alt='hero image'
              width={6000}
              height={4000}
              priority
              placeholder='blur'
              className='aspect-[2/1.5] h-[18rem] md:h-[26rem] xl:h-[38rem] lg:h-[28rem] w-full object-cover md:aspect-[1/1.1] lg:aspect-[16/13] lg:max-w-full'
            />
          </div>
          <article className='lg:mt-31 mb-12 mt-32 flex flex-col items-center gap-7 md:ml-[5rem] md:mt-28 md:flex-row md:gap-12 lg:mb-0 lg:ml-[9rem] lg:gap-12 xl:ml-[10rem] xl:gap-24'>
            <div className='relative aspect-square size-[14rem] before:absolute before:top-[5%] before:h-[90%] before:w-0 before:-translate-x-[1000%] before:border before:border-black dark:before:border-[#3a3a3a] md:size-[16rem] lg:size-[18rem] xl:size-[28rem]'>
              <Image
                src={authorHero}
                className='aspect-square'
                fill
                placeholder='blur'
                priority
                alt='A photo of the author, Adefunke'
              />
            </div>
            <div className='ml-6 flex flex-col gap-2 *:text-left *:uppercase md:ml-0 md:*:max-w-[12rem] xl:*:max-w-full md:*:text-left lg:*:w-full lg:*:max-w-[18rem] lg:*:text-left'>
              <h1 className='relative w-fit self-auto text-2xl font-bold before:absolute before:top-[50%] before:h-0 before:w-[10rem] before:-translate-x-[110%] before:-translate-y-[100%] before:border before:border-primary dark:before:border-[#3a3a3a] md:before:w-[5rem] xl:before:w-[10rem] xl:text-4xl'>
                Hello!
              </h1>
              <h1 className='text-2xl font-bold lg:ml-0 xl:text-4xl'>
                I am Adefunke,
              </h1>
              <p className='text-right text-base font-semibold lg:ml-0 lg:text-left xl:text-xl'>
                A creative, content & technical writer{" "}
              </p>
              <ul className='mt-5 hidden gap-5 lg:flex'>
                <li>
                  <FaLinkedinIn />
                </li>
                <li>
                  <FaXTwitter />
                </li>
                <li>
                  <FaInstagram />
                </li>
                <li>
                  <FaMedium />
                </li>
                <li>
                  <BiLogoGmail />
                </li>
              </ul>
            </div>
          </article>
        </section>
        <section className='mt-12 flex flex-col px-6 lg:mt-24 lg:px-32'>
          <div className='mb-8 flex items-center justify-between'>
            <h1 className='relative py-1.5 text-lg font-semibold after:absolute after:bottom-0 after:left-0 after:w-[60%] after:border after:border-primary dark:after:border-darkSecondary lg:text-2xl'>
              Latest posts
            </h1>
            <Link
              href={"/blog"}
              className='border-2 border-primary px-6 py-2 text-xs font-semibold text-primary hover:text-primary dark:border-darkSecondary dark:text-darkSecondary lg:px-10 lg:text-sm'
            >
              SEE ALL
            </Link>
          </div>
          <article className='grid gap-12 md:grid-cols-2 md:gap-10 xl:grid-cols-3'>
            {articles?.map((article) => {
              return (
                <ArticleCard {...article} key={article.id} type='articles' />
              );
            })}
          </article>
          <Link
            href={"/blog"}
            className='mx-auto mb-8 mt-20 grid w-fit place-items-center border-2 border-primary px-5 py-3 text-[13px] font-semibold text-primary hover:text-primary dark:border-darkSecondary dark:text-darkSecondary lg:px-9 lg:py-3.5 lg:text-[14px]'
          >
            LOAD MORE
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
