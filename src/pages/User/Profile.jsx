import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useProfileMutation } from "../../redux/api/usersApiSlice";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import { setCredentials } from "../../redux/features/auth/authSlice";

const Profile = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();

  useEffect(() => {
    setUsername(userInfo.username);
    setEmail(userInfo.email);
  }, [userInfo.username, userInfo.email]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!username || !email || !password || !confirmPassword) {
      toast.error("Please fill all fields");
    } else if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await updateProfile({ username, email, password }).unwrap();
        dispatch(setCredentials({ ...res.updatedUser }));
        toast.success("Data updated successfully");
      } catch (error) {
        toast.error(error?.data?.message || error.message);
      }
    }
  };

  return (
    <div className="container mx-auto mt-[2rem] text-white">
      <div className="flex justify-center items-center lg:ml-[4rem] space-x-4 flex-col">
        <div className="max-sm:w-[80%] w-[50%] md:w-[50%] lg:w-[40%]">
          <h2 className="text-2xl font-semibold mb-4 max-lg:text-center">
            Update Profile
          </h2>
          <form onSubmit={submitHandler}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-white mb-2">
                Name
              </label>
              <input
                type="text"
                id="username"
                placeholder="Enter name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-input mt-1 p-2 bg-stone-800/40 border foucs:border-none border-gray-200/20 text-white rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-white mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input mt-1 p-2 bg-stone-800/40 border foucs:border-none border-gray-200/20 text-white rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-white mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input mt-1 p-2 bg-stone-800/40 border foucs:border-none border-gray-200/20 text-white rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="confirmPassword"
                className="block text-white mb-2"
              >
                Confirm password
              </label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-input mt-1 p-2 bg-stone-800/40 border foucs:border-none border-gray-200/20 text-white rounded w-full"
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="block bg-pink-600 text-white px-4 my-[1rem] py-2 rounded cursor-pointer hover:bg-pink-700 transition-all duraion-[.5s] ease-in-out"
              >
                Update
              </button>
              <Link
                to="/user-orders"
                className="block bg-pink-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-pink-700 transition-all duraion-[.5s] ease-in-out"
              >
                My Orders
              </Link>
            </div>
          </form>
          {loadingUpdateProfile && <Loader />}
        </div>
      </div>
    </div>
  );
};

export default Profile;
