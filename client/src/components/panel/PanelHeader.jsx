import {useUserContext} from "../../context/UserContext.jsx";
import {Headset} from "@mui/icons-material";


const PanelHeader = ({ children }) => {
  const {user} = useUserContext();

  return (
    <>
      <div className="mb-8" id="dashboard-header">
        {children}
      </div>
    </>
  );
}

export const MainHeaderContent = ({ children }) => {
  return (
    <h1 className="text-2xl lg:text-4xl font-bold capitalize">
      { children }
    </h1>
  );
}
export const SubHeaderContent = ({ children }) => {
  return (
    <h1 className="text-base lg:text-lg font-bold capitalize">
      { children }
    </h1>
  );
}

export default PanelHeader;