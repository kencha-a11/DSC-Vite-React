export const SettingsIcon = ({ className = "w-5 h-5", strokeWidth = 2 }) => (
  <svg
    className={className}
    fill="currentColor" // Changed to fill the circles
    stroke="none" // No need for a stroke if we're just drawing filled dots
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Top Dot */}
    <circle cx="12" cy="5" r="2" />
    {/* Middle Dot */}
    <circle cx="12" cy="12" r="2" />
    {/* Bottom Dot */}
    <circle cx="12" cy="19" r="2" />
  </svg>
);
