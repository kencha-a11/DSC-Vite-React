// import {
//   DollarIcon,
//   BasketIcon,
//   BoxIcon,
//   ReceiptIcon,
//   UserIcon,
//   AlarmIcon
// } from '../../components/icons';

import DollarIcon from '@mui/icons-material/AttachMoney';
import BasketIcon from '@mui/icons-material/ShoppingBasket';
import BoxIcon from '@mui/icons-material/ViewInAr';
import ReceiptIcon from '@mui/icons-material/ReceiptLong';
import UserIcon from '@mui/icons-material/AssignmentInd';
import AlarmIcon from '@mui/icons-material/AccessAlarm';


const StatCard = ({ type, value, percentageChange, isIncrease }) => {
  // Arrow and color logic for percentage cards
  const percentTextColor = isIncrease ? "text-green-600" : "text-red-600";
  const percentBgColor = isIncrease ? "bg-green-100" : "bg-red-100";
  const arrow = isIncrease ? "↑" : "↓";

  // Dashboard card types with JSX icons
  const cardTypes = {
    totalSales: { label: "Total Sales", icon: <DollarIcon /> },
    totalItems: { label: "Total Items Sold", icon: <BasketIcon /> },
    totalTransactions: { label: "Total Transactions", icon: <ReceiptIcon /> },
    inventoryCount: { label: "Inventory Count", icon: <BoxIcon /> },
    activeUsers: { label: "Active Users", icon: <UserIcon /> },
    totalLogs: { label: "User Log", icon: <AlarmIcon /> },
  };

  // Fallback for unknown types
  const current = cardTypes[type] || {
    label: type,
    icon: <div className="w-5 h-5 bg-gray-300" />,
  };

  // Status content: arrow or active badge
  let statusContent;
  if (type === "activeUsers") {
    statusContent = (
      <div className="flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
        Active
      </div>
    );
  } else if (type !== "totalLogs") {
    // Only sales/items/transactions show arrow + percentage
    statusContent = (
      <div
        className={`flex items-center px-3 py-1 rounded-full text-sm font-semibold ${percentBgColor} ${percentTextColor}`}
      >
        <span className="mr-1">{arrow}</span>
        <span>{percentageChange}</span>
      </div>
    );
  } else {
    // totalLogs has no badge/statusContent
    statusContent = null;
  }

  return (
    <div className="p-4 border border-gray-200 rounded-xl bg-white shadow-sm w-full">
      <div className="w-10 h-10 flex items-center justify-center mb-4 border border-gray-300 rounded-lg">
        {current.icon}
      </div>
      <p className="mb-2 text-lg text-gray-600">{current.label}</p>
      <div className="flex items-center justify-between">
        {/* Show value prominently for all cards */}
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {/* Show status content only if not totalLogs or activeUsers */}
        {statusContent}
      </div>
    </div>
  );
};

export default StatCard;
