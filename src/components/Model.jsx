import { IoClose } from "react-icons/io5";


const Model = ({ isOpen, onClose, children }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="absolute max-[400px]:w-[80%] top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] rounded-lg bg-[#0f0f10] p-4 z-10 text-right">
            <button
              onClick={onClose}
              className="relative text-white ml-auto cursor-pointer block p-4 rounded-full h-[1rem] w-[1rem] hover:bg-stone-900/90 shadow-sm hover:shadow-cyan-700 duration-[.3s] focus:outline-none mr-2 "
            >
              <IoClose className="absolute -translate-[50%]" />
            </button>
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default Model;
