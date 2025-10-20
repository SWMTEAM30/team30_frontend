export default function LoginBackgroundDark() {
  return (
    <svg 
      viewBox="0 0 1920 1080" 
      xmlns="http://www.w3.org/2000/svg" 
      className="w-full h-full absolute inset-0"
      preserveAspectRatio="xMidYMid slice"
      style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
    >
      <defs>
        {/* 그라디언트 정의 */}
        <linearGradient id="mainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:"#27548a", stopOpacity:1}} />
          <stop offset="50%" style={{stopColor:"#1a3d6b", stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:"#0f2847", stopOpacity:1}} />
        </linearGradient>
        
        <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:"#4a7bb8", stopOpacity:0.6}} />
          <stop offset="100%" style={{stopColor:"#27548a", stopOpacity:0.3}} />
        </linearGradient>
        
        <radialGradient id="glowGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style={{stopColor:"#ffffff", stopOpacity:0.1}} />
          <stop offset="100%" style={{stopColor:"#27548a", stopOpacity:0}} />
        </radialGradient>

        {/* 필터 정의 */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="10" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* 배경 */}
      <rect width="1920" height="1080" fill="url(#mainGradient)"/>
      
      {/* 빛나는 원형 요소들 */}
      <circle cx="300" cy="200" r="400" fill="url(#glowGradient)" opacity="0.4">
        <animate attributeName="r" values="400;450;400" dur="8s" repeatCount="indefinite"/>
      </circle>
      
      <circle cx="1600" cy="800" r="350" fill="url(#glowGradient)" opacity="0.3">
        <animate attributeName="r" values="350;400;350" dur="10s" repeatCount="indefinite"/>
      </circle>
      
      {/* 추상적인 패션 요소들 */}
      {/* 행거 라인 */}
      <path d="M 100 400 Q 300 350 500 400 T 900 400" 
            stroke="#4a7bb8" 
            strokeWidth="3" 
            fill="none" 
            opacity="0.3"
            strokeLinecap="round">
        <animate attributeName="d" 
                 values="M 100 400 Q 300 350 500 400 T 900 400;
                         M 100 400 Q 300 450 500 400 T 900 400;
                         M 100 400 Q 300 350 500 400 T 900 400" 
                 dur="6s" 
                 repeatCount="indefinite"/>
      </path>
      
      <path d="M 1000 600 Q 1200 550 1400 600 T 1800 600" 
            stroke="#5a8bc8" 
            strokeWidth="3" 
            fill="none" 
            opacity="0.3"
            strokeLinecap="round">
        <animate attributeName="d" 
                 values="M 1000 600 Q 1200 550 1400 600 T 1800 600;
                         M 1000 600 Q 1200 650 1400 600 T 1800 600;
                         M 1000 600 Q 1200 550 1400 600 T 1800 600" 
                 dur="7s" 
                 repeatCount="indefinite"/>
      </path>
      
      {/* 기하학적 패션 요소 */}
      <g opacity="0.2" filter="url(#glow)">
        {/* 옷걸이 아이콘 추상화 */}
        <path d="M 1400 150 L 1450 100 L 1500 150 Z" 
              fill="#6a9bd8" 
              opacity="0.5">
          <animateTransform attributeName="transform"
                            type="rotate"
                            from="0 1450 125"
                            to="360 1450 125"
                            dur="20s"
                            repeatCount="indefinite"/>
        </path>
        
        <rect x="400" y="700" width="120" height="120" 
              fill="none" 
              stroke="#5a8bc8" 
              strokeWidth="2" 
              opacity="0.4"
              transform="rotate(45 460 760)">
          <animate attributeName="opacity" 
                   values="0.4;0.7;0.4" 
                   dur="4s" 
                   repeatCount="indefinite"/>
        </rect>
        
        <circle cx="1200" cy="300" r="60" 
                fill="none" 
                stroke="#6a9bd8" 
                strokeWidth="2" 
                opacity="0.5">
          <animate attributeName="r" 
                   values="60;70;60" 
                   dur="5s" 
                   repeatCount="indefinite"/>
        </circle>
      </g>
      
      {/* 떠다니는 작은 점들 (스타일 포인트) */}
      <g opacity="0.6">
        <circle cx="800" cy="200" r="4" fill="#8aafd8">
          <animate attributeName="cy" 
                   values="200;180;200" 
                   dur="3s" 
                   repeatCount="indefinite"/>
          <animate attributeName="opacity" 
                   values="0.6;1;0.6" 
                   dur="3s" 
                   repeatCount="indefinite"/>
        </circle>
        
        <circle cx="1500" cy="400" r="3" fill="#7a9fc8">
          <animate attributeName="cy" 
                   values="400;420;400" 
                   dur="4s" 
                   repeatCount="indefinite"/>
          <animate attributeName="opacity" 
                   values="0.5;0.9;0.5" 
                   dur="4s" 
                   repeatCount="indefinite"/>
        </circle>
        
        <circle cx="600" cy="600" r="5" fill="#9abfe8">
          <animate attributeName="cy" 
                   values="600;580;600" 
                   dur="3.5s" 
                   repeatCount="indefinite"/>
          <animate attributeName="opacity" 
                   values="0.6;1;0.6" 
                   dur="3.5s" 
                   repeatCount="indefinite"/>
        </circle>
        
        <circle cx="1300" cy="700" r="4" fill="#6a9bd8">
          <animate attributeName="cy" 
                   values="700;685;700" 
                   dur="4.5s" 
                   repeatCount="indefinite"/>
          <animate attributeName="opacity" 
                   values="0.5;0.9;0.5" 
                   dur="4.5s" 
                   repeatCount="indefinite"/>
        </circle>
      </g>
      
      {/* 대각선 라이트 효과 */}
      <g opacity="0.15">
        <rect x="400" y="-200" width="200" height="1400" 
              fill="url(#accentGradient)" 
              transform="rotate(15 500 500)">
          <animate attributeName="opacity" 
                   values="0.15;0.25;0.15" 
                   dur="6s" 
                   repeatCount="indefinite"/>
        </rect>
        
        <rect x="1200" y="-200" width="150" height="1400" 
              fill="url(#accentGradient)" 
              transform="rotate(-10 1275 500)">
          <animate attributeName="opacity" 
                   values="0.15;0.22;0.15" 
                   dur="7s" 
                   repeatCount="indefinite"/>
        </rect>
      </g>
      
      {/* 글래스모피즘 효과를 위한 오버레이 */}
      <rect width="1920" height="1080" 
            fill="url(#glowGradient)" 
            opacity="0.1"/>
    </svg>
  );
}




