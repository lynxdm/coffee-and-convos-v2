import {
  collection,
  getDoc,
  getDocs,
  query,
  where,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/app/_firebase/config";
import { v4 } from "uuid";
import { UserInfo } from "firebase/auth";
import { Comment } from "./firestore";
import { admins } from "@/app/_firebase/config";

export interface Notification {
  type: string;
  articleId: string;
  articleLink: string;
  articleTitle: string;
  timestamp: string;
  comment: Comment | null;
  content: string;
  read: boolean;
  reply: Comment | null;
  notificationId: string;
  currentUser: { email: string; photoURL: string; displayName: string };
}

const notificationsRef = collection(db, "notifications");

export const createUserNotification = async (result: UserInfo) => {
  // Create a query against the subcollection
  try {
    const q = query(notificationsRef, where("email", "==", result.email));

    // Execute the query
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      let newUserNotificationData;

      if (result.email === admins[0].email) {
        newUserNotificationData = {
          userNotifications: [],
          displayName: admins[0].displayName,
          email: admins[0].email,
          id: "adminNotifications",
        };
      } else {
        newUserNotificationData = {
          userNotifications: [],
          displayName: result.displayName,
          email: result.email,
          id: result.uid,
        };
      }

      const newUserRef = doc(db, "notifications", newUserNotificationData.id);

      await setDoc(newUserRef, newUserNotificationData);
    } else {
      console.log("snapshot empty");
    }
  } catch (err) {
    console.log("unable to create user notification", err);
  }
};

export const sendNotification = async (
  type: string,
  comment: Comment,
  articleId: string,
  currentUser: { email: string },
  reply: Comment | null,
  articleLink: string,
  admin: { email: string }
) => {
  const {
    user: { userId, email },
    id,
    content,
  } = comment;

  if (currentUser.email === email) {
    console.log("auto action");
    return;
  }

  const newNotification = {
    type,
    articleId,
    articleLink,
    timestamp: new Date().toISOString(),
    commentId: id,
    content: content,
    read: false,
    reply,
    notificationId: v4(),
    currentUser,
  };

  if (email === admin.email) {
    const userData = await getDoc(
      doc(db, "notifications", "adminNotifications")
    );

    const updatedNotifications = [
      ...userData.data()?.userNotifications,
      newNotification,
    ];

    await updateDoc(doc(db, "notifications", "adminNotifications"), {
      userNotifications: updatedNotifications,
    });
    return;
  }

  const userData = await getDoc(doc(db, "notifications", userId));

  const currentNotifications = userData.data()?.userNotifications;

  const updatedNotifications = [
    ...(Array.isArray(currentNotifications) ? currentNotifications : []),
    newNotification,
  ];

  await updateDoc(doc(db, "notifications", userId), {
    userNotifications: updatedNotifications,
  });
};

export const sendAdminNotification = async (
  type: string,
  comment: Comment,
  articleId: string,
  currentUser: { email: string },
  articleLink: string,
  articleTitle: string,
  admin: { email: string }
) => {
  if (currentUser.email === admin.email) {
    console.log("auto notify");
    return;
  }

  const newNotification = {
    type,
    comment,
    articleId,
    currentUser,
    articleLink,
    articleTitle,
    timestamp: new Date().toISOString(),
    read: false,
  };

  const userData = await getDoc(doc(db, "notifications", "adminNotifications"));

  const currentNotifications = userData.data()?.userNotifications;

  const updatedNotifications = [
    ...(Array.isArray(currentNotifications) ? currentNotifications : []),
    newNotification,
  ];

  await updateDoc(doc(db, "notifications", "adminNotifications"), {
    userNotifications: updatedNotifications,
  });
};

export const updateNotifications = async (user: { email: string }) => {
  if (!user?.email) return; // Check if user email is available
  try {
    const notificationsRef = collection(db, "notifications");
    const q = query(notificationsRef, where("email", "==", user.email));

    // Execute the query
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const newNotifications = querySnapshot.docs.flatMap(
        (doc) => doc.data().userNotifications || []
      );
      return newNotifications;
      //   setUserNotifications(newNotifications);
    } else return [];
  } catch (err) {
    throw new Error("Error fetching notifications");
  }
};

export const markNotificationsAsRead = async (
  user: { userId: string },
  isAdmin: boolean
) => {
  try {
    const docPath = `notifications/${
      isAdmin ? "adminNotifications" : user.userId
    }`;
    const notificationsRef = doc(db, docPath);

    const data = await getDoc(notificationsRef);

    if (data.exists()) {
      const notifications = data.data().userNotifications;
      const updatedNotifications = notifications.map(
        (notification: { read: boolean }) => {
          if (!notification.read) {
            return { ...notification, read: true };
          }
          return notification;
        }
      );

      await updateDoc(notificationsRef, {
        userNotifications: updatedNotifications,
      });
    }
  } catch (error) {
    console.error("There was an error marking notifications as read:", error);
  }
};
