import React from "react";
import Logo from "../assets/MainLogo.png";
import "../styles/navbar.css"; 

export default function Navbar({ setItemClicked }) {
  
  function handleItemClick(item) {
    setItemClicked(item);
  }

  return (
    <div className=" z-50 !max-h-[76px] overflow-hidden items-center justify-center">
      <nav className="bg-[#d87940] py-4">
        <div className="flex items-center w-full">
          <div className="ml-2  sm:ml-4 md:ml-6 flex items-center text-left text-black font-semibold text-sm sm:text-lg md:text-xl w-full">
            <ul className="flex sm:space-x-4 items-center">
              <li className="cursor-pointer hover:bg-[#E3EFF2] rounded-md px-2 transition-all">
                <button onClick={() => handleItemClick("home")}>Home</button>
              </li>
              <li className="cursor-pointer hover:bg-[#E3EFF2] rounded-md px-2 transition-all">
                <button onClick={() => handleItemClick("about")}>About</button>
              </li>             
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
