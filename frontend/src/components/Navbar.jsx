import React from "react";
import { assets } from "../assets/assets";
import { NavLink } from "react-router-dom";
const Navbar = () => {
  return (
    <div className=" flex justify-between items-center text-sm py-4 mb-5 border-b border-b-gray-400">
      <img className="w-44 cursor-pointer" src={assets.logo} />
      <ul className="hidden  md:flex items-start gap-5 font-medium ">
        <NavLink>
          <li>HOME</li>
          <hr />
        </NavLink>{" "}
        <NavLink>
          <li>ALL DOCTORS</li>
          <hr />
        </NavLink>{" "}
        <NavLink>
          <li>ABOUT</li>
          <hr />
        </NavLink>{" "}
        <NavLink>
          <li>CONTACT</li>
          <hr />
        </NavLink>
      </ul>
      <div>
        <button className="border rounded bg-blue-500 p-2 text-white">
          Create account
        </button>
      </div>
    </div>
  );
};

export default Navbar;
