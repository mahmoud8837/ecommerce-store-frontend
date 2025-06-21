import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../../redux/api/usersApiSlice";
import { toast } from "react-toastify";
import { setCredentials } from "../../redux/features/auth/authSlice";
import Loader from "../../components/Loader";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!username || !password || !email || !confirmPassword) {
      toast.error("Please fill all fields");
    } else {
      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
      } else {
        try {
          const res = await register({ username, email, password }).unwrap();
          if ({ ...res }.error) {
            toast.error("Register failed");
            navigate("/register");
            toast.error({ ...res }.error.data.message);
          } else {
            dispatch(setCredentials({ ...res }));
            toast.success("User successfully registered");
          }
        } catch (error) {
          toast.error(error.data.message);
        }
      }
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);
  return (
    <section className="mt-[2rem] lg:ml-[6rem] text-white">
      <div className="flex justify-center mx-auto lg:items-start items-center flex-col w-full">
        <div className="max-sm:w-[80%] w-[50%] md:w-[50%] lg:w-[50%] mx-auto lg:pr-[6rem]">
          <h1 className="text-2xl font-semibold mb-4">Sign Up</h1>
          <form className="container" onSubmit={submitHandler}>
            <div className="my-[1rem]">
              <label htmlFor="name" className="block text-sm font-medium">
                Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="Enter name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 p-2 bg-stone-800/40 border foucs:border-none border-gray-200/20 text-white rounded w-full"
              />
            </div>
            <div className="my-[1rem]">
              <label htmlFor="email" className="block text-sm font-medium">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 p-2 bg-stone-800/40 border foucs:border-none border-gray-200/20 text-white rounded w-full"
              />
            </div>
            <div className="my-[1rem]">
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 p-2 bg-stone-800/40 border foucs:border-none border-gray-200/20 text-white rounded w-full"
              />
            </div>
            <div className="my-[1rem]">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 p-2 bg-stone-800/40 border foucs:border-none border-gray-200/20 text-white rounded w-full"
              />
            </div>
            <button
              disabled={isLoading}
              type="submit"
              className="bg-pink-600 text-white px-4 py-2 rounded cursor-pointer my-2 hover:bg-pink-700 transition-all duraion-[.5s] ease-in-out"
            >
              {isLoading ? "Registering..." : "Register"}
            </button>
            {isLoading && <Loader />}
          </form>
          <div className="mt-4">
            <p className="text-white">
              Already hava an account?{" "}
              <Link
                to={redirect ? `/login?redirect=${redirect}` : "/login"}
                className="text-pink-600 hover:underline"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
