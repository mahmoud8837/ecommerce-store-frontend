import React from "react";
import { useNavigate } from "react-router-dom";

const NotfoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className="w-[100%] h-[100vh] flex items-center justify-center">
      <div className="block rounded-xl bg-[#ddd] bg-conic-180 from-cyan-600 via-cyan-200 to-cyan-600 p-8 text-center select-none shadow-cyan-500/50 shadow-lg">
        <h1 className="font-bold text-3xl">We are sorry</h1>
        <h1 className="font-bold text-3xl">😔😔</h1>
        <h1 className="font-bold text-3xl">Page is not found</h1>
        <div className="flex items-center justify-around">
          <button
            className="px-3 py-1 mt-5 bg-pink-600 text-white font-semibold cursor-pointer rounded-lg transition-background duration-[.3s] linear hover:bg-pink-700 shadow-xl shadow-gray-900/50 hover:shadow-gray-900/90 transform hover:-translate-y-1"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
          <button
            className="px-3 py-1 mt-5 bg-pink-600 text-white font-semibold cursor-pointer rounded-lg transition-background duration-[.3s] linear hover:bg-pink-700 shadow-xl shadow-gray-900/50 hover:shadow-gray-900/90 transform hover:-translate-y-1"
            onClick={() => navigate("/")}
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotfoundPage;
