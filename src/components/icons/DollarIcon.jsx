export const DollarIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      className="w-5 h-5 text-gray-500"
    >
      {/* Vertical Line/Strike-through */}
      <path d="M12 2L12 22" strokeLinecap="round" strokeLinejoin="round" />
      
      {/* S-shape for the Dollar Sign */}
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};