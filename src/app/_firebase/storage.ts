import { Ref, RefObject } from "react";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { storage } from "./config";
import { error } from "console";

export const uploadProfileImage = async (e: any, profileId: string) => {
  let result = { url: null as string | null, error: null as any };

  if (e.target.files[0]) {
    try {
      const profileImage = e.target.files[0];
      const profileImageRef = ref(storage, `profile_photos/image-${profileId}`);
      const snapshot = await uploadBytes(profileImageRef, profileImage);
      result.url = await getDownloadURL(snapshot.ref);
    } catch (err: any) {
      console.log(err);
      result.error = err;
    }
  }
  return result;
};

export const deleteProfileImage = async (profileId: string) => {
  let result,
    error = null;
  try {
    const profileImageRef = ref(storage, `profile_photos/image-${profileId}`);
    await deleteObject(profileImageRef);
    result = true;
  } catch (err) {
    console.log(err);
    error = err;
  }

  return { result, error };
};

export const fetchArticleContent = async (id: string, type: string) => {
  try {
    const articleContentRef = ref(storage, `${type}/${id}/content.md`);
    const url = await getDownloadURL(articleContentRef);

    if (url) {
      const response = await fetch(url);

      // Check if fetch was successful
      if (!response.ok) {
        throw new Error(
          `Failed to fetch the content. Status: ${response.status}`
        );
      }

      const data = await response.text();
      return data;
    }
  } catch (error) {
    console.error("Error fetching article content:", error);
    throw new Error("Failed to fetch article content.");
  }
};

export const uploadCoverImage = async (e: any, id: string) => {
  let result = { url: null as string | null, error: null as any };
  try {
    const coverImage = e.target.files[0];
    const coverImageRef = ref(storage, `articles/${id}/cover`);
    const snapshot = await uploadBytes(coverImageRef, coverImage);
    result.url = await getDownloadURL(snapshot.ref);
  } catch (error) {
    result.error = error;
  }
  return result;
};

export const deleteCoverImage = async (id: string) => {
  let result = { result: null as boolean | null, error: null as any };

  try {
    const coverImageRef = ref(storage, `articles/${id}/cover`);
    await deleteObject(coverImageRef);
    result.result = true;
  } catch (error) {
    result.error = error;
  }

  return result;
};
