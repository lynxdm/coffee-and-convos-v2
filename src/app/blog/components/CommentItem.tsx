"use client";
import React, {
  useRef,
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
} from "react";
import {
  FaUserCircle,
  FaRegHeart,
  FaHeart,
  FaRegComment,
} from "react-icons/fa";
import { HiOutlineDotsHorizontal, HiBadgeCheck } from "react-icons/hi";
import { v4 as uuidv4 } from "uuid";
import useMenu from "../../hooks/useMenu";
import {
  addLike,
  deleteComment,
  addReply,
  removeLike,
  editComment,
  Comment,
} from "../../_firebase/firestore";
import ReactNiceAvatar, { genConfig } from "react-nice-avatar";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { timeAgo } from "../../_lib/accessoryFunctions";
import { useGlobalContext } from "../../contexts/AppContext";
import { useWarningContext } from "../../contexts/WarningModalContext";
import CommentText from "./CommentText";
import Image from "next/image";

const CommentItem = ({
  user: { displayName, photoURL, email },
  comment,
  parentId,
  article,
  updateComments,
}: {
  user: {
    displayName: string;
    photoURL: string;
    email: string;
    userId: string;
  };
  comment: Comment;
  parentId: string;
  article: { id: string; publishLink: string; title: string };
  updateComments: () => void;
}) => {
  const { id: articleId, publishLink } = article;
  const router = useRouter();
  const {
    user,
    currentAdmin: { isAdmin },
    admins,
  } = useGlobalContext();
  const { setIsModalWarningOpen, setWarningContent } = useWarningContext();

  const [newReply, setNewReply] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isReplyFolded, setIsReplyFolded] = useState(true);
  const [likesCount, setLikesCount] = useState(comment.likes.length);

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState("");

  const config = genConfig(email);

  const manageCommentBtn = useRef(null);
  const manageCommentMenu = useRef(null);

  const { isMenuOpen, setIsMenuOpen } = useMenu(
    manageCommentBtn,
    manageCommentMenu
  );

  useEffect(() => {
    comment.likes.forEach((like) => {
      if (like.email === user.email) {
        setIsLiked(true);
      }
    });
    setLikesCount(comment.likes.length);
  }, [comment.likes, user.email]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setNewReply(e.target.value);
  };

  const handleEditText = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setEditText(e.target.value);
  };

  const handleAddLike = () => {
    setIsLiked(true);
    setLikesCount(likesCount + 1);
    addLike(parentId, comment, user, articleId, publishLink, admins[0])
      .then(() => {
        updateComments();
      })
      .catch(() => {
        setIsLiked(false);
        throw new Error("error adding like");
      });
  };

  const handleRemoveLike = () => {
    setLikesCount(likesCount - 1);
    setIsLiked(false);
    removeLike(parentId, user, articleId, comment)
      .then(() => {
        updateComments();
      })
      .catch(() => {
        throw new Error("error removing like");
      });
  };

  const handleAddReply = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newReply) {
      setIsLoading(true);
      addReply(
        newReply,
        user,
        uuidv4(),
        comment,
        parentId,
        articleId,
        publishLink,
        admins[0]
      )
        .then(() => {
          setIsLoading(false);
          setIsReplyOpen(false);
          setNewReply("");
          setIsReplyFolded(false);
          updateComments();
        })
        .catch(() => {
          throw new Error("error adding reply");
        });
    }
  };

  const handleEditComment = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editText) {
      setIsLoading(true);
      editComment(editText, articleId, comment, parentId)
        .then(() => {
          setIsLoading(false);
          setIsEditing(false);
          setEditText("");
          updateComments();
        })
        .catch(() => {
          throw new Error("error editing comment");
        });
    }
  };

  const handleDeleteComment = () => {
    deleteComment(articleId, parentId, comment)
      .then(() => {
        updateComments();
        setIsModalWarningOpen(false);
      })
      .catch(() => {
        throw new Error("error deleting comment");
      });
  };

  return (
    <li id={comment.id}>
      <div className='flex items-start gap-3'>
        {photoURL ? (
          !imageError ? (
            <Image
              height={100}
              width={100}
              src={photoURL}
              alt={displayName + " display photo"}
              className='size-8 rounded-full'
              onError={() => setImageError(true)}
            />
          ) : (
            <ReactNiceAvatar className='size-8' {...config} />
          )
        ) : (
          <FaUserCircle className='size-8' />
        )}
        <div className='w-full rounded-md border border-gray-300 p-2 dark:border-[#3a3a3a]'>
          <div className='flex w-full justify-between'>
            <div className='mb-2 flex items-center gap-2 font-kurale text-primary dark:text-darkSecondary'>
              <p className='font-bold'>
                {displayName}{" "}
                {email === admins[0].email && (
                  <HiBadgeCheck className='inline size-4' title='Author' />
                )}
              </p>
              <span>•</span>
              <p>{timeAgo(comment.timestamp, true)}</p>
              {comment.edited && (
                <>
                  <span>•</span>
                  <p className='font-semibold'>edited</p>
                </>
              )}
            </div>
            {(email === user.email || isAdmin) && (
              <div className='relative'>
                <button
                  type='button'
                  className='grid size-6 place-items-center rounded-md hover:bg-gray-200 dark:hover:bg-[#262626]'
                  ref={manageCommentBtn}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <HiOutlineDotsHorizontal />
                </button>
                {isMenuOpen && (
                  <div
                    className='absolute right-0 top-[110%] z-20 flex w-[12rem] flex-col gap-1 rounded-md border border-gray-200 bg-white p-1 shadow-lg *:rounded *:px-2 *:text-left *:text-sm dark:border-[#3a3a3a] dark:bg-darkBg'
                    ref={manageCommentMenu}
                  >
                    {email === user.email && (
                      <>
                        <button
                          className='py-2 hover:bg-gray-200 dark:hover:bg-[#262626]'
                          onClick={() => setIsEditing(true)}
                        >
                          Edit Comment
                        </button>
                      </>
                    )}
                    <button
                      className='py-2 hover:bg-gray-200 dark:hover:bg-[#262626]'
                      onClick={() => {
                        setWarningContent({
                          content:
                            "Are you sure you want to delete your comment?",
                          header: "You're about to delete a comment",
                          cancelText: "cancel",
                          proceed: handleDeleteComment,
                          proceedText: "delete",
                        });
                        setIsModalWarningOpen(true);
                      }}
                    >
                      Delete Comment
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          <p className='text-lg'>{comment.content}</p>
        </div>
      </div>
      {!isReplyOpen && !isEditing && (
        <div className='flex items-center justify-between'>
          <div className='ml-12 mt-3 flex gap-2 *:flex *:gap-2 *:items-center *:rounded *:px-3 *:py-1.5'>
            <button
              className={` grid place-items-center ${
                isLiked
                  ? "bg-[#d71c1c18]"
                  : "hover:bg-gray-100 dark:hover:bg-[#262626]"
              }`}
              onClick={() => {
                if (!user.email) {
                  toast.error("Login to interact with comment", {
                    action: {
                      label: "Login",
                      onClick: () => {
                        router.push("/login");
                        toast.dismiss();
                      },
                    },
                  });
                  return;
                }
                if (!isLiked) {
                  handleAddLike();
                  return;
                }
                handleRemoveLike();
              }}
            >
              {isLiked ? <FaHeart className='text-red-600' /> : <FaRegHeart />}{" "}
              <p className='text-sm self-center'>
                <span>{likesCount > 0 ? likesCount : ""} </span>
                <span className='hidden lg:inline-block'>
                  {likesCount > 1 ? "likes" : "like"}
                </span>
              </p>
            </button>
            <button
              onClick={() => {
                if (!user.email) {
                  toast.error("Login to interact with comment", {
                    action: {
                      label: "Login",
                      onClick: () => {
                        router.push("/login");
                        toast.dismiss();
                      },
                    },
                  });
                  return;
                }
                setIsReplyOpen(true);
              }}
              className='hover:bg-gray-100 dark:hover:bg-[#262626]'
            >
              <FaRegComment /> <p className='hidden text-sm lg:block'>Reply</p>
            </button>
          </div>
          {comment.replies.length > 0 && (
            <button
              className='text-sm font-semibold italic text-gray-500'
              onClick={() => setIsReplyFolded(!isReplyFolded)}
            >
              {isReplyFolded ? (
                <p>
                  Show <span>{comment.replies.length}</span>{" "}
                  {comment.replies.length > 1 ? "replies" : "reply"}
                </p>
              ) : (
                <p>Hide replies</p>
              )}
            </button>
          )}
        </div>
      )}
      {isEditing && (
        <CommentText
          onSubmit={handleEditComment}
          text={editText}
          setText={setEditText}
          handleChange={handleEditText}
          submitText={"Edit"}
          loadingText={"Editing..."}
          isLoading={isLoading}
          setIsTextOpen={setIsEditing}
          placeholder={"New comment..."}
        />
      )}
      {isReplyOpen && (
        <CommentText
          onSubmit={handleAddReply}
          text={newReply}
          setText={setNewReply}
          handleChange={handleChange}
          submitText={"Reply"}
          loadingText={"Replying..."}
          isLoading={isLoading}
          setIsTextOpen={setIsReplyOpen}
          placeholder={"Your reply..."}
        />
      )}
      {comment.replies.length > 0 && !isReplyFolded && (
        <ul className='mb-1 ml-auto mt-6 flex w-[95%] flex-col gap-2.5'>
          {comment.replies.map((reply) => {
            return (
              <CommentItem
                {...reply}
                comment={reply}
                key={reply.id}
                article={article}
                parentId={parentId}
                updateComments={updateComments}
                user={reply.user}
              />
            );
          })}
        </ul>
      )}
    </li>
  );
};
export default CommentItem;
