import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {},
  //output: 'export',
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        // source: 이 경로로 들어오는 요청을
        source: '/api/:path*',
        // destination: 이 주소로 대신 보내준다
        destination: `${process.env.NEXT_PUBLIC_TFT_BACKEND_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
