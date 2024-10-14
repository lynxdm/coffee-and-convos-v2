"use client";
import { useEffect, useState, useRef, FormEvent, ChangeEvent } from "react";
import {
  addComment,
  Doc,
  getComments,
  Comment,
} from "../../_firebase/firestore";
import useTextarea from "../../hooks/useTextarea";
import { genConfig } from "react-nice-avatar";
import ReactNiceAvatar from "react-nice-avatar";
import CommentItem from "./CommentItem";
import { FaUserCircle } from "react-icons/fa";
import { v4 } from "uuid";
import { ScaleLoader } from "react-spinners";
import Link from "next/link";
import { useGlobalContext } from "../../contexts/AppContext";
import { sendAdminNotification } from "../../_firebase/notifications";
import Image from "next/image";

const CommentSection = ({ article }: { article: Doc }) => {
  const { user, admins } = useGlobalContext();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const updateComments = async () => {
    const newComments = await getComments(article.id);
    if (newComments) setComments(newComments);
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(e.target.value);
  };

  const newCommentRef = useRef(null);
  useTextarea(newCommentRef, newComment, "70px");

  useEffect(() => {
    updateComments();
  }, []);

  const handleAddComment = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    addComment(article.id, newComment, user)
      .then((result) => {
        if (result instanceof Error) {
          console.error("Failed to add comment:", result.message);
          setIsLoading(false);
          return;
        }

        updateComments();
        setIsLoading(false);
        setNewComment("");

        sendAdminNotification(
          "new_comment",
          result,
          article.id,
          user,
          article.publishLink,
          article.title,
          admins[0]
        );
      })
      .catch((error: ErrorCallback) => {
        console.error("Error adding comment:", error);
        setIsLoading(false);
      });
  };

  const config = genConfig(user.email);

  return (
    <>
      <div className='mt-7 flex items-start gap-3'>
        {user.photoURL ? (
          !imageError ? (
            <Image
              src={user.photoURL}
              alt={user.displayName + " display photo"}
              height={150}
              width={150}
              className='size-8 rounded-full object-cover object-center'
              onError={() => setImageError(true)}
            />
          ) : (
            <ReactNiceAvatar className='size-8' {...config} />
          )
        ) : (
          <FaUserCircle className='size-8' />
        )}
        <form className='w-full' onSubmit={handleAddComment}>
          <textarea
            name='newComment'
            id='newComment'
            ref={newCommentRef}
            placeholder='What are you thinking?'
            className='peer h-[30rem] w-full resize-none overflow-hidden rounded-md border-2 border-[#3e3b3b] p-2 focus:outline-none dark:bg-[#101011] dark:placeholder:text-[#61626d]'
            value={newComment}
            onChange={handleChange}
          />
          {newComment.length > 0 && (
            <div className='transition-[height 1ms ease] mt-1 flex gap-3'>
              {isLoading ? (
                <div className='flex items-center gap-2 rounded-md bg-[#3e3b3b] px-4 py-2 text-white'>
                  <ScaleLoader
                    color='rgba(256, 256, 256, 1)'
                    height={12}
                    radius={5}
                    width={2}
                  />
                  <p>Posting...</p>
                </div>
              ) : user.email ? (
                <button
                  className='rounded-md bg-[#3e3b3b] px-4 py-2 text-white hover:bg-[#343432]'
                  type='submit'
                >
                  Post
                </button>
              ) : (
                <Link
                  href={`/login?from=/blog/${article.publishLink}`}
                  className='rounded-md bg-[#3e3b3b] px-4 py-2 text-white hover:bg-[#343432]'
                >
                  Login to post
                </Link>
              )}
              <button
                className='rounded-md px-4 py-2 hover:bg-gray-200'
                type='button'
                onClick={() => setNewComment("")}
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>
      <ul className='mt-6 flex w-full flex-col gap-4'>
        {comments?.map((comment) => {
          return (
            <CommentItem
              {...comment}
              updateComments={updateComments}
              article={article}
              comment={comment}
              key={comment.id}
              parentId={comment.id}
              user={comment.user}
            />
          );
        })}
      </ul>
    </>
  );
};
export default CommentSection;
