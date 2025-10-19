// StatCard Component
export default function StatCard ({ title, value, change, changeType = "percent", icon, iconBg, iconColor }) {
  const isPositive = change >= 0;
  
  return (
    <div className="flex justify-between items-center p-6 bg-white rounded-lg shadow">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
        <div className={`flex items-center mt-2 text-sm font-medium ${
          isPositive ? "text-green-500" : "text-red-500"
        }`}>
          <span className="mr-1">{isPositive ? "▲" : "▼"}</span>
          <span>
            {isPositive ? `+${change}` : change}
            {changeType === "percent" ? "%" : ""}{" "}
            <span className="text-gray-400 font-normal">
              vs last {changeType === "percent" ? "month" : "period"}
            </span>
          </span>
        </div>
      </div>
      <div className={`p-3 rounded-lg ${iconBg}`}>
        <span className={`text-xl font-bold ${iconColor}`}>{icon}</span>
      </div>
    </div>
  );
};