export const PlusIcon = ({ className = "w-5 h-5", strokeWidth = 2 }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <line x1="12" y1="5" x2="12" y2="19" strokeLinecap="round" />
    <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
  </svg>
);
