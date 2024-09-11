import aboutImg from "../assets/images/about_img.jpg";
import Link from "next/link";
import Footer from "../components/Footer";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import Image from "next/image";

const About = () => {
  return (
    <>
      <main className='px:6 lg:px-32 my-12'>
        <h1 className='mx-auto mb-0 mt-4 hidden text-center text-2xl font-semibold xl:block lg:text-5xl font-kreon'>
          About Coffee & Convos
        </h1>
        <div className='my-[3em] flex flex-col items-center justify-center lg:gap-[10rem] gap-20 px-6 xl:my-[4rem] xl:mb-[8rem] xl:flex-row xl:px-0'>
          <div className='relative aspect-square h-[18rem] border -translate-x-4 dark:bg-[#c26d78] bg-[#fdadb8] after:absolute after:right-0 after:top-[80%] after:hidden after:w-[10rem] after:translate-x-[80%] after:border after:border-primary lg:h-[30rem] xl:after:block border-primary lg:border-none'>
            <Image
              src={aboutImg}
              alt='a picture of three coffee mugs'
              placeholder='blur'
              width={4345}
              height={4325}
              priority
              className='absolute left-[2rem] top-[2rem] aspect-square h-[18rem] object-cover object-center lg:left-[3rem] lg:top-[3rem] lg:h-[30rem] border border-primary lg:border-none'
            />
          </div>
          <section className='max-w-[30rem]'>
            <h1 className='mb-3 text-2xl lg:text-3xl font-extrabold font-kreon xl:hidden'>
              About Coffee & Convos
            </h1>
            <article className='prose dark:text-darkSecondary mx-auto lg:prose-xl lg:max-w-full'>
              <p>
                Welcome to Coffee & Convos, a blog dedicated to exploring the
                world of research and writing with a dose of coffee and
                conversations. Here, you'll find interesting articles, essays,
                and stories that will help you to expand your knowledge on
                various topics.
              </p>
              <p>
                I'm also called the Beta Writer and I'm passionate about
                research and writing. I'm always looking for new and innovative
                ways to push my boundaries and create content that's both
                informative and entertaining. I'm here to share my love of
                coffee, conversation, and writing with the world. So come join
                me and let's explore the world together.
              </p>
            </article>
            <Link
              href={"/blog"}
              className='flex items-center justify-end gap-3 lg:mt-2 mt-4'
            >
              <p className='font-overpass text-lg font-semibold'>View blog</p>
              <HiOutlineArrowNarrowRight className='size-6' />
            </Link>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};
export default About;
