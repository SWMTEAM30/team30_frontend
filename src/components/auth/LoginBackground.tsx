export default function LoginBackground() {
  return (
    <div className="fixed inset-0 w-screen h-screen z-0">
      <svg
        viewBox="0 0 1920 1080"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full absolute inset-0"
        preserveAspectRatio="xMidYMid slice"
        style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
      >
        <defs>
          <linearGradient id="mainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#f8f9fa', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#e9ecef', stopOpacity: 1 }} />
          </linearGradient>

          <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#27548a', stopOpacity: 0.3 }} />
            <stop offset="100%" style={{ stopColor: '#4a7bb8', stopOpacity: 0.2 }} />
          </linearGradient>

          <radialGradient id="glowGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style={{ stopColor: '#27548a', stopOpacity: 0.2 }} />
            <stop offset="100%" style={{ stopColor: '#27548a', stopOpacity: 0 }} />
          </radialGradient>

          <filter id="glow">
            <feGaussianBlur stdDeviation="8" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect width="1920" height="1080" fill="url(#mainGradient)" />

        <path
          d="M 100 400 Q 300 350 500 400 T 900 400"
          stroke="#27548a"
          strokeWidth="3"
          fill="none"
          opacity="0.4"
          strokeLinecap="round"
        >
          <animate
            attributeName="d"
            values="M 100 400 Q 300 350 500 400 T 900 400;
                         M 100 400 Q 300 450 500 400 T 900 400;
                         M 100 400 Q 300 350 500 400 T 900 400"
            dur="6s"
            repeatCount="indefinite"
          />
        </path>

        <path
          d="M 1000 600 Q 1200 550 1400 600 T 1800 600"
          stroke="#4a7bb8"
          strokeWidth="3"
          fill="none"
          opacity="0.35"
          strokeLinecap="round"
        >
          <animate
            attributeName="d"
            values="M 1000 600 Q 1200 550 1400 600 T 1800 600;
                         M 1000 600 Q 1200 650 1400 600 T 1800 600;
                         M 1000 600 Q 1200 550 1400 600 T 1800 600"
            dur="7s"
            repeatCount="indefinite"
          />
        </path>

        <g opacity="0.5" filter="url(#glow)">
          <path d="M 1400 150 L 1450 100 L 1500 150 Z" fill="#27548a" opacity="0.5">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 1450 125"
              to="360 1450 125"
              dur="20s"
              repeatCount="indefinite"
            />
          </path>

          <rect
            x="400"
            y="700"
            width="120"
            height="120"
            fill="none"
            stroke="#4a7bb8"
            strokeWidth="3"
            opacity="0.4"
            transform="rotate(45 460 760)"
          >
            <animate attributeName="opacity" values="0.4;0.6;0.4" dur="4s" repeatCount="indefinite" />
          </rect>

          <circle cx="1200" cy="300" r="60" fill="none" stroke="#27548a" strokeWidth="3" opacity="0.5">
            <animate attributeName="r" values="60;70;60" dur="5s" repeatCount="indefinite" />
          </circle>
        </g>

        <g opacity="0.6">
          <circle cx="800" cy="200" r="4" fill="#27548a">
            <animate attributeName="cy" values="200;180;200" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0.8;0.5" dur="3s" repeatCount="indefinite" />
          </circle>

          <circle cx="1500" cy="400" r="3" fill="#4a7bb8">
            <animate attributeName="cy" values="400;420;400" dur="4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0.8;0.5" dur="4s" repeatCount="indefinite" />
          </circle>

          <circle cx="600" cy="600" r="5" fill="#27548a">
            <animate attributeName="cy" values="600;580;600" dur="3.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0.8;0.5" dur="3.5s" repeatCount="indefinite" />
          </circle>

          <circle cx="1300" cy="700" r="4" fill="#5a8bc8">
            <animate attributeName="cy" values="700;685;700" dur="4.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0.8;0.5" dur="4.5s" repeatCount="indefinite" />
          </circle>

          <circle cx="200" cy="500" r="3" fill="#27548a">
            <animate attributeName="cy" values="500;490;500" dur="3.8s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0.8;0.5" dur="3.8s" repeatCount="indefinite" />
          </circle>

          <circle cx="1700" cy="250" r="4" fill="#4a7bb8">
            <animate attributeName="cy" values="250;235;250" dur="4.2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0.8;0.5" dur="4.2s" repeatCount="indefinite" />
          </circle>
        </g>

        <circle cx="150" cy="850" r="80" fill="none" stroke="#27548a" strokeWidth="2" opacity="0.3">
          <animate attributeName="r" values="80;90;80" dur="5.5s" repeatCount="indefinite" />
        </circle>

        <circle cx="1800" cy="150" r="100" fill="none" stroke="#4a7bb8" strokeWidth="2" opacity="0.25">
          <animate attributeName="r" values="100;110;100" dur="6.5s" repeatCount="indefinite" />
        </circle>
      </svg>
      <div className="absolute inset-0 "></div>
    </div>
  );
}
