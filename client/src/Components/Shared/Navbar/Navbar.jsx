import { Link, NavLink } from "react-router-dom";

import useAdmin from "../../../hooks/useAdmin.js";
import useAuth from "../../../hooks/useAuth.js";
import useCurrentUser from "../../../hooks/useCurrentUser.js";
import "./Navbar.css";

import { useState } from "react";
import logo2 from "../../../assets/Logo.png";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isAdmin] = useAdmin();
  const { currentUser } = useCurrentUser();
  const role = currentUser[0]?.role;
  const [visible, setVisible] = useState(false);

  const handleDropDown = () => {
    setVisible(!visible);
  };

  const navLinks = (
    <>
      <li onClick={handleDropDown}>
        <NavLink to="/">Home</NavLink>
      </li>
      <li onClick={handleDropDown}>
        <NavLink to="/requests">Requests</NavLink>
      </li>
      <li onClick={handleDropDown}>
        <NavLink to="/blogs">Blogs</NavLink>
      </li>

      {user ? (
        <>
          {user && isAdmin && (
            <li onClick={handleDropDown}>
              <Link to="/dashboard/adminHome">Dashboard</Link>
            </li>
          )}
          {user && role == "volunteer" && (
            <li onClick={handleDropDown}>
              <Link to="/dashboard/adminHome">Dashboard</Link>
            </li>
          )}
          {user && role === "donor" && (
            <li onClick={handleDropDown}>
              <Link to="/dashboard/userHome">Dashboard</Link>
            </li>
          )}
          <li onClick={handleDropDown}>
            <NavLink to="/funding">Funding</NavLink>
          </li>
        </>
      ) : (
        <>
          <li onClick={handleDropDown}>
            <NavLink to="/login">Login</NavLink>
          </li>
          <li onClick={handleDropDown}>
            <NavLink to="/signup">Signup</NavLink>
          </li>
        </>
      )}
    </>
  );
  return (
    <div className="navbar font-semibold sticky top-0 z-50 bg-white shadow-md">
      <div className="navbar-start">
        <div className="dropdown" onClick={handleDropDown}>
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          {visible && (
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow rounded-box w-52 bg-white"
            >
              {navLinks}
            </ul>
          )}
        </div>
        <Link
          to="/"
          className="flex items-center justify-center-center gap-2 text-xl"
        >
          <img className="w-6" src={logo2} alt="website-logo" />
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{navLinks}</ul>
      </div>
      <div className="navbar-end">
        {user && (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img alt="Tailwind CSS Navbar component" src={user?.photoURL} />
              </div>
            </div>

            <ul
              tabIndex={0}
              className="mt-3 p-2 shadow menu menu-sm dropdown-content rounded-box w-52 bg-white"
            >
              <li className="rounded-md ">
                <Link to="/dashboard/profile">Profile</Link>
              </li>

              <li className=" border-t-2 ">
                <p
                  onClick={() => logout()}
                  className="hover:bg-white hover:text-red-950"
                >
                  Logout
                </p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
