import React from 'react';

// ============================================================================
// VECTOR SVG ASSETS & ILLUSTRATIONS (Exact vector recreations from reference)
// ============================================================================

/** Status bar battery icon */
const BatteryIcon: React.FC = () => (
  <svg className="w-4 h-2 text-[#2B3350]" viewBox="0 0 20 10" fill="currentColor">
    <rect x="0.5" y="0.5" width="16" height="9" rx="2" fill="none" stroke="currentColor" strokeWidth="1.2" />
    <rect x="2" y="2" width="10" height="6" rx="1" fill="currentColor" />
    <path d="M17.5 3.5C18.2 3.5 18.5 4 18.5 5C18.5 6 18.2 6.5 17.5 6.5V3.5Z" fill="currentColor" />
  </svg>
);

/** Status bar wifi icon */
const WifiIcon: React.FC = () => (
  <svg className="w-3 h-2.5 text-[#2B3350]" viewBox="0 0 16 12" fill="currentColor">
    <path d="M8 9.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm-4.2-3a5.9 5.9 0 018.4 0 .9.9 0 001.3-1.3 7.8 7.8 0 00-11 0 .9.9 0 001.3 1.3zm-2.8-3a9.9 9.9 0 0114 0 .9.9 0 001.3-1.3 11.8 11.8 0 00-16.6 0 .9.9 0 001.3 1.3z" />
  </svg>
);

/** Status bar cellular signal icon (4 ascending bars) */
const SignalIcon: React.FC = () => (
  <div className="flex items-end gap-[1.5px] h-2.5">
    <div className="w-[2px] h-[3px] bg-[#2B3350] rounded-sm" />
    <div className="w-[2px] h-[5px] bg-[#2B3350] rounded-sm" />
    <div className="w-[2px] h-[7px] bg-[#2B3350] rounded-sm" />
    <div className="w-[2px] h-[9px] bg-[#2B3350] rounded-sm" />
  </div>
);

/** John Smith - Detailed Vector Illustration with Thumbs Up (Center Screen) */
export const JohnSmithIllustration: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Background Circle Fill */}
    <circle cx="60" cy="60" r="60" fill="#FFFFFF" />

    {/* Body / Blue Blazer */}
    <path
      d="M34 120C34 94 44 82 60 82C76 82 86 94 86 120H34Z"
      fill="#3B67B7"
    />
    {/* Inner White Shirt & Tie/Collar */}
    <path d="M52 82L60 98L68 82H52Z" fill="#FFFFFF" />
    <path d="M57 93L60 110L63 93L60 90L57 93Z" fill="#2B3350" />
    <path d="M43 90L52 82L57 98L46 112L43 90Z" fill="#31559E" />
    <path d="M77 90L68 82L63 98L74 112L77 90Z" fill="#31559E" />

    {/* Neck */}
    <rect x="53" y="66" width="14" height="18" rx="4" fill="#F8C7A0" />

    {/* Ears */}
    <circle cx="43" cy="56" r="4.5" fill="#F8C7A0" />
    <circle cx="77" cy="56" r="4.5" fill="#F8C7A0" />

    {/* Face Head */}
    <rect x="44" y="40" width="32" height="34" rx="13" fill="#FCD9BA" />

    {/* Combed Hair */}
    <path
      d="M44 48C44 38 50 32 62 32C74 32 78 37 78 45C78 47 75 46 72 47C69 48 64 45 56 46C48 47 45 49 44 48Z"
      fill="#5A3A28"
    />
    <path d="M43 45C43 42 45 37 50 35C46 38 45 42 45 46L43 45Z" fill="#4A2E1F" />

    {/* Glasses */}
    {/* Left frame */}
    <rect x="47" y="50" width="10" height="8" rx="2" stroke="#2B3350" strokeWidth="1.8" fill="#FFFFFF" fillOpacity="0.4" />
    {/* Right frame */}
    <rect x="63" y="50" width="10" height="8" rx="2" stroke="#2B3350" strokeWidth="1.8" fill="#FFFFFF" fillOpacity="0.4" />
    {/* Glasses Bridge */}
    <path d="M57 53H63" stroke="#2B3350" strokeWidth="1.8" strokeLinecap="round" />
    {/* Left/Right temples */}
    <path d="M47 53H44" stroke="#2B3350" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M73 53H76" stroke="#2B3350" strokeWidth="1.5" strokeLinecap="round" />

    {/* Eyes behind glasses */}
    <circle cx="52" cy="54" r="1.5" fill="#2B3350" />
    <circle cx="68" cy="54" r="1.5" fill="#2B3350" />

    {/* Cheeks */}
    <circle cx="48" cy="61" r="2" fill="#F9A887" opacity="0.6" />
    <circle cx="72" cy="61" r="2" fill="#F9A887" opacity="0.6" />

    {/* Nose */}
    <path d="M59 56V59H61" stroke="#E49B74" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />

    {/* Smile */}
    <path d="M55 64C57 67 63 67 65 64" stroke="#2B3350" strokeWidth="1.4" strokeLinecap="round" />

    {/* Left Arm & Thumbs-Up Hand */}
    <g transform="translate(18, 56)">
      {/* Arm reaching up */}
      <path d="M18 64C18 48 16 38 12 28C10 24 6 22 2 26C0 28 2 34 4 40L10 64H18Z" fill="#3B67B7" />
      {/* Hand wrist */}
      <rect x="0" y="24" width="8" height="6" rx="2" fill="#F8C7A0" />
      {/* Thumb pointing up */}
      <rect x="1" y="10" width="5" height="15" rx="2.5" fill="#FCD9BA" />
      {/* Curled fingers (fist) */}
      <rect x="4" y="18" width="8" height="10" rx="3" fill="#FCD9BA" />
      <path d="M4 21H11" stroke="#E6A683" strokeWidth="0.8" />
      <path d="M4 24H11" stroke="#E6A683" strokeWidth="0.8" />
    </g>
  </svg>
);

