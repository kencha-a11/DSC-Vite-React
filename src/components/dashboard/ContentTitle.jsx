// src/components/dashboard/ContentTitle.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

const getInitial = (name) => name?.charAt(0).toUpperCase() || "?";

export default function ContentTitle({ Title }) {
  const { user } = useAuth(); // get authenticated user
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  // Function to format date as MM/DD/YYYY
  const formatDate = (date) =>
    `${String(date.getMonth() + 1).padStart(2, "0")}/${String(
      date.getDate()
    ).padStart(2, "0")}/${date.getFullYear()}`;

  // Function to format time as hh:mm AM/PM
  const formatTime = (date) => {
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentDate(formatDate(now));
      setCurrentTime(formatTime(now));
    };

    updateDateTime(); // initial set
    const interval = setInterval(updateDateTime, 1000); // update every second

    return () => clearInterval(interval); // cleanup
  }, []);

  if (!user) return null; // optional: handle loading/no user

  return (
    <div className="flex justify-between items-center px-4 py-5 border-b">
      <div className="text-2xl font-bold text-gray-800">{Title}</div>
      <div className="text-right text-gray-500 text-sm">
        <div>{currentDate}</div>
        <div>{currentTime}</div>
      </div>
    </div>
  );
}
