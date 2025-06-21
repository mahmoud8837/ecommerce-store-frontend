import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
    } catch (error) {
      // toast.error(error?.data?.message || error.message)
      toast.error(error ? "Faild To log in" : null);
    }
  };

  return (
    <div>
      <section className="flex lg:ml-[6rem] mt-[2rem]">
        <div className="flex justify-center lg:items-start items-center flex-col w-full">
          <div className="max-sm:w-[80%] w-[50%] md:w-[50%] lg:w-[50%] mx-auto lg:pr-[6rem]">
            <h1 className="text-2xl font-semibold mb-4 text-white">Log In</h1>
            <form onSubmit={submitHandler}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-white"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="mt-1 p-2 bg-stone-800/40 border foucs:border-none border-gray-200/20 text-white rounded w-full"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-white mt-4"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="mt-1 p-2 bg-stone-800/40 border foucs:border-none border-gray-200/20 text-white rounded w-full"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button
                disabled={isLoading}
                type="submit"
                className="bg-pink-600 text-white px-4 py-2 rounded cursor-pointer my-[2rem] hover:bg-pink-700 transition-all duraion-[.5s] ease-in-out"
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </button>
              {isLoading && <Loader />}
            </form>

            <div>
              <p className="text-white">
                New Customer ?{" "}
                <Link
                  to={redirect ? `/register?redirect=${redirect}` : "/register"}
                  className="text-pink-600 hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