/** Boy with Magnifying Glass & Globe (Right Screen) */
export const BoyWithGlobeIllustration: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Background Circle Fill */}
    <circle cx="60" cy="60" r="60" fill="#FFFFFF" />

    {/* Globe on Stand (Right side) */}
    {/* Globe Base & Stand */}
    <ellipse cx="88" cy="104" rx="10" ry="3" fill="#A8B5CD" />
    <path d="M88 104V96" stroke="#8F9FB9" strokeWidth="2.5" strokeLinecap="round" />
    {/* Arc holder */}
    <path d="M72 74C70 86 78 96 88 96C98 96 106 86 104 74" stroke="#8F9FB9" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <circle cx="88" cy="96" r="1.5" fill="#6B7C98" />

    {/* Globe Sphere */}
    <circle cx="88" cy="72" r="18" fill="#588CE5" />
    {/* Continents on Globe (Green) */}
    <path
      d="M78 68C80 64 84 65 86 68C88 71 85 75 82 76C79 77 76 74 78 68Z"
      fill="#6EC35A"
    />
    <path
      d="M89 62C94 63 97 67 95 72C93 76 90 77 87 75C85 73 87 66 89 62Z"
      fill="#6EC35A"
    />
    <path
      d="M83 80C86 79 92 81 94 85C92 88 88 88 84 86C82 84 82 82 83 80Z"
      fill="#6EC35A"
    />

    {/* Boy Body (Left side) */}
    <path
      d="M24 120C24 96 32 84 48 84C62 84 68 94 68 120H24Z"
      fill="#477FE6"
    />
    {/* Neck */}
    <rect x="42" y="72" width="10" height="14" rx="3" fill="#F8C7A0" />

    {/* Head */}
    <rect x="34" y="44" width="28" height="30" rx="12" fill="#FCD9BA" />

    {/* Ear */}
    <circle cx="34" cy="58" r="4" fill="#F8C7A0" />

    {/* Brown Hair */}
    <path
      d="M34 52C34 40 40 34 52 34C64 34 66 40 66 48C64 48 60 46 54 48C48 50 44 48 40 52C36 56 34 54 34 52Z"
      fill="#5A3A28"
    />
    <path d="M34 48C33 46 36 41 42 38C38 41 36 45 36 49L34 48Z" fill="#4A2E1F" />

    {/* Face Profile / Smiling Eye */}
    <circle cx="50" cy="54" r="1.5" fill="#2B3350" />
    <path d="M47 50C48 49 52 49 53 50" stroke="#5A3A28" strokeWidth="1" strokeLinecap="round" />
    {/* Nose */}
    <path d="M55 55L57 58H54" stroke="#E49B74" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    {/* Smile */}
    <path d="M48 62C50 64 54 64 56 62" stroke="#2B3350" strokeWidth="1.2" strokeLinecap="round" />

    {/* Arms holding Magnifying Glass */}
    <path d="M46 90L66 74" stroke="#477FE6" strokeWidth="7" strokeLinecap="round" />
    <circle cx="66" cy="74" r="3.5" fill="#F8C7A0" />

    {/* Magnifying Glass */}
    {/* Handle */}
    <path d="M66 74L71 69" stroke="#2B3350" strokeWidth="2.5" strokeLinecap="round" />
    {/* Rim */}
    <circle cx="76" cy="64" r="8" stroke="#2B3350" strokeWidth="2" fill="#FFFFFF" fillOpacity="0.3" />
    {/* Reflection Highlight */}
    <path d="M72 61C73 59 76 58 78 59" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

