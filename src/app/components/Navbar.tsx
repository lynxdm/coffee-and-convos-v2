"use client";
import React, { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { SlNote } from "react-icons/sl";
import { LuBell, LuMoonStar } from "react-icons/lu";
import { CgNotes, CgMenuRight } from "react-icons/cg";
import {
  FaXTwitter,
  FaInstagram,
  FaMedium,
  FaLinkedinIn,
  FaXmark,
} from "react-icons/fa6";
import { BiLogoGmail } from "react-icons/bi";
import { IoIosSunny } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { TbLogin2, TbLogout2 } from "react-icons/tb";
import { useGlobalContext } from "../contexts/AppContext";
import useMenu from "../hooks/useMenu";
import { genConfig } from "react-nice-avatar";
import ReactNiceAvatar from "react-nice-avatar";
import { signUserOut } from "../_firebase/auth";
import Image from "next/image";
import { useWarningContext } from "../contexts/WarningModalContext";

const Navbar = ({ bg }: { bg: string }) => {
  const router = useRouter();
  const {
    currentAdmin: { isAdmin },
    user,
    theme,
    setTheme,
    userNotifications,
  } = useGlobalContext();
  const [imageError, setImageError] = useState(false);
  const { setWarningContent, setIsModalWarningOpen } = useWarningContext();

  const notificationNum = userNotifications.filter(
    (notification: { read: boolean }) => !notification.read && notification
  ).length;

  const sidebarRef = useRef(null);
  const sidebarBtn = useRef(null);

  const { isMenuOpen: isSidebarOpen, setIsMenuOpen: setIsSidebarOpen } =
    useMenu(sidebarBtn, sidebarRef);

  const currentPage = usePathname();

  const userMenu = useRef<HTMLUListElement>(null);
  const userBtn = useRef<HTMLButtonElement>(null);

  const { isMenuOpen, setIsMenuOpen } = useMenu(userBtn, userMenu);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsSidebarOpen(false);
  }, [currentPage, setIsMenuOpen, setIsSidebarOpen]);

  const config = genConfig(user?.email);

  return (
    <>
      <nav
        className={`z-20 flex w-full items-center justify-between ${
          bg ? `bg-[${bg}]` : "bg-none"
        } px-6 py-3 pt-4 text-primary lg:px-32 ${
          currentPage === "/" && "absolute"
        }
        ${
          currentPage === "/notifications" &&
          theme === "light" &&
          "bg-[#f5f5f5]"
        }
        ${
          currentPage === "/notifications/read" &&
          theme === "light" &&
          "bg-[#f5f5f5]"
        }
        ${currentPage === "/new" && "hidden"}
        `}
      >
        <Link
          href={"/"}
          className={`font-kreon text-xl font-semibold lg:text-2xl ${
            currentPage !== "/" && "dark:text-darkPrimary"
          }`}
        >
          Coffee & Convos
        </Link>
        <ul className='flex items-center gap-6 dark:text-darkSecondary'>
          <li className='hidden lg:block'>
            <Link
              href={"/"}
              className={`${currentPage === "/" && "font-bold"}`}
            >
              Home
            </Link>
          </li>
          <li className='hidden lg:block'>
            <Link
              href={"/blog"}
              className={`${currentPage === "/blog" && "font-bold"}`}
            >
              Blog
            </Link>
          </li>
          <li className='hidden lg:block'>
            <Link
              href={"/about"}
              className={`${currentPage === "/about" && "font-bold"}`}
            >
              About
            </Link>
          </li>
          <li className='flex items-center gap-5'>
            <div className='relative'>
              <button
                className='user-menu-btn grid place-items-center'
                type='button'
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                ref={userBtn}
              >
                {user.photoURL ? (
                  !imageError ? (
                    <Image
                      src={user.photoURL}
                      height={100}
                      width={100}
                      alt={user.displayName + " display photo"}
                      className='size-6 rounded-full object-cover lg:size-8'
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <ReactNiceAvatar className='size-6 lg:size-8' {...config} />
                  )
                ) : (
                  <FaUserCircle
                    className={`text-primary size-6 dark:md:text-darkPrimary ${
                      currentPage !== "/" && "dark:text-darkPrimary"
                    }`}
                  />
                )}
              </button>
              <ul
                className={`absolute right-0 top-12 z-50 flex w-[90vw] translate-x-[14%] flex-col gap-y-4 rounded-lg border bg-white px-2 py-4 font-overpass shadow-md *:*:flex *:w-full *:cursor-pointer *:*:items-center *:*:gap-2 *:*:p-2 *:*:capitalize *:capitalize dark:border-[#2c2c2d] dark:bg-darkBg sm:w-80 sm:translate-x-0 lg:w-72 lg:rounded-xl ${
                  isMenuOpen ? "visible" : "invisible"
                }`}
                ref={userMenu}
              >
                <li className='w-full border-b pb-1 text-center text-[1.1rem] font-[500] dark:border-[#3a3a3a]'>
                  {user.displayName}
                </li>
                {isAdmin && (
                  <>
                    <li className='rounded-lg px-2 hover:bg-gray-200 dark:hover:bg-[#262626]'>
                      <Link href={"/new"}>
                        <SlNote className='size-5' />
                        <p>write</p>
                      </Link>
                    </li>
                    <li className='rounded-lg px-2 hover:bg-gray-200 dark:hover:bg-[#262626]'>
                      <Link href={"/drafts"}>
                        <CgNotes className='size-5' />
                        <p>Drafts</p>
                      </Link>
                    </li>
                  </>
                )}
                {user.email && (
                  <li className='rounded-lg px-2 hover:bg-gray-200 dark:hover:bg-[#262626]'>
                    <Link href={"/notifications"}>
                      <div className='relative'>
                        <LuBell className='size-5' />
                        {notificationNum > 0 && (
                          <span className='absolute right-0 top-0 grid size-4 -translate-y-[50%] translate-x-[35%] place-items-center rounded-full bg-blue-700 text-[0.8rem] text-white'>
                            {notificationNum}
                          </span>
                        )}
                      </div>
                      <p>notifications</p>
                    </Link>
                  </li>
                )}
                <li className='rounded-lg px-2 hover:bg-gray-200 dark:hover:bg-[#262626]'>
                  <button
                    className='w-full'
                    onClick={() => {
                      setTheme(theme === "light" ? "dark" : "light");
                    }}
                  >
                    {theme === "light" ? (
                      <LuMoonStar className='size-5' />
                    ) : (
                      <IoIosSunny className='size-5' />
                    )}
                    <p>theme</p>
                  </button>
                </li>
                {user.email ? (
                  <li className='mt-[-0.5rem] cursor-pointer border-t pt-4 *:w-full *:rounded-lg *:px-4 *:hover:bg-gray-200 dark:border-[#3a3a3a] dark:*:hover:bg-[#262626]'>
                    <button
                      type='button'
                      onClick={() => {
                        setWarningContent({
                          proceedText: "Logout",
                          content: "Are you sure you want to log out?",
                          header: "You're about to log out",
                          proceed: () => {
                            signUserOut();
                            router.push("/login");
                          },
                          cancelText: "cancel",
                        });
                        setIsModalWarningOpen(true);
                      }}
                    >
                      <TbLogout2 className='size-5' />
                      <p>logout</p>
                    </button>
                  </li>
                ) : (
                  <li className='rounded-lg px-2 hover:bg-gray-200 dark:hover:bg-[#262626]'>
                    <Link href={"/login"}>
                      <TbLogin2 className='size-5' />
                      <p>Login</p>
                    </Link>
                  </li>
                )}
              </ul>
            </div>
            <button
              className={`text-primary dark:md:text-darkPrimary lg:hidden ${
                currentPage !== "/" && "dark:text-darkPrimary"
              }`}
              ref={sidebarBtn}
              onClick={() => setIsSidebarOpen(true)}
            >
              <CgMenuRight className='size-6' />
            </button>
          </li>
        </ul>
      </nav>
      <aside
        className={`shadow-x fixed right-0 top-0 z-40 h-[100vh] w-[75vw] max-w-[20rem] ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        } bg-[#ffffff6a] py-6 text-primary backdrop-blur-lg transition-transform duration-300 dark:bg-[#000000bd] dark:text-darkSecondary`}
        ref={sidebarRef}
      >
        <button
          className='float-right mr-6 rounded-full p-1 text-primary dark:text-darkPrimary'
          onClick={() => setIsSidebarOpen(false)}
        >
          <FaXmark className='size-6' />
        </button>
        <div className='clear-both mt-16 flex flex-col gap-14'>
          <div className='flex flex-col gap-6 text-xl font-semibold capitalize *:px-4 *:py-5 hover:*:bg-gray-200 dark:hover:*:bg-[#262626]'>
            <Link
              href={"/"}
              className={` ${
                currentPage === "" && "bg-[#00000066] dark:bg-[#ffffff19]"
              }`}
            >
              Home
            </Link>
            <Link
              href={"/about"}
              className={` ${
                currentPage === "about" && "bg-[#00000066] dark:bg-[#ffffff19]"
              }`}
            >
              About
            </Link>
            <Link
              href={"/blog"}
              className={` ${
                currentPage === "blog" && "bg-[#00000066] dark:bg-[#ffffff19]"
              } `}
            >
              Blog
            </Link>
          </div>
          <div className='flex flex-wrap gap-4 px-6 *:*:size-5 *:rounded-full *:p-2 hover:*:bg-gray-200 dark:hover:*:bg-[#262626]'>
            <a
              href='https://www.linkedin.com/in/adefunke-adesegun-526275244?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app'
              target='_blank'
            >
              <FaLinkedinIn />
            </a>
            <a href='https://x.com/fforfunke/' target='_blank'>
              <FaXTwitter />
            </a>
            <a
              href='https://www.instagram.com/thebetawriter?igsh=MWRrdm14NzFpbmpqdQ%3D%3D&utm_source=qr'
              target='_blank'
            >
              <FaInstagram />
            </a>
            <a href='http://medium.com/@fforFunke' target='_blank'>
              <FaMedium />
            </a>
            <a href='mailto:Adesegunfunke16@gmail.com'>
              <BiLogoGmail />
            </a>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Navbar;
