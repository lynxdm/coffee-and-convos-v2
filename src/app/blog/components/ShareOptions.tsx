"use client";
import { useRef } from "react";
import useMenu from "../../hooks/useMenu";
import {
  FaWhatsapp,
  FaLinkedinIn,
  FaFacebook,
  FaRedditAlien,
  FaXTwitter,
  FaLink,
} from "react-icons/fa6";
import {
  TwitterShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  FacebookShareButton,
  RedditShareButton,
} from "react-share";
import { toast } from "sonner";

const ShareOptions = ({
  title,
  publishLink,
}: {
  title: string;
  publishLink: string;
}) => {
  const shareMenuRef = useRef(null);
  const shareBtnRef = useRef(null);
  const { isMenuOpen, setIsMenuOpen } = useMenu(shareBtnRef, shareMenuRef);

  const copyLink = async () => {
    try {
      const link = `https://coffee-and-convos.vercel.app/blog/${publishLink}`;
      await navigator.clipboard.writeText(link);
      toast.success("Copied link to clipboard");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className='relative'>
      <button
        className='underline underline-offset-2'
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        ref={shareBtnRef}
      >
        Share this post
      </button>
      {isMenuOpen && (
        <div
          className='absolute right-0 top-[110%] z-20 flex w-[13rem] flex-col gap-1 rounded-md border border-gray-200 bg-white p-1.5 shadow-lg *:rounded *:!px-2 *:text-left *:flex *:items-center *:gap-3 *:!py-2 dark:border-[#3a3a3a] dark:bg-darkBg'
          ref={shareMenuRef}
        >
          <button
            className='hover:bg-gray-200 dark:hover:bg-[#262626]'
            onClick={copyLink}
          >
            <FaLink className='size-5 text-primary dark:text-darkPrimary' />
            <p>Copy Link</p>
          </button>
          <TwitterShareButton
            url={`https://coffee-and-convos.vercel.app/blog/${publishLink}`}
            title={title}
            className='hover:!bg-gray-200 dark:hover:!bg-[#262626]'
          >
            <FaXTwitter className='size-5 text-primary dark:text-darkPrimary' />
            <p>Share to X</p>
          </TwitterShareButton>
          <WhatsappShareButton
            url={`https://coffee-and-convos.vercel.app/blog/${publishLink}`}
            title={title}
            className='hover:!bg-gray-200 dark:hover:!bg-[#262626]'
          >
            <FaWhatsapp className='size-5 text-primary dark:text-darkPrimary' />
            <p>Share to Whatsapp</p>
          </WhatsappShareButton>
          <FacebookShareButton
            url={`https://coffee-and-convos.vercel.app/blog/${publishLink}`}
            title={title}
            className='hover:!bg-gray-200 dark:hover:!bg-[#262626]'
          >
            <FaFacebook className='size-5 text-primary dark:text-darkPrimary' />
            <p>Share to Facebook</p>
          </FacebookShareButton>
          <LinkedinShareButton
            url={`https://coffee-and-convos.vercel.app/blog/${publishLink}`}
            source={`https://coffee-and-convos.vercel.app/blog/${publishLink}`}
            title={title}
            className='hover:!bg-gray-200 dark:hover:!bg-[#262626]'
          >
            <FaLinkedinIn className='size-5 text-primary dark:text-darkPrimary' />
            <p>Share to Linkedin</p>
          </LinkedinShareButton>
          <RedditShareButton
            url={`https://coffee-and-convos.vercel.app/blog/${publishLink}`}
            title={title}
            className='hover:!bg-gray-200 dark:hover:!bg-[#262626]'
          >
            <FaRedditAlien className='size-5 text-primary dark:text-darkPrimary' />
            <p>Share to Reddit</p>
          </RedditShareButton>
        </div>
      )}
    </div>
  );
};
export default ShareOptions;
