const LoginLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <main className='grid min-h-[80vh] place-content-center'>{children}</main>
    </>
  );
};
export default LoginLayout;
