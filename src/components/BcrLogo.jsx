const BcrLogo = () => (
  <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Top Orange Swoosh */}
    <path d="M15 40 C 25 15, 60 10, 80 25 C 60 15, 30 20, 20 40 Z" fill="#f39221" />
    {/* Top Blue Swoosh */}
    <path d="M25 40 C 35 15, 75 15, 85 40 C 70 25, 45 25, 35 40 Z" fill="#0271b8" />
    
    {/* Bottom Blue Swoosh */}
    <path d="M15 60 C 25 85, 65 85, 75 60 C 55 75, 30 75, 20 60 Z" fill="#0271b8" />
    {/* Bottom Orange Swoosh */}
    <path d="M25 60 C 40 80, 75 85, 85 60 C 65 75, 40 80, 35 60 Z" fill="#f39221" />

    <text x="50" y="56" fontFamily="Arial, sans-serif" fontSize="28" fontWeight="bold" fontStyle="italic" fill="#0271b8" textAnchor="middle">BCR</text>
  </svg>
);

export default BcrLogo;
