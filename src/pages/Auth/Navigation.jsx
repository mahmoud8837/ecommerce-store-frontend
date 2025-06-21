import { useState } from "react";
import "./Navigation.css";
import { NavLink, useNavigate } from "react-router-dom";
import {
  AiOutlineHome,
  AiOutlineLogin,
  AiOutlineShopping,
  AiOutlineShoppingCart,
  AiOutlineUserAdd,
} from "react-icons/ai";
import { FaHeart, FaStar } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import {
  useGetCartQuery,
  useLogoutMutation,
} from "../../redux/api/usersApiSlice";
import { logOut } from "../../redux/features/auth/authSlice";
import { LuMenu } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import { FaGear } from "react-icons/fa6";
import FavouritesCount from "../Products/FavouritesCount";
import { useGetReviewedProductsQuery } from "../../redux/api/productsApiSlice";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const { data } = useGetCartQuery();
  const { data: reviewed } = useGetReviewedProductsQuery();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenu(!mobileMenu);
  };

  // eslint-disable-next-line no-unused-vars
  const toggleSideBar = () => {
    setShowSidebar(!showSidebar);
  };

  // eslint-disable-next-line no-unused-vars
  const closeSideBar = () => {
    setShowSidebar(false);
  };

  const disptach = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      disptach(logOut());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div
        style={{ zIndex: 999 }}
        id="navigation-container"
        className={`${
          showSidebar ? "hidden" : "flex"
        } xl:flex max-lg:hidden flex-col justify-between p-4 text-white bg-black h-[100vh] sm-h-[100svh] fixed`}
      >
        <div className="flex flex-col justify-center space-y-[4px]">
          <NavLink
            to="/"
            className="flex items-center transition-transform transform hover:translate-x-2"
            style={({ isActive }) => ({
              color: isActive ? "#DB2777" : "white",
            })}
          >
            <AiOutlineHome className={`mr-2 mt-[3rem]`} size={26} />
            <span className={`hidden nav-item-name mt-[3rem]`}>HOME</span>
          </NavLink>
          <NavLink
            to="/shop"
            className="flex items-center transition-transform transform hover:translate-x-2"
            style={({ isActive }) => ({
              color: isActive ? "#DB2777" : "white",
            })}
          >
            <AiOutlineShopping className={`mr-2 mt-[3rem]`} size={26} />
            <span className={`hidden nav-item-name mt-[3rem]`}>SHOP</span>
          </NavLink>
          <NavLink
            to="/cart"
            className="flex relative items-center transition-transform transform hover:translate-x-2"
            style={({ isActive }) => ({
              color: isActive ? "#DB2777" : "white",
            })}
          >
            <AiOutlineShoppingCart className={`mr-2 mt-[3rem]`} size={26} />
            <span className={`hidden nav-item-name mt-[3rem]`}>CART</span>
            <div className="absolute left-8 top-2 lg:left-4 lg:top-10 xl:left-5 xl:top-9">
              {data && data?.cart?.products.length > 0 && (
                <span className="flex justify-center p-2 items-center text-sm text-white bg-pink-500 w-4 h-4 rounded-full">
                  {data.cart.products.reduce((acc, item) => acc + item.qty, 0)}
                </span>
              )}
            </div>
          </NavLink>
          <NavLink
            to="/reviewedproducts"
            className="flex relative items-center transition-transform transform hover:translate-x-2"
            style={({ isActive }) => ({
              color: isActive ? "#DB2777" : "white",
            })}
          >
            <FaStar className={`mr-2 mt-[3rem]`} size={26} />
            <span className={`hidden nav-item-name mt-[3rem]`}>REVIEWED</span>
            <div className="absolute left-8 top-2 lg:left-4 lg:top-10 xl:left-5 xl:top-9">
              {reviewed && reviewed?.products.length > 0 && (
                <span className="flex justify-center p-2 items-center text-sm text-white bg-pink-500 w-4 h-4 rounded-full">
                  {reviewed.products.length}
                </span>
              )}
            </div>
          </NavLink>
          <NavLink
            to="/favourite"
            className="flex relative items-center transition-transform transform hover:translate-x-2"
            style={({ isActive }) => ({
              color: isActive ? "#DB2777" : "white",
            })}
          >
            <FaHeart className={`mr-2 mt-[3rem]`} size={26} />
            <span className={`hidden nav-item-name mt-[3rem]`}>FAVOURITE</span>
            <FavouritesCount />
          </NavLink>
        </div>

        <div className="relative">
          <button
            onClick={toggleDropdown}
            // onBlur={(e) => (document.querySelector("#dropdown").childNodes.forEach(el => e.target !== el && e.target !==(document.querySelector("#dropdown"))  ?  toggleDropdown() : null))}

            className="-translate-x-2 text-[8px] ease-in-out flex items-center text-gray-500 focus:outline-none cursor-pointer username rounded px-2 py-1"
          >
            {userInfo ? <span>{userInfo.username}</span> : <></>}
            {userInfo && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 ml-1 arrow hidden ${
                  dropdownOpen ? "transform rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={dropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                />
              </svg>
            )}
          </button>

          {dropdownOpen && userInfo && (
            <ul
              id="dropdown"
              className={`absolute shadow-2xl rounded left-9 xl:left-22 mt-2 mr-14 spase-y-2 bg-[#111111] text-gray-600 ${
                !userInfo.isAdmin ? "-top-20" : "-top-95"
              }`}
            >
              {userInfo.isAdmin && (
                <>
                  <li>
                    <NavLink
                      to="/admin/dashboard"
                      className="block px-4 py-2 text-white hover:bg-stone-800/30"
                      style={({ isActive }) => ({
                        color: isActive ? "#DB2777" : "white",
                      })}
                    >
                      Dashboard
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/admin/productlist"
                      className="block px-4 py-2 text-white hover:bg-stone-800/30"
                      style={({ isActive }) => ({
                        color: isActive ? "#DB2777" : "white",
                      })}
                    >
                      Create Product
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/admin/allproductslist"
                      className="block px-4 py-2 text-white hover:bg-stone-800/30"
                      style={({ isActive }) => ({
                        color: isActive ? "#DB2777" : "white",
                      })}
                    >
                      All Products
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/admin/categorylist"
                      className="block px-4 py-2 text-white hover:bg-stone-800/30"
                      style={({ isActive }) => ({
                        color: isActive ? "#DB2777" : "white",
                      })}
                    >
                      Categories
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/admin/orderlist"
                      className="block px-4 py-2 text-white hover:bg-stone-800/30"
                      style={({ isActive }) => ({
                        color: isActive ? "#DB2777" : "white",
                      })}
                    >
                      Orders
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/admin/userlist"
                      className="block px-4 py-2 text-white hover:bg-stone-800/30"
                      style={({ isActive }) => ({
                        color: isActive ? "#DB2777" : "white",
                      })}
                    >
                      Users
                    </NavLink>
                  </li>
                </>
              )}
              <li>
                <NavLink
                  to="/profile"
                  className="block px-4 py-2 text-white hover:bg-stone-800/30"
                  style={({ isActive }) => ({
                    color: isActive ? "#DB2777" : "white",
                  })}
                >
                  Profile
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/Logout"
                  onClick={logoutHandler}
                  className="block px-4 py-2 text-white hover:bg-stone-800/30"
                  style={({ isActive }) => ({
                    color: isActive ? "#DB2777" : "white",
                  })}
                >
                  Logout
                </NavLink>
              </li>
            </ul>
          )}
        </div>

        {!userInfo && (
          <ul>
            <li>
              <NavLink
                to="/login"
                className="flex items-center transition-transform transform hover:translate-x-2"
                style={({ isActive }) => ({
                  color: isActive ? "#DB2777" : "white",
                })}
              >
                <AiOutlineLogin className={`mr-2 mt-[3rem]`} size={26} />
                <span className={`hidden nav-item-name mt-[3rem]`}>Login</span>
              </NavLink>
              <NavLink
                to="/register"
                className="flex items-center transition-transform transform hover:translate-x-2"
                style={({ isActive }) => ({
                  color: isActive ? "#DB2777" : "white",
                })}
              >
                <AiOutlineUserAdd className={`mr-2 mt-[3rem]`} size={26} />
                <span className={`hidden nav-item-name mt-[3rem]`}>
                  Sign up
                </span>
              </NavLink>
            </li>
          </ul>
        )}
      </div>

      <div className="lg:hidden z-1000 text-white flex items-center justify-between bg-stone-900 p-2 relative">
        <div>
          <button
            onClick={toggleMobileMenu}
            className="cursor-pointer hover:bg-stone-900/70 p-[3px] rounded-lg"
          >
            {mobileMenu ? (
              <IoClose className="text-4xl rounded-lg" />
            ) : (
              <LuMenu className="text-4xl rounded-lg" />
            )}
          </button>
          <div
            className={`absolute left-[2rem] rounded-lg bg-[#111111] shadow-md shadow-cyan-900/90 w-[fit] items-center flex flex-col justify-center space-y-[4px] mx-auto duration-[.3s] transition-opacity opacity-0 -translate-y-[30rem] delay-[.1s] ${
              mobileMenu ? "translate-y-0 opacity-[100%]" : null
            } ease-in-out`}
          >
            <NavLink
              to="/"
              className="flex rounded-t-lg items-center transform w-full hover:text-pink-600 transition-all duration-[.3s] p-4 hover:bg-stone-800/90"
              style={({ isActive }) => ({
                color: isActive ? "#DB2777" : "white",
              })}
            >
              <AiOutlineHome className="mr-2" size={26} />
              <span>HOME</span>
            </NavLink>
            <NavLink
              to="/shop"
              className="flex items-center transform w-full hover:text-pink-600 transition-all duration-[.3s] p-4 hover:bg-stone-800/90"
              style={({ isActive }) => ({
                color: isActive ? "#DB2777" : "white",
              })}
            >
              <AiOutlineShopping className="mr-2" size={26} />
              <span>SHOP</span>
            </NavLink>
            <NavLink
              to="/cart"
              className="flex relative items-center transform w-full hover:text-pink-600 transition-all duration-[.3s] p-4 hover:bg-stone-800/90"
              style={({ isActive }) => ({
                color: isActive ? "#DB2777" : "white",
              })}
            >
              <AiOutlineShoppingCart className="mr-2" size={26} />
              <span>CART</span>
              <div className="absolute left-8 top-2 lg:left-4 lg:top-10 xl:left-5 xl:top-9">
                {data && data?.cart?.products.length > 0 && (
                  <span className="flex justify-center p-2 items-center text-sm text-white bg-pink-500 w-4 h-4 rounded-full">
                    {data.cart.products.reduce(
                      (acc, item) => acc + item.qty,
                      0
                    )}
                  </span>
                )}
              </div>
            </NavLink>
            <NavLink
              to="/reviewedproducts"
              className="flex relative items-center transform w-full hover:text-pink-600 transition-all duration-[.3s] p-4 hover:bg-stone-800/90"
              style={({ isActive }) => ({
                color: isActive ? "#DB2777" : "white",
              })}
            >
              <FaStar className="mr-2" size={26} />
              <span>REVIEWED</span>
              <div className="absolute left-8 top-2 lg:left-4 lg:top-10 xl:left-5 xl:top-9">
                {reviewed && reviewed?.products.length > 0 && (
                  <span className="flex justify-center p-2 items-center text-sm text-white bg-pink-500 w-4 h-4 rounded-full">
                    {reviewed.products.length}
                  </span>
                )}
              </div>
            </NavLink>
            <NavLink
              to="/favourite"
              className="rounded-b-lg flex relative items-center transform w-full hover:text-pink-600 transition-all duration-[.3s] p-4 hover:bg-stone-800/90"
              style={({ isActive }) => ({
                color: isActive ? "#DB2777" : "white",
              })}
            >
              <FaHeart className="mr-2" size={26} />
              <span>FAVOURITE</span>
              <FavouritesCount />
            </NavLink>
          </div>
        </div>

        {userInfo ? (
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="cursor-pointer hover:bg-stone-900/70 p-[3px] rounded-lg"
            >
              <FaGear
                className={`text-3xl fa fa-spinner rounded-lg ${
                  dropdownOpen ? "animate-spin" : null
                }`}
              />
            </button>
            {dropdownOpen && (
              <ul
                id="dropdown"
                className={`absolute shadow-md shadow-cyan-900/90 rounded right-[-20px] top-[1.2rem] xl:left-0 mt-2 mr-14 spase-y-2 bg-[#111111] text-gray-600`}
              >
                {userInfo.isAdmin && (
                  <>
                    <li>
                      <NavLink
                        to="/admin/dashboard"
                        className="block px-4 py-2 text-white hover:bg-stone-800/30"
                        style={({ isActive }) => ({
                          color: isActive ? "#DB2777" : "white",
                        })}
                      >
                        Dashboard
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/admin/productlist"
                        className="block px-4 py-2 text-white hover:bg-stone-800/30"
                        style={({ isActive }) => ({
                          color: isActive ? "#DB2777" : "white",
                        })}
                      >
                        Create Product
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/admin/allproductslist"
                        className="block px-4 py-2 text-white hover:bg-stone-800/30"
                        style={({ isActive }) => ({
                          color: isActive ? "#DB2777" : "white",
                        })}
                      >
                        All Products
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/admin/categorylist"
                        className="block px-4 py-2 text-white hover:bg-stone-800/30"
                        style={({ isActive }) => ({
                          color: isActive ? "#DB2777" : "white",
                        })}
                      >
                        Categories
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/admin/orderlist"
                        className="block px-4 py-2 text-white hover:bg-stone-800/30"
                        style={({ isActive }) => ({
                          color: isActive ? "#DB2777" : "white",
                        })}
                      >
                        Orders
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/admin/userlist"
                        className="block px-4 py-2 text-white hover:bg-stone-800/30"
                        style={({ isActive }) => ({
                          color: isActive ? "#DB2777" : "white",
                        })}
                      >
                        Users
                      </NavLink>
                    </li>
                  </>
                )}
                <li>
                  <NavLink
                    to="/profile"
                    className="block px-4 py-2 text-white hover:bg-stone-800/30"
                    style={({ isActive }) => ({
                      color: isActive ? "#DB2777" : "white",
                    })}
                  >
                    Profile
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/Logout"
                    onClick={logoutHandler}
                    className="block px-4 py-2 text-white hover:bg-stone-800/30"
                    style={({ isActive }) => ({
                      color: isActive ? "#DB2777" : "white",
                    })}
                  >
                    Logout
                  </NavLink>
                </li>
              </ul>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <NavLink
              to="/login"
              className="flex items-center transition-all space-x-2 hover:bg-stone-900 rounded p-2"
              style={({ isActive }) => ({
                color: isActive ? "#DB2777" : "white",
              })}
            >
              <span>Login</span>
              <AiOutlineLogin className={`mr-2`} size={26} />
            </NavLink>
            <NavLink
              to="/register"
              className="flex items-center transition-all space-x-2 hover:bg-stone-900 rounded p-2"
              style={({ isActive }) => ({
                color: isActive ? "#DB2777" : "white",
              })}
            >
              <span>Sign up</span>
              <AiOutlineUserAdd className={`mr-2`} size={26} />
            </NavLink>
          </div>
        )}
      </div>
    </>
  );
};

export default Navigation;
