export function ScreenshotterLogo({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Screenshotter"
    >
      <rect width="32" height="32" rx="8" fill="url(#sl-grad)" />

      {/* browser frame */}
      <rect
        x="5" y="8" width="22" height="16" rx="3"
        fill="rgba(255,255,255,0.14)"
        stroke="rgba(255,255,255,0.44)"
        strokeWidth="1"
      />

      {/* title bar divider */}
      <line
        x1="5" y1="12.5" x2="27" y2="12.5"
        stroke="rgba(255,255,255,0.22)"
        strokeWidth="0.75"
      />

      {/* traffic dots */}
      <circle cx="8.2"  cy="10.25" r="0.95" fill="rgba(255,255,255,0.75)" />
      <circle cx="11"   cy="10.25" r="0.95" fill="rgba(255,255,255,0.50)" />
      <circle cx="13.8" cy="10.25" r="0.95" fill="rgba(255,255,255,0.30)" />

      {/* content skeleton */}
      <rect x="8" y="14.5" width="7"  height="1.2" rx="0.6" fill="rgba(255,255,255,0.60)" />
      <rect x="8" y="17"   width="11" height="1.2" rx="0.6" fill="rgba(255,255,255,0.38)" />
      <rect x="8" y="19.5" width="5"  height="1.2" rx="0.6" fill="rgba(255,255,255,0.22)" />

      {/* 4-point sparkle star */}
      <path
        d="M26 3L26.62 5.08L28.7 5.7L26.62 6.32L26 8.4L25.38 6.32L23.3 5.7L25.38 5.08Z"
        fill="white"
        opacity="0.95"
      />

      <defs>
        <linearGradient
          id="sl-grad"
          x1="0" y1="0" x2="32" y2="32"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#12C2E9" />
          <stop offset="0.5" stopColor="#C471ED" />
          <stop offset="1" stopColor="#F64F59" />
        </linearGradient>
      </defs>
    </svg>
  )
}
