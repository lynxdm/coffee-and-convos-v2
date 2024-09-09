import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { storage } from "./config";
import { error } from "console";

export const uploadProfileImage = async (e: any, profileId: string) => {
  if (e.target.files[0]) {
    let url,
      error = null;

    try {
      const profileImage = e.target.files[0];
      const profileImageRef = ref(storage, `profile_photos/image-${profileId}`);
      const snapshot = await uploadBytes(profileImageRef, profileImage);
      url = await getDownloadURL(snapshot.ref);
    } catch (err: any) {
      console.log(err);
      error = err;
    }
    return { url, error };
  }
};

export const deleteProfileImage = async (profileId: string) => {
  let result,
    error = null;

  const profileImageRef = ref(storage, `profile_photos/image-${profileId}`);

  deleteObject(profileImageRef)
    .then(() => {
      result = true;
    })
    .catch((err) => {
      console.log(err);
      error = err;
    });

  return { result, error };
};

export const changeProfileImage = (e: any, profileId: string) => {
  try {
    deleteProfileImage(profileId);
    uploadProfileImage(e, profileId);
  } catch (error) {
    console.log(error);
  }
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
