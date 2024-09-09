import firebase_app from "./config";
import { collection, doc, getDocs, Timestamp } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";

type Doc = {
  id: string;
  title: string;
  cover: { alt: string; image: string };
  date: Timestamp;
};

export const getArticles = async (articlesRef) => {
  //   const articlesRef = collection(db, "articles");
  if (articlesRef) {
    const snaphot = await getDocs(articlesRef);
    const data = snaphot.docs;
    if (data) {
      let articlesArr: Doc[] = [];
      data.forEach((doc: { data: () => void; id: string }) => {
        articlesArr.push({ ...doc.data(), id: doc.id });
      });
      return articlesArr;
    }
  }
};
