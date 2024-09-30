import Link from "next/link";

const NotFound = () => {
  return (
    <main className='grid h-[80vh] place-items-center'>
      <div className='flex flex-col gap-5 text-center'>
        <h1 className='text-8xl'>404</h1>
        <h2 className='text-2xl font-semibold'>Page Not Found</h2>
        <p className='font-semibold'>
          Sorry, the page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href={"/"}
          className='mx-auto mt-4 w-fit rounded-3xl bg-primary px-12 py-3 font-semibold text-white dark:bg-darkPrimary dark:text-primary'
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
};
export default NotFound;
