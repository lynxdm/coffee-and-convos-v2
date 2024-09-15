import NotificationsNav from "./NotificationsNav";

const NotificationsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <main className='min-h-[100vh] bg-[#f5f5f5] pb-14 dark:bg-darkBg lg:px-32'>
        <h1 className='mb-5 pt-4 text-center text-2xl font-semibold'>
          All Notifications
        </h1>
        <NotificationsNav />
        {children}
      </main>
    </>
  );
};
export default NotificationsLayout;
