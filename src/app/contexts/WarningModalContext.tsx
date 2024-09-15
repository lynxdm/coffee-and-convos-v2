"use client";
import React, { useState } from "react";
import { useContext } from "react";
import { FaXmark } from "react-icons/fa6";

interface WarningContent {
  header: string;
  content: string;
  cancelText: string;
  proceedText: string;
  proceed: () => void;
}

interface WarningData {
  setWarningContent: (content: WarningContent) => void;
  setIsModalWarningOpen: (open: boolean) => void;
}

const WarningContext = React.createContext<WarningData | undefined>(undefined);

const WarningModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [warningContent, setWarningContent] = useState({
    header: "",
    content: "",
    cancelText: "",
    proceedText: "",
    proceed: () => {},
  });

  const [isModalWarningOpen, setIsModalWarningOpen] = useState(false);

  return (
    <WarningContext.Provider
      value={{ setWarningContent, setIsModalWarningOpen }}
    >
      {children}
      {isModalWarningOpen && (
        <section className='pointer-events-auto fixed bottom-0 left-0 right-0 top-0 z-50 grid h-[100vh] w-[100vw] place-items-center bg-[#0000006c] dark:bg-[#0000009d]'>
          <div className=' w-[100vw] h-[100vh] md:h-fit md:w-[40rem] md:rounded-xl bg-white dark:bg-darkBg py-4 pt-2 dark:border dark:border-[#3a3a3a]'>
            <div className='flex items-center justify-between border-b px-3 lg:px-6 py-2 dark:border-[#3a3a3a]'>
              <p className='text-lg lg:text-xl font-extrabold'>
                {warningContent.header}
              </p>
              <button
                className='grid size-8 place-items-center rounded hover:bg-blue-100 dark:hover:bg-[#0000ff2d] hover:text-blue-700'
                onClick={() => setIsModalWarningOpen(false)}
              >
                <FaXmark className='size-5' />
              </button>
            </div>
            <div className='lg:px-6 px-3 lg:pt-8 py-4'>
              <p> {warningContent.content}</p>
              <div className='mt-3 flex gap-4 *:rounded-md *:px-3 lg:*:px-4 *:py-2 *:font-semibold text-sm lg:text-base'>
                <button
                  className='bg-red-700 dark:text-black text-white'
                  onClick={() => {
                    warningContent.proceed();
                    setIsModalWarningOpen(false);
                  }}
                >
                  {warningContent.proceedText}
                </button>
                <button
                  className='bg-gray-00 dark:bg-[#262626] dark:text-darkPrimary text-gray-800 hover:bg-gray-300'
                  onClick={() => setIsModalWarningOpen(false)}
                >
                  {warningContent.cancelText}
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </WarningContext.Provider>
  );
};

export const useWarningContext = () => {
  const context = useContext(WarningContext);
  if (!context) {
    throw new Error(
      "useWarningContext must be used within a WarningModalProvider"
    );
  }
  return context;
};

export default WarningModalProvider;
