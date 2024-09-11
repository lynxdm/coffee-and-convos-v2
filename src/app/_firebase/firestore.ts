"use server";
import {
  getDocs,
  Query,
  collection,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "./config";

export type Doc = {
  id: string;
  title: string;
  cover: { alt: string; image: string };
  date: string;
  pinned: boolean;
  publishLink: string;
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
  let articleRef = doc(db, "articles", id);
  updateDoc(articleRef, {
    pinned: true,
  });
};
