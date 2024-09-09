import { Timestamp } from "firebase/firestore";

export function timeAgo(timestamp: string, comment: boolean) {
  const now = new Date();
  // const createdAt = timestamp.toDate(); // Convert Firebase Timestamp to JS Date

  const createdAt = new Date(timestamp);

  const diffInSeconds = Math.floor(
    (now.getTime() - createdAt.getTime()) / 1000
  );

  const secondsInMinute = 60;
  const secondsInHour = 3600;
  const secondsInDay = 86400;

  if (diffInSeconds < secondsInMinute) {
    if (comment) {
      return `${diffInSeconds} sec${diffInSeconds !== 1 ? "s" : ""}`;
    }
    return `${diffInSeconds} second${diffInSeconds !== 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < secondsInHour) {
    const minutes = Math.floor(diffInSeconds / secondsInMinute);
    if (comment) {
      return `${minutes} min${minutes !== 1 ? "s" : ""}`;
    }
    return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < secondsInDay) {
    const hours = Math.floor(diffInSeconds / secondsInHour);
    if (comment) {
      return `${hours} hour${hours !== 1 ? "s" : ""}`;
    }
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < secondsInDay * 2) {
    return "yesterday";
  } else {
    if (comment) {
      const options = { month: "short", day: "numeric" };
      return createdAt.toLocaleDateString("en-US", options);
    }
    const options = { year: "numeric", month: "long", day: "numeric" };
    return createdAt.toLocaleDateString(undefined, options);
  }
}

export const formatLink = (text: string) => {
  let formattedText = text.toLowerCase();

  return (formattedText = formattedText
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-"));
};
