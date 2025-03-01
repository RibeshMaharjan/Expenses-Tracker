/* 
  icon import
*/
import FirstPageOutlinedIcon from "@mui/icons-material/FirstPageOutlined";
import LastPageOutlinedIcon from "@mui/icons-material/LastPageOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

/* icon imports */
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import ShowChartOutlinedIcon from "@mui/icons-material/ShowChartOutlined";

/* 
  react imports
*/
import { createContext, useContext, useState } from "react";

const MobileNavContext = createContext();

const MobileNav = ({ children }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between">
        <h1>Expenses Tracker</h1>
        <button
          className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
          onClick={() => setExpanded((curr) => !curr)}
        >
          {!expanded ? "Open" : "Close"}
        </button>
      </div>
      <aside
        className={`absolute left-0 top-0 h-full w-full transition-all ${
          expanded || "-translate-x-full"
        }`}
      >
        <nav className={`h-full flex flex-col bg-white border-r shadow-sm`}>
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
              {expanded && <FirstPageOutlinedIcon />}
            </button>
          </div>

          <MobileNavContext.Provider value={{ expanded }}>
            <ul className={`flex-1 px-3`}>
              {" "}
              <MobileNavItem
                title="Home"
                icon={<DashboardOutlinedIcon />}
                link="/dashboard"
              ></MobileNavItem>
              <MobileNavItem
                title="My Banks"
                icon={<PaidOutlinedIcon />}
                link="/bankaccount"
              ></MobileNavItem>
              <MobileNavItem
                title="Bank Transaction"
                icon={<ReceiptOutlinedIcon />}
                link="/transaction"
                active
              ></MobileNavItem>
              <MobileNavItem
                title="My Stocks"
                icon={<ShowChartOutlinedIcon />}
                link="/stock"
              ></MobileNavItem>
              <MobileNavItem
                title="Stock Transaction"
                icon={<ReceiptLongOutlinedIcon />}
                link="/stocktransaction"
              ></MobileNavItem>
            </ul>
          </MobileNavContext.Provider>

          <div className="border-t flex p-3">
            <div className="w-10 h-10 rounded-md bg-green-200 flex justify-center items-center">
              AM
            </div>
            <div
              className={`flex justify-between items-center 
            text-nowrap overflow-hidden transition-all ${
              expanded ? "w-52 ml-3" : "w-0"
            }
            `}
            >
              <div className="leading-4">
                <h4 className="font-semibold">Asura Maharjan</h4>
                <span className="text-xs to-gray-600">example@gmail.comm</span>
              </div>
              <LogoutOutlinedIcon />
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
};

export const MobileNavItem = ({ title, icon, link, active }) => {
  const { expanded } = useContext(MobileNavContext);

  return (
    <li
      className={`group relative flex items-center py-2 px-3 my-1 text-lg font-semibold rounded-md cursor-pointer transition-colors ${
        active
          ? "bg-gradient-to-r from-green-500 to-lime-400 text-white"
          : "hover:bg-green-100 text-gray-600"
      }`}
    >
      {icon}
      <span
        className={`h-8 leading-8 overflow-hidden transition-all ${
          expanded ? "w-52 ml-3" : "w-0"
        }`}
      >
        {title}
      </span>
      {!expanded && (
        <div
          className="absolute left-full text-nowrap rounded-md px-2 py-2 ml-6 bg-green-200 text-green-800 leading-3 invisible opacity-20 z-10 -translate-x-3 transition-all
        group-hover:visible group-hover:opacity-100 group-hover:translate-x-0"
        >
          {title}
        </div>
      )}
    </li>
  );
};

export default MobileNav;