/** Miniature John Smith Avatar */
export const MiniTeacherAvatar: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <div
    style={{ width: size, height: size }}
    className="rounded-full overflow-hidden bg-white ring-2 ring-white shadow-xs shrink-0 flex items-center justify-center"
  >
    <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
      <circle cx="20" cy="20" r="20" fill="#E8F1FD" />
      <path d="M10 40C10 32 14 27 20 27C26 27 30 32 30 40H10Z" fill="#3B67B7" />
      <circle cx="20" cy="18" r="8" fill="#FCD9BA" />
      <path d="M14 16C14 11 17 9 22 9C27 9 27 12 26 15C24 15 22 14 19 15C16 16 15 15 14 16Z" fill="#5A3A28" />
      {/* Glasses */}
      <rect x="15" y="16" width="4.5" height="3.5" rx="1" stroke="#2B3350" strokeWidth="0.8" />
      <rect x="21" y="16" width="4.5" height="3.5" rx="1" stroke="#2B3350" strokeWidth="0.8" />
      <path d="M19.5 17.5H21" stroke="#2B3350" strokeWidth="0.8" />
      <circle cx="17.2" cy="17.7" r="0.7" fill="#2B3350" />
      <circle cx="23.2" cy="17.7" r="0.7" fill="#2B3350" />
      <path d="M18.5 21.5C19.5 22.5 21 22.5 22 21.5" stroke="#2B3350" strokeWidth="0.7" strokeLinecap="round" />
    </svg>
  </div>
);

/** Miniature Adam Rhode Avatar (Dark Hair) */
export const MiniAdamAvatar: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <div
    style={{ width: size, height: size }}
    className="rounded-full overflow-hidden bg-white ring-2 ring-white shadow-xs shrink-0 flex items-center justify-center"
  >
    <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
      <circle cx="20" cy="20" r="20" fill="#EBF2FA" />
      <path d="M10 40C10 32 14 28 20 28C26 28 30 32 30 40H10Z" fill="#3D5A80" />
      <circle cx="20" cy="18" r="8" fill="#FCD9BA" />
      {/* Dark Hair */}
      <path d="M13 16C13 10 17 8 22 8C27 8 28 11 27 15C25 15 22 13 18 15C15 16 14 16 13 16Z" fill="#2B2D42" />
      <circle cx="17.5" cy="17.5" r="0.9" fill="#2B3350" />
      <circle cx="23" cy="17.5" r="0.9" fill="#2B3350" />
      <path d="M18.5 21C19.5 22.2 21.5 22.2 22.5 21" stroke="#2B3350" strokeWidth="0.8" strokeLinecap="round" />
    </svg>
  </div>
);

