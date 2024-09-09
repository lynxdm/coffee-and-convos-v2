"use client";
import { ChangeEvent, FormEvent, FormEventHandler, useState } from "react";
import Link from "next/link";
import { signInWithGoogle, signInWithEmail } from "../_firebase/auth";
import { BiLogoGmail } from "react-icons/bi";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FaChevronLeft } from "react-icons/fa6";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const SignInPage = () => {
  const router = useRouter();
  const [isUsingEmail, setIsUsingEmail] = useState(false);
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
    setUserInfo((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { result, error } = await signInWithEmail(
      userInfo.email,
      userInfo.password
    );
    if (result) {
      router.push("/");
    } else if (error) {
      toast.error(error);
    }
  };

  const handleGoogleLogin = async () => {
    const { result, error } = await signInWithGoogle();
    if (result) {
      router.push("/");
    } else if (error) {
      toast.error(error);
    }
  };

  return (
    <>
      {!isUsingEmail ? (
        <>
          <h2 className='mx-auto mb-4 text-2xl font-bold'>Welcome back!</h2>
          <div className='flex flex-col gap-2 *:flex *:gap-3 *:rounded-[3rem] *:bg-primary *:px-12 *:py-4 *:text-lg *:font-semibold *:text-white dark:*:bg-[#262626] dark:*:text-darkPrimary md:*:text-xl'>
            <button onClick={handleGoogleLogin}>
              {" "}
              <svg className='size-6' viewBox='0 0 1152 1152'>
                {" "}
                <path
                  d='M1055.994 594.42a559.973 559.973 0 0 0-8.86-99.684h-458.99V683.25h262.28c-11.298 60.918-45.633 112.532-97.248 147.089v122.279h157.501c92.152-84.842 145.317-209.78 145.317-358.198z'
                  fill='#4285f4'
                ></path>
                <path
                  d='M588.144 1070.688c131.583 0 241.9-43.64 322.533-118.07l-157.5-122.28c-43.64 29.241-99.463 46.52-165.033 46.52-126.931 0-234.368-85.728-272.691-200.919H152.636v126.267c80.19 159.273 245 268.482 435.508 268.482z'
                  fill='#34a853'
                ></path>{" "}
                <path
                  d='M315.453 675.94a288.113 288.113 0 0 1 0-185.191V364.482H152.636a487.96 487.96 0 0 0 0 437.724z'
                  fill='#fbbc05'
                ></path>{" "}
                <path
                  d='M588.144 289.83c71.551 0 135.792 24.589 186.298 72.88l139.78-139.779C829.821 144.291 719.504 96 588.143 96c-190.507 0-355.318 109.21-435.508 268.482L315.453 490.75c38.323-115.19 145.76-200.919 272.691-200.919z'
                  fill='#ea4335'
                ></path>
              </svg>
              <p>Sign in with Google</p>
            </button>
            <button onClick={() => setIsUsingEmail(true)}>
              <BiLogoGmail className='size-6' />
              <p>Sign in with Email</p>
            </button>
          </div>
          <p className='mx-auto mt-6'>
            No account?{" "}
            <Link
              className='font-extrabold text-blue-700 dark:text-[#5b5bca]'
              href='/login/signup'
            >
              Create one
            </Link>
          </p>
        </>
      ) : (
        <>
          <div className='mx-auto mb-4 text-center'>
            <h2 className='text-2xl font-semibold'>Sign in with Email</h2>
          </div>
          <div className='h-[20rem] w-[20rem] rounded-3xl border-2 border-primary p-6 dark:border-[#3a3a3a] lg:w-[30rem]'>
            <button
              className='float-right flex items-center gap-1 font-bold text-blue-800 dark:text-[#5b5bca]'
              onClick={() => setIsUsingEmail(false)}
            >
              <FaChevronLeft className='size-3' />
              <p>All sign in options</p>
            </button>
            <form
              className='clear-both my-6 mt-12 flex flex-col gap-4'
              onSubmit={handleSubmit}
            >
              <div className='flex flex-col gap-2'>
                <label htmlFor='email' className='text-sm'>
                  Email
                </label>
                <input
                  type='email'
                  required
                  name='email'
                  id='email'
                  value={userInfo.email}
                  onChange={handleChange}
                  className='border-b border-primary bg-inherit focus:border-b-2 focus:outline-none dark:border-[#3a3a3a] dark:focus-within:border-darkSecondary'
                />
              </div>
              <div className='flex flex-col gap-2'>
                <label htmlFor='password' className='text-sm'>
                  Password
                </label>
                <div className='flex gap-1 border-b border-primary focus-within:border-b-2 dark:border-[#3a3a3a] dark:focus-within:border-darkSecondary'>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    name='password'
                    id='password'
                    value={userInfo.password}
                    onChange={handleChange}
                    className='w-[95%] bg-inherit focus:outline-none'
                  />
                  {userInfo.password.length > 0 && (
                    <button
                      type='button'
                      className='grid w-[5%] place-items-center text-3xl'
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <FaRegEyeSlash className='size-5' />
                      ) : (
                        <FaRegEye className='size-5' />
                      )}
                    </button>
                  )}
                </div>
              </div>
              <button
                type='submit'
                className='mt-4 rounded-3xl border border-primary bg-primary py-2 text-white dark:border-[#3a3a3a] dark:bg-[#262626]'
              >
                Continue
              </button>
            </form>
          </div>
        </>
      )}
    </>
  );
};
export default SignInPage;
