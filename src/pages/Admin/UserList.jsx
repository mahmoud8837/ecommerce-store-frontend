import {  useState } from "react";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import {
  useGetUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "../../redux/api/usersApiSlice";
import Message from "../../components/Message";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../../redux/features/auth/authSlice";
import AdminMenu from "./AdminMenu";

const UserList = () => {
  let { data: users, isLoading, error, refetch } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [editableUserId, setEditableUserId] = useState(null);
  const [editableUsername, setEditableUsername] = useState("");
  const [editableUserEmail, setEditableUserEmail] = useState("");
  const [admin, setAdmin] = useState(false);

  const deleteHandler = async (id, username) => {
    if (window.confirm(`Are you sure to delete ${username}`)) {
      try {
        await deleteUser(id);
        refetch();
      } catch (error) {
        toast.error(error);
      }
    }
  };

  const toggleEdit = async (id, username, email, isAdmin) => {
    setEditableUserId(id);
    setEditableUsername(username);
    setEditableUserEmail(email);
    setAdmin(isAdmin);
  };

  const toggleAdmin = () => {
    setAdmin(!admin);
  };

  const updateHandler = async (id) => {
    try {
      const res = await updateUser({
        userId: id,
        username: editableUsername,
        email: editableUserEmail,
        isAdmin: admin,
      });
      if (res.error && res.error.data.message !== "Please update any data") {
        toast.error(res.error.data.message);
      }
      if (userInfo._id === id) {
        dispatch(setCredentials({username: editableUsername, email: editableUserEmail, isAdmin: admin}));
      }
      setEditableUserId(null);
      refetch();
    } catch (error) {
      toast.error(error.data.message || error.message);
    }
  };

  return (
    <div className="p-4 text-white lg:ml-[6rem] max-md:text-center">
      <h1 className="text-2xl font-semibold mb-4">Users</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message
          variant={"error"}
          children={error?.data.message || error.message}
        />
      ) : (
        <div className="flex flex-col md:flex-row overflow-auto">
          <AdminMenu />
          <table className="w-full max-md:w-4/5 mx-auto">
            <thead>
              <tr className="border border-gray-200 bg-stone-950/20">
                <th className="border border-gray-200 px-4 py-2 text-left">
                  ID
                </th>
                <th className="border border-gray-200 px-4 py-2 text-left">
                  Name
                </th>
                <th className="border border-gray-200 px-4 py-2 text-left">
                  Email
                </th>
                <th
                  colSpan={2}
                  className="border border-gray-200 px-4 py-2 text-left"
                >
                  Admin
                </th>
              </tr>
            </thead>
            <tbody>
              {users.data.map((user) => {
                return (
                  <tr
                    className="border border-gray-400 bg-stone-800/40 hover:bg-stone-800/70"
                    key={user._id}
                  >
                    <td className="border border-gray-400 px-4 py-2">
                      {user._id}{" "}
                      {user._id === userInfo._id && (
                        <span className="text-green-500 ml-[1rem] w-full block">
                          [ current user ]
                        </span>
                      )}
                    </td>
                    <td className="border border-gray-400 px-4 py-2">
                      {editableUserId === user._id ? (
                        <div className="flex items-center">
                          <input
                            type="text"
                            value={editableUsername}
                            onChange={(e) =>
                              setEditableUsername(e.target.value)
                            }
                            className="w-full p-2 border rounded bg-gray-950"
                          />
                          <button
                            onClick={() => updateHandler(user._id)}
                            className="cursor-pointer m-2 bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-lg"
                          >
                            <FaCheck />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          {user.username}{" "}
                          <button
                            onClick={() =>
                              toggleEdit(
                                user._id,
                                user.username,
                                user.email,
                                user.isAdmin
                              )
                            }
                            className="cursor-pointer"
                          >
                            <FaEdit className="ml-[1rem]" />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="border border-gray-400 px-4 py-2">
                      {editableUserId === user._id ? (
                        <div className="flex items-center flex-row">
                          <input
                            type="text"
                            value={editableUserEmail}
                            onChange={(e) =>
                              setEditableUserEmail(e.target.value)
                            }
                            className="w-full p-2 border rounded-lg bg-gray-950"
                          />
                          <button
                            onClick={() => updateHandler(user._id)}
                            className="cursor-pointer ml-2 bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-lg"
                          >
                            <FaCheck />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-cenre">
                          <p>{user.email}</p>
                          <button
                            onClick={() =>
                              toggleEdit(
                                user._id,
                                user.username,
                                user.email,
                                user.isAdmin
                              )
                            }
                            className="cursor-pointer"
                          >
                            <FaEdit className="ml-[1rem]" />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="border border-r-0 border-gray-400 px-4 py-2">
                      {editableUserId === user._id ? (
                        user.isAdmin ? (
                          <div className="flex">
                            <button
                              className="px-2 py-2 hover:bg-stone-50/80 duration-[.3s] rounded cursor-pointer"
                              onClick={() => {
                                if (userInfo._id === user._id) {
                                  toast.error(
                                    "You can't make yourself as a usual user"
                                  );
                                } else {
                                  toggleAdmin();
                                }
                              }}
                            >
                              {admin ? (
                                <FaCheck style={{ color: "green" }} />
                              ) : (
                                <FaTimes style={{ color: "red" }} />
                              )}{" "}
                            </button>
                            <button
                              onClick={() => updateHandler(user._id)}
                              className="cursor-pointer ml-2 bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-lg"
                            >
                              <FaCheck />
                            </button>
                          </div>
                        ) : (
                          <div className="flex">
                            <button
                              className="px-2 py-2 hover:bg-stone-50/80 duration-[.3s] rounded cursor-pointer"
                              onClick={toggleAdmin}
                            >
                              {admin ? (
                                <FaCheck style={{ color: "green" }} />
                              ) : (
                                <FaTimes style={{ color: "red" }} />
                              )}
                            </button>
                            <button
                              onClick={() => updateHandler(user._id)}
                              className="cursor-pointer ml-2 bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-lg"
                            >
                              <FaCheck />
                            </button>
                          </div>
                        )
                      ) : user.isAdmin ? (
                        <div className="flex">
                          <FaCheck style={{ color: "green" }} />
                          <button
                            onClick={() =>
                              toggleEdit(
                                user._id,
                                user.username,
                                user.email,
                                user.isAdmin
                              )
                            }
                            className="cursor-pointer"
                          >
                            <FaEdit className="ml-[1rem]" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex">
                          <FaTimes style={{ color: "red" }} />
                          <button
                            onClick={() =>
                              toggleEdit(
                                user._id,
                                user.username,
                                user.email,
                                user.isAdmin
                              )
                            }
                            className="cursor-pointer"
                          >
                            <FaEdit className="ml-[1rem]" />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex">
                        {!user.isAdmin ? (
                          <button
                            onClick={() =>
                              deleteHandler(user._id, user.username)
                            }
                            className="ml-auto cursor-pointer bg-red-600 hover:bg-red-700 font-bold py-2 px-4 rounded"
                          >
                            <FaTrash />
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              toast.error("Could not delete an admin")
                            }
                            className="ml-auto cursor-pointer bg-red-800 hover:bg-red-900 font-bold py-2 px-4 rounded"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserList;
