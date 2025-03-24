import { HTMLProps } from 'react';

interface FestivalLogoProps extends HTMLProps<HTMLDivElement> {
  size?: number;
}

export function FestivalLogo({ size = 40, className = '', ...props }: FestivalLogoProps) {
  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      {...props}
    >
      <img
        src="/festival-icon.png"
        alt="DarkEvents Logo"
        className="w-full h-full object-contain"
      />
    </div>
  );
}

export default FestivalLogo;
