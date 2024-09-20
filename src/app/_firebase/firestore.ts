"use server";
import {
  getDocs,
  Query,
  collection,
  query,
  where,
  updateDoc,
  doc,
  getDoc,
  deleteDoc,
  addDoc,
  setDoc,
  QuerySnapshot,
  DocumentData,
  orderBy,
} from "firebase/firestore";
import { db } from "./config";
import { sendNotification } from "./notifications";

export type Doc = {
  id: string;
  title: string;
  cover: { alt: string; image: string };
  date: string;
  pinned: boolean;
  publishLink: string;
  tags: Array<string>;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
};

export interface ArticleDraft {
  coverImg: string;
  title: string;
  content: string;
  details: {
    type: string;
    id: string;
  };
  publishDate: string;
  selectedTags: Array<string>;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
}

export interface ArticleData extends Doc {
  id: string;
}

export interface Tags {
  id: string;
  title: string;
  articles: Array<string>;
}

export const publishArticle = async (data: {}, id: string, path: string) => {
  try {
    const articleRef = doc(db, path, id);
    await setDoc(articleRef, data);
  } catch (error) {
    console.log(error);
  }
};

export const getArticle = async (q: Query): Promise<ArticleData | null> => {
  const docSnap: QuerySnapshot<DocumentData> = await getDocs(q);

  if (!docSnap.empty) {
    const doc = docSnap.docs[0];

    return {
      id: doc.id,
      ...(doc.data() as Omit<ArticleData, "id">),
    };
  }

  return null;
};

export const getArticles = async (articlesRef: Query): Promise<Doc[]> => {
  const snapshot = await getDocs(articlesRef);
  const articlesArr: Doc[] = [];

  snapshot.forEach((doc) => {
    const data = doc.data() as Omit<Doc, "id">;
    articlesArr.push({ ...data, id: doc.id });
  });

  return articlesArr;
};

export const getTags = async (): Promise<Tags[]> => {
  try {
    const snapshot = await getDocs(
      query(collection(db, "tags"), orderBy("title", "asc"))
    );
    const tags: Tags[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data() as Omit<Tags, "id">;
      tags.push({ ...data, id: doc.id });
    });

    return tags;
  } catch (error) {
    throw new Error("Error getting tags");
  }
};

export const unpinArticles = async () => {
  const articlesRef = collection(db, "articles");
  const q = query(articlesRef, where("pinned", "==", true));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return;
  snapshot.forEach((doc) => {
    const docRef = doc.ref;
    updateDoc(docRef, {
      pinned: false,
    });
  });
};

export const pinArticle = async (id: string) => {
  await unpinArticles();
  const articleRef = doc(db, "articles", id);
  updateDoc(articleRef, {
    pinned: true,
  });
};

// Comment interface with correct array type
export interface Comment {
  id: string;
  timestamp: string;
  content: string;
  likes: Array<{
    displayName: string;
    email: string;
    photoURL: string;
    userId: string;
  }>;
  replies: Array<Comment>;
  [key: string]: any;
  user: {
    displayName: string;
    email: string;
    photoURL: string;
    userId: string;
  };
}

// Fetch comments from Firestore
export const getComments = async (articleId: string): Promise<Comment[]> => {
  const commentsRef = collection(db, "articles", articleId, "comments");
  const snapshot = await getDocs(commentsRef);

  const commentsArr: Comment[] = [];
  snapshot.docs.forEach((doc) => {
    commentsArr.push({
      ...doc.data(),
      id: doc.id,
    } as Comment);
  });

  return commentsArr.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};

export const addComment = async (
  articleId: string,
  newComment: string,
  user: { displayName: string; photoURL: string; email: string }
): Promise<Comment | Error> => {
  try {
    const commentsRef = collection(db, "articles", articleId, "comments");
    const commentData: Omit<Comment, "id"> = {
      content: newComment,
      likes: [] as Array<object>,
      replies: [] as Array<Comment>,
      timestamp: new Date().toISOString(),
      user,
    };

    const docRef = await addDoc(commentsRef, commentData);

    return { ...commentData, id: docRef.id } as Comment;
  } catch (error: any) {
    console.error("Error adding comment: ", error);
    throw new Error(error.message || "Failed to add comment");
  }
};

// Add like to a comment
export const addLike = async (
  parentId: string,
  comment: Comment,
  user: {
    email: string;
    displayName: string;
    photoURL: string;
    userId: string;
  },
  articleId: string,
  publishLink: string,
  admin: { email: string }
) => {
  const addLikeRecursively = (
    replies: Comment[],
    commentLikes: Array<{
      displayName: string;
      email: string;
      photoURL: string;
      userId: string;
    }>,
    parentReplyId: string
  ): Comment[] => {
    // If parentId matches, update the likes array and return unchanged replies
    if (parentId === comment.id) {
      return replies.map((reply) => ({
        ...reply,
        likes: [...commentLikes, { ...user }],
      }));
    }

    // Otherwise, map over replies and recurse
    return replies.map((reply: Comment) => {
      if (reply.id === parentReplyId) {
        // Update likes for the matching reply
        return {
          ...reply,
          likes: [...reply.likes, { ...user }],
        };
      }

      // Recursively update replies
      return {
        ...reply,
        replies: addLikeRecursively(reply.replies, commentLikes, parentReplyId),
      };
    });
  };

  // Get the current comment document from Firestore
  const commentRef = doc(db, "articles", articleId, "comments", parentId);
  const commentDoc = await getDoc(commentRef);
  const currentComment = commentDoc.data() as Comment;

  // Recursively update likes or replies
  const updatedReplies = addLikeRecursively(
    currentComment.replies,
    currentComment.likes,
    comment.id
  );

  // If the parent is the root comment, update likes; otherwise, update replies
  if (parentId === comment.id) {
    await updateDoc(commentRef, {
      likes: [...currentComment.likes, { ...user }],
    });
  } else {
    await updateDoc(commentRef, { replies: updatedReplies });
  }

  sendNotification("like", comment, articleId, user, null, publishLink, admin);
};

