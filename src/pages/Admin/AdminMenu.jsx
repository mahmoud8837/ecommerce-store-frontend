import { useState } from "react";
import { NavLink } from "react-router-dom";
import { LuMenu } from "react-icons/lu";
import { IoClose } from "react-icons/io5";

const AdminMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <button
        className={`top-7 right-5 fixed rounded-lg max-lg:mt-[3rem] bg-gray-800 cursor-pointer hover:bg-gray-900/90 duration-[.3s] p-[3px]`}
        onClick={toggleMenu}
        aria-label="Admin Menu"
      >
        {isMenuOpen ? (
          <IoClose className="text-4xl rounded-lg" />
        ) : (
          <LuMenu className="text-4xl rounded-lg" />
        )}
      </button>

      {isMenuOpen && (
        <ul
          className={`fixed shadow-md p-2 shadow-cyan-900/90 rounded right-12 top-18 max-lg:mt-[3rem] bg-[#111111] text-gray-600`}
        >
          <li>
            <NavLink
              to="/admin/dashboard"
              className="block px-4 py-2 text-white hover:bg-stone-800/30"
              style={({ isActive }) => ({
                color: isActive ? "#DB2777" : "white",
              })}
            >
              Admin Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/productlist"
              className="block px-4 py-2 my-2 text-white hover:bg-stone-800/30"
              style={({ isActive }) => ({
                color: isActive ? "#DB2777" : "white",
              })}
            >
              Create Product
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/categorylist"
              className="block px-4 py-2 my-2 text-white hover:bg-stone-800/30"
              style={({ isActive }) => ({
                color: isActive ? "#DB2777" : "white",
              })}
            >
              Create Category
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/allproductslist"
              className="block px-4 py-2 my-2 text-white hover:bg-stone-800/30"
              style={({ isActive }) => ({
                color: isActive ? "#DB2777" : "white",
              })}
            >
              All Products
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/userlist"
              className="block px-4 py-2 my-2 text-white hover:bg-stone-800/30"
              style={({ isActive }) => ({
                color: isActive ? "#DB2777" : "white",
              })}
            >
              Manage Users
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
              Manage Orders
            </NavLink>
          </li>
        </ul>
      )}
    </>
  );
};

export default AdminMenu;
