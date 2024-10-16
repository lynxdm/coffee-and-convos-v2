import { getArticles } from "./_firebase/firestore";
import { collection } from "firebase/firestore";
import { db } from "./_firebase/config";

export default async function sitemap() {
  const baseUrl = "https://coffee-and-convos.vercel.app";

  // get all articles
  const articles = await getArticles(collection(db, "articles"));
  const articleUrls =
    articles?.map((article) => {
      return {
        url: `${baseUrl}/blog/${article.publishLink}`,
        lastModified: new Date(article.date),
      };
    }) ?? [];

  //

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    ...articleUrls,
  ];
}
