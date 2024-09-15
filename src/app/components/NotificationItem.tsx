"use client";
import { useState } from "react";
import { Notification } from "../_firebase/notifications";
import { timeAgo } from "../_lib/accessoryFunctions";
import { useGlobalContext } from "../contexts/AppContext";
import { FaHeart, FaReply, FaComment } from "react-icons/fa";
import { HiBadgeCheck } from "react-icons/hi";
import Link from "next/link";
import { genConfig } from "react-nice-avatar";
import ReactNiceAvatar from "react-nice-avatar";
import { Comment } from "../_firebase/firestore";

interface subNotificationProps {
  displayName: string;
  email: string;
  admin: { email: string };
  content: string;
  timestamp: string;
  articleLink: string;
  reply: Comment | null;
  comment: Comment | null;
  articleTitle: string;
}

const LikeNotificationContent = ({
  displayName,
  email,
  admin,
  content,
  timestamp,
}: subNotificationProps) => {
  return (
    <>
      <div className='justify flex items-center justify-between gap-6 text-[0.9rem] lg:text-[1rem]'>
        <h3>
          <span className='font-semibold'>
            {displayName}{" "}
            {email === admin.email && (
              <HiBadgeCheck className='inline size-4' title='Author' />
            )}
          </span>{" "}
          liked your <span className='font-semibold'>comment</span>:
        </h3>
        <p className='text-xs lg:text-base'>{timeAgo(timestamp, true)}</p>
      </div>
      <p className='border-l-4 pl-4 italic first-letter:capitalize'>
        {content}
      </p>
    </>
  );
};

const ReplyNotificationContent = ({
  displayName,
  email,
  admin,
  content,
  timestamp,
  articleLink,
  reply,
}: subNotificationProps) => {
  return (
    <>
      <div className='justify flex items-center justify-between gap-4 text-sm lg:text-base'>
        <h3>
          <span className='font-semibold'>
            {displayName}{" "}
            {email === admin.email && (
              <HiBadgeCheck className='inline size-4' title='Author' />
            )}
          </span>
          {"  "}
          replied to your <span className='font-semibold'>comment</span>:
        </h3>
        <p className='text-xs lg:text-base'>{timeAgo(timestamp, true)}</p>
      </div>
      <p className='border-l-4 pl-4 italic first-letter:capitalize'>
        {content}
      </p>
      <p className='font-semibold first-letter:capitalize'>
        "{reply?.content}"
      </p>
    </>
  );
};

const NewCommentNotificationContent = ({
  displayName,
  articleTitle,
  timestamp,
  articleLink,
  comment,
}: subNotificationProps) => {
  return (
    <>
      <div className='justify flex gap-2 text-sm md:justify-between lg:text-base'>
        <h3>
          <span className='font-semibold'>{displayName}</span> commented on your
          article:
        </h3>
        <p className='text-xs lg:text-base'>{timeAgo(timestamp, true)}</p>
      </div>
      <p className='border-l-4 pl-4 italic first-letter:capitalize'>
        {articleTitle}
      </p>
      <p className='font-semibold first-letter:capitalize'>
        "{comment?.content}"
      </p>
    </>
  );
};

const NotificationItem = ({
  content,
  reply,
  timestamp,
  type,
  articleTitle,
  articleLink,
  comment,
  currentUser,
}: Notification) => {
  const { admin } = useGlobalContext();
  const [imageError, setImageError] = useState(false);
  const config = genConfig(currentUser?.email);

  return (
    <li>
      <Link
        href={`/blog/${articleLink}#comments`}
        className='flex min-h-[5rem] items-start gap-4 border-y bg-white p-2 shadow-sm dark:border-[#262626] dark:bg-[#262626] md:p-4 lg:rounded-2xl lg:border'
      >
        <div className='relative'>
          {!imageError ? (
            <img
              src={currentUser?.photoURL}
              alt={currentUser?.displayName + "profile picture"}
              className='size-8 rounded-full lg:size-12'
              onError={() => setImageError(true)}
            />
          ) : (
            <ReactNiceAvatar className='size-8 lg:size-12' {...config} />
          )}
          {type === "like" ? (
            <FaHeart className='absolute right-0 top-0 size-5 translate-x-[25%] text-red-500 lg:size-6 dark:text-red-600' />
          ) : type === "reply" ? (
            <FaReply className='absolute right-0 top-0 size-5 translate-x-[25%] text-purple-500 dark:text-purple-600 lg:size-6' />
          ) : (
            <FaComment className='absolute right-0 top-0 size-5 translate-x-[25%] text-blue-300 dark:text-blue-500 lg:size-6' />
          )}
        </div>
        <div className='flex flex-col gap-1 md:w-full'>
          {type === "like" ? (
            <LikeNotificationContent
              displayName={currentUser?.displayName}
              email={currentUser?.email}
              content={content}
              timestamp={timestamp}
              admin={admin}
              articleLink={articleLink}
              articleTitle={articleTitle}
              reply={reply}
              comment={comment}
            />
          ) : type === "reply" ? (
            <ReplyNotificationContent
              displayName={currentUser?.displayName}
              email={currentUser?.email}
              content={content}
              timestamp={timestamp}
              admin={admin}
              articleLink={articleLink}
              articleTitle={articleTitle}
              reply={reply}
              comment={comment}
            />
          ) : (
            <NewCommentNotificationContent
              displayName={currentUser?.displayName}
              email={currentUser?.email}
              content={content}
              timestamp={timestamp}
              admin={admin}
              articleLink={articleLink}
              articleTitle={articleTitle}
              reply={reply}
              comment={comment}
            />
          )}
        </div>
      </Link>
    </li>
  );
};
export default NotificationItem;
