import React from 'react';

/** Flat vector SVG stack of blue books with sparkle stars (matching reference image) */
export const BooksIllustration: React.FC<{ className?: string }> = ({ className = "w-full h-44" }) => {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* Decorative twinkle sparkle stars */}
      <svg className="absolute top-2 left-6 w-5 h-5 text-white/90 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
      </svg>
      <svg className="absolute top-10 right-8 w-4 h-4 text-white/80 animate-pulse delay-300" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
      </svg>
      <svg className="absolute bottom-6 left-12 w-3.5 h-3.5 text-white/70 animate-pulse delay-700" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
      </svg>

      {/* Main SVG stack of flat-style blue books */}
      <svg viewBox="0 0 260 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full max-h-48 drop-shadow-md">
        {/* Shadow under books */}
        <ellipse cx="130" cy="180" rx="80" ry="12" fill="#B9A6E3" fillOpacity="0.4" />

        {/* BOTTOM BOOK (Thick Blue Binder) */}
        <g transform="translate(42, 118)">
          {/* Spine and bottom cover */}
          <path d="M15 42C15 48 30 52 50 52H145C165 52 175 48 175 42V15C175 22 165 26 145 26H50C30 26 15 22 15 15V42Z" fill="#3B74B8" />
          {/* Book pages (White) */}
          <path d="M18 16C18 22 32 26 50 26H145C163 26 172 22 172 16V10C172 16 163 20 145 20H50C32 20 18 16 18 10V16Z" fill="#FFFFFF" />
          <path d="M18 28C18 34 32 38 50 38H145C163 38 172 34 172 28V22C172 28 163 32 145 32H50C32 32 18 28 18 22V28Z" fill="#F4F7FC" />
          {/* Top cover (Soft blue) */}
          <path d="M50 22C30 22 15 18 15 12C15 6 30 2 50 2H145C165 2 175 6 175 12C175 18 165 22 145 22H50Z" fill="#5891D8" />
          {/* Spine ribs */}
          <path d="M40 8C40 14 30 18 20 18" stroke="#2D5A92" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M40 32C40 38 30 42 20 42" stroke="#2D5A92" strokeWidth="2.5" strokeLinecap="round" />
        </g>

        {/* MIDDLE BOOK (Tilted Medium Blue) */}
        <g transform="translate(46, 75) rotate(-5 80 30)">
          {/* Spine & Pages */}
          <path d="M18 36C18 42 30 46 50 46H135C155 46 165 42 165 36V12C165 18 155 22 135 22H50C30 22 18 18 18 12V36Z" fill="#4B82C6" />
          <path d="M22 15C22 21 32 24 50 24H135C153 24 162 21 162 15V10C162 16 153 19 135 19H50C32 19 22 16 22 10V15Z" fill="#FFFFFF" />
          {/* Top cover */}
          <path d="M50 20C30 20 18 16 18 10C18 4 30 0 50 0H135C155 0 165 4 165 10C165 16 155 20 135 20H50Z" fill="#6FA8E8" />
          {/* Spine accents */}
          <path d="M38 6C38 11 30 14 22 14" stroke="#3666A1" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* TOP BOOK (Open/Slanted Light Blue) */}
        <g transform="translate(68, 40) rotate(8 70 20)">
          {/* Spine */}
          <path d="M15 28C15 34 26 38 45 38H120C136 38 145 34 145 28V10C145 15 136 18 120 18H45C26 18 15 15 15 10V28Z" fill="#5891D8" />
          {/* Pages */}
          <path d="M18 13C18 18 28 21 45 21H120C134 21 142 18 142 13V8C142 13 134 16 120 16H45C28 16 18 13 18 8V13Z" fill="#FFFFFF" />
          {/* Top cover */}
          <path d="M45 16C26 16 15 13 15 8C15 3 26 0 45 0H120C136 0 145 3 145 8C145 13 136 16 120 16H45Z" fill="#8BBBF0" />
        </g>
      </svg>
    </div>
  );
};
