"use client";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth, provider } from "./config";

const getErrorMessage = (errorCode: string) => {
  switch (errorCode) {
    case "auth/email-already-in-use":
      return "The email address is already in use by another account.";
    case "auth/invalid-email":
      return "The email address is not valid.";
    case "auth/operation-not-allowed":
      return "Email/password accounts are not enabled.";
    case "auth/weak-password":
      return "The password is too weak.";
    case "auth/user-disabled":
      return "The user account has been disabled.";
    case "auth/user-not-found":
      return "There is no user corresponding to this email.";
    case "auth/wrong-password":
      return "The password is invalid.";
    case "auth/invalid-credential":
      return "The provided credential is not valid.";
    case "auth/cancelled-popup-request":
      return "This operation has been cancelled due to another conflicting popup being opened.";
    case "auth/operation-not-supported-in-this-environment":
      return "This operation is not supported in the environment this application is running on.";
    case "auth/popup-blocked":
      return "The popup has been blocked by the browser.";
    case "auth/popup-closed-by-user":
      return "The popup has been closed by the user before finalizing the operation.";
    default:
      return "An unknown error occurred. Check your connection, and try again.";
  }
};

export const signInWithGoogle = async () => {
  let result,
    error = null;

  try {
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;
    result = user;
  } catch (err: any) {
    console.log(err);
    let errorMsg = getErrorMessage(err.code);
    error = errorMsg;
  }

  return { result, error };
};

export const signInWithEmail = async (email: string, password: string) => {
  let result,
    error = null;

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    result = user;
  } catch (err: any) {
    console.log(err);
    let errorMsg = getErrorMessage(err.code);
    error = errorMsg;
  }
  return { result, error };
};

export const createUserWithEmail = async (
  email: string,
  password: string,
  name: string,
  photoURL: string
) => {
  let result,
    error = null;

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    updateProfile(user, {
      displayName: name,
      photoURL,
    });
    result = user;
  } catch (err: any) {
    console.log(err);
    let errorMsg = getErrorMessage(err.code);
    error = errorMsg;
  }
  return { result, error };
};

export const signUserOut = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    console.log(error);
  }
};
