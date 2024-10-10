"use client";
import { useEffect, useState } from "react";
import { useGlobalContext } from "../contexts/AppContext";
import NotificationItem from "./components/NotificationItem";
import { Notification } from "../_firebase/notifications";
import { markNotificationsAsRead } from "../_firebase/notifications";

const Notifications = () => {
  const {
    userNotifications,
    user,
    currentAdmin: { isAdmin },
  } = useGlobalContext();
  const [newNotifications, setNewNotifications] = useState<
    Notification[] | null
  >(null);

  useEffect(() => {
    if (userNotifications) {
      const newArr = userNotifications
        .flatMap((notification: Notification) =>
          !notification.read ? notification : []
        )
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      if (newArr.length > 0) {
        setNewNotifications([...newArr]);
      }
      markNotificationsAsRead(user, isAdmin);
    }
  }, [userNotifications, isAdmin, user]);

  if (newNotifications) {
    return (
      <ul className='mx-auto my-14 flex max-w-[50rem] flex-col gap-3'>
        {newNotifications.map((notification) => (
          <NotificationItem {...notification} key={notification.timestamp} />
        ))}
      </ul>
    );
  }

  return (
    <h1 className='mx-auto my-14 text-2xl text-center font-kurale font-semibold lg:text-3xl'>
      No new notifications 🫡
    </h1>
  );
};

export default Notifications;
