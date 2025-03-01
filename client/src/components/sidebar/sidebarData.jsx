import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import ShowChartOutlinedIcon from "@mui/icons-material/ShowChartOutlined";

export const SidebarData = [
  {
    title: "Home",
    icon: <DashboardOutlinedIcon />,
    link: "/dashboard",
  },
  {
    title: "My Banks",
    icon: <PaidOutlinedIcon />,
    link: "/bankaccount",
  },
  {
    title: "Bank Transaction",
    icon: <ReceiptOutlinedIcon />,
    link: "/transaction",
  },
  {
    title: "My Stocks",
    icon: <ShowChartOutlinedIcon />,
    link: "/stock",
  },
  {
    title: "Stock Transaction",
    icon: <ReceiptLongOutlinedIcon />,
    link: "/stocktransaction",
  },
];
