"use client";
import { useEffect, useState } from "react";
import { useGlobalContext } from "@/app/contexts/AppContext";
import NotificationItem from "@/app/components/NotificationItem";
import { Notification } from "@/app/_firebase/notifications";

const ReadNotifications = () => {
  const { userNotifications } = useGlobalContext();
  const [readNotifications, setReadNotifications] = useState<
    Notification[] | null
  >(null);

  useEffect(() => {
    if (userNotifications) {
      const newArr = userNotifications
        .flatMap((notification: Notification) =>
          notification.read ? notification : []
        )
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      if (newArr.length > 0) {
        setReadNotifications([...newArr]);
      }
    }
  }, []);

  if (readNotifications) {
    return (
      <ul className='mx-auto my-14 flex max-w-[50rem] flex-col gap-3'>
        {readNotifications.map((notification, index) => {
          return (
            <NotificationItem {...notification} key={notification.timestamp} />
          );
        })}
      </ul>
    );
  }

  return <h1 className='mx-auto my-14 text-2xl'>No previous notifications</h1>;
};
export default ReadNotifications;
