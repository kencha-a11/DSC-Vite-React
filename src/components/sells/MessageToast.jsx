import { useEffect, useState } from "react";

export default function MessageToast({ message, duration = 5000 }) {
  const [visible, setVisible] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");

  useEffect(() => {
    if (!message) return;

    setCurrentMessage(message);
    setVisible(true);

    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [message, duration]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white px-4 py-2 rounded shadow-lg transition-opacity duration-300">
      {currentMessage}
    </div>
  );
}
