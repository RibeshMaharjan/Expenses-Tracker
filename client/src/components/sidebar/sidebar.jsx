/* 
  icon import
*/
import FirstPageOutlinedIcon from "@mui/icons-material/FirstPageOutlined";
import LastPageOutlinedIcon from "@mui/icons-material/LastPageOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

/* 
  react imports
*/
import {createContext, useContext, useEffect, useState} from "react";
import { NavLink } from "react-router-dom";
import {useUserContext} from "../../context/UserContext.jsx";
import {useStockContent} from "../../context/StockContext.jsx";

const SidebarContext = createContext();

const Sidebar = ({ children }) => {
  const [expanded, setExpanded] = useState(true);
  const { user } = useUserContext();


  return (
    <>
      <aside className="h-screen w-0 overflow-hidden lg:w-auto lg:overflow-visible">
        <nav className="h-full flex flex-col bg-white border-r shadow-sm">
          <div className="p-4 pb-2 flex justify-between items-center">
            <h1
              className={`text-nowrap overflow-hidden transition-all ${
                expanded ? "w-32" : "w-0"
              }`}
            >
              Expenses Tracker
            </h1>
            <button
              onClick={() => setExpanded((curr) => !curr)}
              className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
            >
              {expanded ? <FirstPageOutlinedIcon /> : <LastPageOutlinedIcon />}
            </button>
          </div>

          <SidebarContext.Provider value={{ expanded }}>
            <ul className="flex-1 px-3">{children}</ul>
          </SidebarContext.Provider>

          <div className="border-t flex p-3">
            <div className="w-10 h-10 rounded-md bg-green-200 flex justify-center items-center">
              { user.initials }
            </div>
            <div
              className={`flex justify-between items-center 
            text-nowrap overflow-hidden transition-all ${
              expanded ? "w-44 2xl:w-56 ml-3" : "w-0"
            }
            `}
            >
              <div className="leading-4">
                <h4 className="font-semibold">{ user.name }</h4>
                <span className="text-xs to-gray-600">{ user.email }</span>
              </div>
              <LogoutOutlinedIcon />
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
};

export const SidebarItem = ({ title, icon, link, active }) => {
  const { expanded } = useContext(SidebarContext);

  return (
    <NavLink
      to={link}
      className={`group relative flex items-center py-2 px-3 my-1 text-base 2xl:text-lg font-semibold rounded-md cursor-pointer text-gray-600 `}
    >
      {icon}
      <div
        className={`h-8 leading-8 overflow-hidden transition-all ${
          expanded ? "w-44 2xl:w-56   ml-3" : "w-0"
        }`}
      >
        {title}
      </div
>
      {!expanded && (
        <div
          className="absolute left-full text-nowrap rounded-md px-2 py-2 ml-6 bg-green-200 text-green-800 leading-3 invisible opacity-20 z-10 -translate-x-3 transition-all
        group-hover:visible group-hover:opacity-100 group-hover:translate-x-0"
        >
          {title}
        </div>
      )}
    </NavLink>
  );
};

export default Sidebar;