// Remove like from a comment
export const removeLike = async (
  parentId: string,
  user: { email: string },
  articleId: string,
  comment: Comment
) => {
  const commentRef = doc(db, "articles", articleId, "comments", parentId);
  const commentDoc = await getDoc(commentRef);
  const currentComment = commentDoc.data() as Comment;

  const filteredLikes = comment.likes.filter(
    (like) => like.email !== user.email
  );

  if (parentId === comment.id) {
    await updateDoc(commentRef, { likes: filteredLikes });
    // getComments(articleId);
    return;
  }

  const checkReplies = (replies: Comment[], replyId: string): Comment[] => {
    return replies.map((reply) => {
      if (reply.id === replyId) return { ...reply, likes: filteredLikes };
      return {
        ...reply,
        replies: checkReplies(reply.replies, replyId),
      };
    });
  };

  const updatedLikes = checkReplies(currentComment.replies, comment.id);
  await updateDoc(commentRef, { replies: updatedLikes });

  // getComments(articleId);
};

// Add a reply to a comment
export const addReply = async (
  newReply: string,
  user: {
    displayName: string;
    email: string;
    photoURL: string;
    userId: string;
  },
  v4: string,
  comment: Comment,
  parentId: string,
  articleId: string,
  publishLink: string,
  admin: { email: string }
) => {
  const replyData: Comment = {
    content: newReply,
    likes: [],
    replies: [],
    timestamp: new Date().toISOString(),
    id: v4,
    user,
  };

  const addReplyRecursively = (
    replies: Comment[],
    parentReplyId: string
  ): Comment[] => {
    if (parentId === comment.id) return [replyData, ...replies];
    return replies.map((reply) => {
      if (reply.id === parentReplyId) {
        return { ...reply, replies: [replyData, ...reply.replies] };
      }
      return {
        ...reply,
        replies: addReplyRecursively(reply.replies, parentReplyId),
      };
    });
  };

  const commentRef = doc(db, "articles", articleId, "comments", parentId);
  const commentDoc = await getDoc(commentRef);

  if (!commentDoc.exists()) {
    console.error("No such document!");
    return;
  }

  const currentComment = commentDoc.data() as Comment;
  const updatedReplies = addReplyRecursively(
    currentComment.replies,
    comment.id
  );

  await updateDoc(commentRef, {
    replies: updatedReplies,
  });

  sendNotification(
    "reply",
    comment,
    articleId,
    user,
    replyData,
    publishLink,
    admin
  );
};

// Edit a comment
export const editComment = async (
  editText: string,
  articleId: string,
  comment: Comment,
  parentId: string
) => {
  const updateContentRecursively = (
    repliesArray: Comment[],
    commentId: string,
    newContent: string
  ): Comment[] => {
    return repliesArray.map((reply) => {
      if (reply.id === commentId) {
        return {
          ...reply,
          content: newContent,
          edited: true,
        };
      }
      return {
        ...reply,
        replies: updateContentRecursively(reply.replies, commentId, newContent),
      };
    });
  };

  const commentRef = doc(db, "articles", articleId, "comments", parentId);
  const commentDoc = await getDoc(commentRef);
  const currentComment = commentDoc.data() as Comment;

  const updatedReplies = updateContentRecursively(
    currentComment.replies,
    comment.id,
    editText
  );

  if (parentId === comment.id) {
    await updateDoc(commentRef, {
      content: editText,
      edited: true,
    });
  } else {
    await updateDoc(commentRef, {
      replies: updatedReplies,
    });
  }

  // getComments(articleId);
};

// Delete a comment
export const deleteComment = async (
  articleId: string,
  parentId: string,
  comment: Comment
) => {
  const deleteCommentRecursively = (
    repliesArray: Comment[],
    commentId: string
  ): Comment[] => {
    return repliesArray
      .filter((reply) => reply.id !== commentId)
      .map((reply) => ({
        ...reply,
        replies: deleteCommentRecursively(reply.replies, commentId),
      }));
  };

  const commentRef = doc(db, "articles", articleId, "comments", parentId);
  const commentDoc = await getDoc(commentRef);
  const currentComment = commentDoc.data() as Comment;

  if (parentId === comment.id) {
    await deleteDoc(commentRef);
    // getComments(articleId);
    return;
  }

  const updatedReplies = deleteCommentRecursively(
    currentComment.replies,
    comment.id
  );
  await updateDoc(commentRef, {
    replies: updatedReplies,
  });

  // getComments(articleId);
};
