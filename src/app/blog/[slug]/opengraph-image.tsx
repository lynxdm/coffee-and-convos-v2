import { getArticle } from "@/app/_firebase/firestore";
import { query, collection, where } from "firebase/firestore";
import { ImageResponse } from "next/og";
import { db } from "@/app/_firebase/config";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function og({ params }: { params: { slug: string } }) {
  const article = await getArticle(
    query(collection(db, "articles"), where("publishLink", "==", params.slug))
  );

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          position: "relative",
          width: "100%",
          height: "100%",
          justifyContent: "center",
        }}
      >
        <img
          src={article?.cover.image + "&w=1200&h=630&auto=format&q=75"}
          alt={article?.cover.alt || ""}
          width={1200}
          height={630}
          style={{ objectFit: "cover", display: "flex" }}
        />
      </div>
    ),
    {
      width: size.width,
      height: size.height,
    }
  );
}