/** Miniature Sam Bilow Avatar (Blond / Orange) */
export const MiniSamAvatar: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <div
    style={{ width: size, height: size }}
    className="rounded-full overflow-hidden bg-white ring-2 ring-white shadow-xs shrink-0 flex items-center justify-center"
  >
    <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
      <circle cx="20" cy="20" r="20" fill="#FFF4E6" />
      <path d="M10 40C10 33 14 29 20 29C26 29 30 33 30 40H10Z" fill="#EE6C4D" />
      <circle cx="20" cy="19" r="7.5" fill="#FCE0C6" />
      {/* Blondish hair */}
      <path d="M13 17C13 11 16 8 21 8C26 8 28 11 27 15C25 14 23 13 20 14C17 15 15 16 13 17Z" fill="#E09F3E" />
      <circle cx="17.5" cy="18.5" r="0.8" fill="#2B3350" />
      <circle cx="22.5" cy="18.5" r="0.8" fill="#2B3350" />
      <path d="M18.5 22C19.5 23 21 23 22 22" stroke="#2B3350" strokeWidth="0.8" strokeLinecap="round" />
    </svg>
  </div>
);

/** Miniature Andy Brown Avatar */
export const MiniAndyAvatar: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <div
    style={{ width: size, height: size }}
    className="rounded-full overflow-hidden bg-white ring-2 ring-white shadow-xs shrink-0 flex items-center justify-center"
  >
    <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
      <circle cx="20" cy="20" r="20" fill="#F0F4F8" />
      <path d="M10 40C10 32 14 28 20 28C26 28 30 32 30 40H10Z" fill="#587B7F" />
      <circle cx="20" cy="18" r="8" fill="#FCD9BA" />
      {/* Brown Hair */}
      <path d="M13 16C13 10 17 8 22 8C27 8 27 12 26 15C24 15 21 14 18 15C15 16 14 16 13 16Z" fill="#5A3A28" />
      <circle cx="17.5" cy="17.5" r="0.9" fill="#2B3350" />
      <circle cx="23" cy="17.5" r="0.9" fill="#2B3350" />
      <path d="M18.5 21.5C19.5 22.5 21.5 22.5 22.5 21.5" stroke="#2B3350" strokeWidth="0.8" strokeLinecap="round" />
    </svg>
  </div>
);

// ============================================================================
// MAIN COMPONENT: 3 PHONE SCREENS SIDE BY SIDE
// ============================================================================

