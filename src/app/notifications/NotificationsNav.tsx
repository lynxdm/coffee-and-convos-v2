"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NotificationsNav = () => {
  const currentPath = usePathname();

  const [page, setPage] = useState("new");

  useEffect(() => {
    if (currentPath !== "/notifications") setPage("read");
  }, [currentPath]);

  return (
    <nav className='mx-auto flex w-fit justify-center rounded-3xl border bg-gray-200 *:rounded-3xl *:border-gray-300 *:px-10 *:py-1.5 dark:border-[#111112] dark:bg-[#111112] lg:*:text-lg'>
      <Link
        href={"/notifications"}
        className={`${
          page === "new"
            ? "bg-white text-primary dark:bg-[#262626] dark:text-darkPrimary"
            : "text-[#666667]"
        }`}
      >
        New
      </Link>
      <Link
        href={"/notifications/read"}
        className={`${
          page === "read"
            ? "bg-white text-primary dark:bg-[#262626] dark:text-darkPrimary"
            : "text-[#666667]"
        }`}
      >
        Read
      </Link>
    </nav>
  );
};
export default NotificationsNav;