export const PhoneMockupShowcase: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-[#F1F5FF] flex flex-col items-center justify-center py-10 px-2 sm:px-6 relative overflow-hidden font-poppins selection:bg-[#FFD84D]/30">
      {/* Subtle radial glow behind the phones */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle 500px at 50% 50%, rgba(255, 255, 255, 0.95) 0%, rgba(235, 242, 255, 0.65) 55%, rgba(241, 245, 255, 1) 100%)',
        }}
      />

      {/* Main 3-Phones Container: Centered, Overlapping */}
      <div className="relative flex items-center justify-center z-10 max-w-5xl w-full">
        {/* =================================================================== */}
        {/* PHONE 1 (LEFT): CHAT SCREEN */}
        {/* =================================================================== */}
        <div
          className="w-[250px] h-[435px] bg-[#FFFFFF] rounded-[28px] shadow-[0_20px_50px_rgba(120,140,200,0.25)] flex flex-col overflow-hidden relative z-10 shrink-0 transform translate-x-5 translate-y-5 transition-transform duration-300 hover:z-30 hover:scale-[1.02]"
        >
          {/* Top Yellow Header with curved bottom */}
          <div className="bg-[#FFD84D] h-[82px] w-full pt-2 px-4 relative flex flex-col justify-between shrink-0">
            {/* Status Bar */}
            <div className="flex items-center justify-between text-[#2B3350] font-bold text-[9.5px]">
              <span>09:00</span>
              <div className="flex items-center gap-1.5">
                <SignalIcon />
                <WifiIcon />
                <BatteryIcon />
              </div>
            </div>
          </div>

          {/* White Card overlapping yellow header */}
          <div className="bg-[#FFFFFF] rounded-t-[24px] -mt-8 flex-1 flex flex-col justify-between pt-3 pb-3 px-3 relative z-10 shadow-[0_-4px_12px_rgba(0,0,0,0.02)]">
            {/* Top Avatars Row */}
            <div className="flex items-center justify-between px-1 pb-2.5 border-b border-[#F0F3FA]">
              {/* John Smith */}
              <div className="flex flex-col items-center">
                <MiniTeacherAvatar size={30} />
                <span className="text-[7.5px] font-bold text-[#2B3350] mt-1 text-center leading-none">
                  John<br />Smith
                </span>
              </div>
              {/* Adam Rhode */}
              <div className="flex flex-col items-center">
                <MiniAdamAvatar size={30} />
                <span className="text-[7.5px] font-bold text-[#2B3350] mt-1 text-center leading-none">
                  Adam<br />Rhode
                </span>
              </div>
              {/* Sam Bilow */}
              <div className="flex flex-col items-center">
                <MiniSamAvatar size={30} />
                <span className="text-[7.5px] font-bold text-[#2B3350] mt-1 text-center leading-none">
                  Sam<br />Bilow
                </span>
              </div>
              {/* Add Button */}
              <div className="flex flex-col items-center">
                <div className="w-[30px] h-[30px] rounded-full bg-[#F4F6FC] border border-dashed border-[#CBD5E1] flex items-center justify-center text-[#9AA3BD] text-xs font-semibold">
                  +
                </div>
                <span className="text-[7.5px] font-medium text-[#9AA3BD] mt-1">Add</span>
              </div>
            </div>

            {/* Chat Messages List */}
            <div className="space-y-2 py-1 flex-1 overflow-hidden flex flex-col justify-center">
              {/* Message 1: Teacher Blue Bubble */}
              <div className="flex items-start gap-1.5">
                <MiniTeacherAvatar size={20} />
                <div className="bg-[#A9BFF5] text-[#2B3350] text-[8px] font-semibold py-1.5 px-2.5 rounded-[12px] rounded-tl-[3px] max-w-[155px] leading-tight">
                  Test results is great! Good job, Sam.
                </div>
              </div>

              {/* Message 2: Test Results Document Card */}
              <div className="flex items-start gap-1.5">
                <MiniTeacherAvatar size={20} />
                <div className="bg-[#FFFFFF] border-[1.5px] border-[#A9BFF5] rounded-[12px] rounded-tl-[3px] p-1.5 w-[76px] h-[52px] shadow-xs flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div className="w-2.5 h-3 bg-[#E8EEFF] rounded-[2px]" />
                    <span className="text-[#F26B6B] font-extrabold text-[9px] leading-none">A+</span>
                  </div>
                  <div className="space-y-1">
                    <div className="w-full h-[2.5px] bg-[#D4E0F9] rounded-full" />
                    <div className="w-4/5 h-[2.5px] bg-[#D4E0F9] rounded-full" />
                    <div className="w-3/5 h-[2.5px] bg-[#D4E0F9] rounded-full" />
                  </div>
                </div>
              </div>

              {/* Message 3: Coral Bubble (Right - Adam) */}
              <div className="flex items-start justify-end gap-1.5">
                <div className="bg-[#F26B6B] text-white text-[7.5px] font-semibold py-1.5 px-2.5 rounded-[12px] rounded-tr-[3px] max-w-[150px] leading-tight text-right">
                  Thank you, mr. Smith! Keep it up, Sam
                </div>
                <MiniAdamAvatar size={20} />
              </div>

              {/* Message 4: Yellow Bubble (Right - Sam) */}
              <div className="flex items-start justify-end gap-1.5">
                <div className="bg-[#FFD84D] text-[#2B3350] text-[7.5px] font-semibold py-1.5 px-2.5 rounded-[12px] rounded-tr-[3px] max-w-[150px] leading-tight text-right">
                  Thank you, mr. Smith, it was easy! Ok, dad
                </div>
                <MiniSamAvatar size={20} />
              </div>
            </div>

            {/* Bottom Input & Nav Area */}
            <div className="space-y-2.5 pt-1">
              {/* Message Input Pill */}
              <div className="bg-[#F4F6FC] rounded-full px-2.5 py-1.5 flex items-center justify-between text-[#9AA3BD]">
                <div className="flex items-center gap-1.5">
                  {/* Paperclip */}
                  <svg className="w-3 h-3 text-[#9AA3BD]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
                  </svg>
                  <span className="text-[8px] text-[#9AA3BD] font-medium">Type message...</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {/* Smile */}
                  <svg className="w-3 h-3 text-[#9AA3BD]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                    <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="3" />
                    <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="3" />
                  </svg>
                  {/* Send plane */}
                  <svg className="w-3 h-3 text-[#9AA3BD]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                  </svg>
                </div>
              </div>

              {/* Bottom Nav: Chat Active (Coral) */}
              <div className="flex items-center justify-around pt-1">
                {/* Profile (Inactive) */}
                <div className="w-7 h-7 rounded-full bg-[#EBF0FA] flex items-center justify-center text-[#9AA3BD]">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>

                {/* Chat (Active Coral) */}
                <div className="w-7 h-7 rounded-full bg-[#F26B6B] flex items-center justify-center text-white shadow-xs">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                </div>

                {/* Document (Inactive) */}
                <div className="w-7 h-7 rounded-full bg-[#EBF0FA] flex items-center justify-center text-[#9AA3BD]">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <path d="M14 2v6h6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* PHONE 2 (CENTER): POLL / PROFILE SCREEN (Taller, Raised, In Front) */}
        {/* =================================================================== */}
        <div
          className="w-[260px] h-[470px] bg-[#FFFFFF] rounded-[28px] shadow-[0_28px_65px_rgba(100,125,195,0.35)] flex flex-col overflow-hidden relative z-20 shrink-0 transition-transform duration-300 hover:scale-[1.02]"
        >
          {/* Top Yellow Header with large circular illustration cutout */}
          <div className="bg-[#FFD84D] h-[126px] w-full pt-2 px-4 relative flex flex-col justify-between shrink-0">
            {/* Status Bar */}
            <div className="flex items-center justify-between text-[#2B3350] font-bold text-[9.5px]">
              <span>09:00</span>
              <div className="flex items-center gap-1.5">
                <SignalIcon />
                <WifiIcon />
                <BatteryIcon />
              </div>
            </div>

            {/* Circular Teacher Illustration (Centered, overlapping into card below) */}
            <div className="w-[86px] h-[86px] rounded-full mx-auto -mb-10 ring-4 ring-white shadow-sm overflow-hidden z-20 relative bg-white">
              <JohnSmithIllustration />
            </div>
          </div>

          {/* White Card Below */}
          <div className="bg-[#FFFFFF] rounded-t-[24px] flex-1 flex flex-col justify-between pt-12 pb-3 px-4 relative z-10">
            <div className="space-y-3">
              {/* Author & Menu Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-[10px] font-bold text-[#2B3350] leading-tight">
                    John Smith <span className="font-medium text-[#2B3350]">posted new poll:</span>
                  </h4>
                  <p className="text-[7.5px] text-[#9AA3BD] font-medium mt-0.5">Teacher at Lorem School</p>
                </div>
                <div className="flex items-center gap-1.5 text-[#9AA3BD]">
                  <span className="text-[7px] font-medium">1 hour ago</span>
                  {/* Hamburger menu icon */}
                  <div className="flex flex-col gap-[2px] w-2.5">
                    <div className="w-full h-[1.5px] bg-[#9AA3BD] rounded-full" />
                    <div className="w-full h-[1.5px] bg-[#9AA3BD] rounded-full" />
                    <div className="w-full h-[1.5px] bg-[#9AA3BD] rounded-full" />
                  </div>
                </div>
              </div>

              {/* Question with Globe Icon */}
              <div className="flex items-center gap-2 pt-0.5">
                <div className="w-6 h-6 rounded-full bg-[#A9BFF5] flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                </div>
                <p className="text-[8.5px] font-bold text-[#2B3350] leading-tight">
                  Which country you want to add in our next lesson?
                </p>
              </div>

              {/* 3 Poll Bars */}
              <div className="space-y-1.5 pt-1">
                {/* Spain: Yellow 30% */}
                <div className="w-full h-7 bg-[#FFD84D] rounded-[8px] px-3 flex items-center justify-between text-[#2B3350] font-bold text-[8.5px] shadow-xs">
                  <span>Spain</span>
                  <span className="text-[8px] font-semibold">30%</span>
                </div>

                {/* Italy: Periwinkle Blue 50% */}
                <div className="w-full h-7 bg-[#A9BFF5] rounded-[8px] px-3 flex items-center justify-between text-[#2B3350] font-bold text-[8.5px] shadow-xs">
                  <span>Italy</span>
                  <span className="text-[8px] font-semibold">50%</span>
                </div>

                {/* France: Coral Red 20% */}
                <div className="w-full h-7 bg-[#F26B6B] rounded-[8px] px-3 flex items-center justify-between text-white font-bold text-[8.5px] shadow-xs">
                  <span>France</span>
                  <span className="text-[8px] font-semibold">20%</span>
                </div>
              </div>

              {/* Poll Stats: Responses & Likes */}
              <div className="flex items-center justify-between text-[7.5px] text-[#9AA3BD] font-medium pt-0.5">
                <span>12 Responses</span>
                <div className="flex items-center gap-1">
                  <span>10 Likes</span>
                  <svg className="w-2.5 h-2.5 text-[#9AA3BD]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Bottom Nav: Profile Active (Yellow) */}
            <div className="flex items-center justify-around pt-2">
              {/* Profile (Active Yellow) */}
              <div className="w-7 h-7 rounded-full bg-[#FFD84D] flex items-center justify-center text-white shadow-xs">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>

              {/* Chat (Inactive) */}
              <div className="w-7 h-7 rounded-full bg-[#EBF0FA] flex items-center justify-center text-[#9AA3BD]">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </div>

              {/* Document (Inactive) */}
              <div className="w-7 h-7 rounded-full bg-[#EBF0FA] flex items-center justify-center text-[#9AA3BD]">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <path d="M14 2v6h6" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* PHONE 3 (RIGHT): GEOGRAPHY LESSONS SCREEN */}
        {/* =================================================================== */}
        <div
          className="w-[250px] h-[435px] bg-[#FFFFFF] rounded-[28px] shadow-[0_20px_50px_rgba(120,140,200,0.25)] flex flex-col overflow-hidden relative z-10 shrink-0 transform -translate-x-5 translate-y-5 transition-transform duration-300 hover:z-30 hover:scale-[1.02]"
        >
          {/* Top Yellow Header with large circular illustration cutout */}
          <div className="bg-[#FFD84D] h-[126px] w-full pt-2 px-4 relative flex flex-col justify-between shrink-0">
            {/* Status Bar */}
            <div className="flex items-center justify-between text-[#2B3350] font-bold text-[9.5px]">
              <span>09:00</span>
              <div className="flex items-center gap-1.5">
                <SignalIcon />
                <WifiIcon />
                <BatteryIcon />
              </div>
            </div>

            {/* Circular Boy & Globe Illustration */}
            <div className="w-[86px] h-[86px] rounded-full mx-auto -mb-10 ring-4 ring-white shadow-sm overflow-hidden z-20 relative bg-white">
              <BoyWithGlobeIllustration />
            </div>
          </div>

          {/* White Card Below */}
          <div className="bg-[#FFFFFF] rounded-t-[24px] flex-1 flex flex-col justify-between pt-11 pb-3 px-3.5 relative z-10 shadow-[0_-4px_12px_rgba(0,0,0,0.02)]">
            <div className="space-y-2">
              {/* Header: Title & Follow Button */}
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-[11px] font-bold text-[#2B3350] leading-tight">
                    Geography<br />Lessons
                  </h4>
                  <p className="text-[7.5px] text-[#9AA3BD] font-medium mt-0.5">5820 Followers</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {/* Hamburger menu icon */}
                  <div className="flex flex-col gap-[2px] w-2.5">
                    <div className="w-full h-[1.5px] bg-[#9AA3BD] rounded-full" />
                    <div className="w-full h-[1.5px] bg-[#9AA3BD] rounded-full" />
                    <div className="w-full h-[1.5px] bg-[#9AA3BD] rounded-full" />
                  </div>
                  {/* Follow Button */}
                  <button className="bg-[#FFD84D] text-[#2B3350] font-bold text-[8px] px-3 py-1 rounded-full shadow-xs mt-1">
                    Follow
                  </button>
                </div>
              </div>

              {/* Share Lesson Input Pill */}
              <div className="flex items-center gap-1.5 pt-0.5">
                <MiniTeacherAvatar size={18} />
                <div className="bg-[#F4F6FC] rounded-full px-2.5 py-1 flex-1 flex items-center justify-between text-[#9AA3BD]">
                  <span className="text-[7.5px] font-medium">Share lesson...</span>
                  <svg className="w-2.5 h-2.5 text-[#9AA3BD]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
                  </svg>
                </div>
              </div>

              {/* Post Content: Andy Brown */}
              <div className="space-y-1 pt-0.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <MiniAndyAvatar size={18} />
                    <div>
                      <p className="text-[8px] font-bold text-[#2B3350] leading-none">Andy Brown</p>
                      <p className="text-[6.5px] text-[#9AA3BD] font-medium leading-tight mt-0.5">
                        Teacher at Ipsum School • 3 hours ago
                      </p>
                    </div>
                  </div>
                  {/* Info Icon */}
                  <div className="w-3.5 h-3.5 rounded-full border border-[#9AA3BD] flex items-center justify-center text-[7px] text-[#9AA3BD] font-serif">
                    i
                  </div>
                </div>

                <p className="text-[6.8px] text-[#6B7594] leading-snug line-clamp-2">
                  Sonet putent cum ad, ei eam alia illum sententiae, ex utroque tractatos pro. Vim appareat similique.
                </p>

                {/* Video / Thumbnail Card */}
                <div className="w-full h-11 bg-[#A9BFF5] rounded-[10px] relative overflow-hidden flex items-center justify-center shadow-xs">
                  {/* Background globe graphics */}
                  <svg className="absolute inset-0 w-full h-full opacity-60" viewBox="0 0 200 80" fill="none">
                    <circle cx="100" cy="40" r="32" fill="#588CE5" />
                    <path d="M85 30C88 25 94 28 98 32C95 38 88 40 85 30Z" fill="#6EC35A" />
                    <path d="M104 28C110 32 114 38 108 45C104 42 105 32 104 28Z" fill="#6EC35A" />
                  </svg>

                  {/* Red Play Button */}
                  <div className="w-6 h-6 rounded-full bg-[#F26B6B] flex items-center justify-center shadow-sm z-10">
                    <svg className="w-2.5 h-2.5 text-white fill-white translate-x-[1px]" viewBox="0 0 24 24">
                      <polygon points="6 3 20 12 6 21 6 3" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Nav: Document Active (Yellow) */}
            <div className="flex items-center justify-around pt-1">
              {/* Profile (Inactive) */}
              <div className="w-7 h-7 rounded-full bg-[#EBF0FA] flex items-center justify-center text-[#9AA3BD]">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>

              {/* Chat (Inactive) */}
              <div className="w-7 h-7 rounded-full bg-[#EBF0FA] flex items-center justify-center text-[#9AA3BD]">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </div>

              {/* Document (Active Yellow) */}
              <div className="w-7 h-7 rounded-full bg-[#FFD84D] flex items-center justify-center text-white shadow-xs">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <path d="M14 2v6h6" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
