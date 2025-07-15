import type { NextConfig } from 'next';
import createMDX from '@next/mdx';

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    clientInstrumentationHook: true,
  },
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
        destination: `http://172.16.101.229:8000/api/:path*`,
      },
    ];
  },
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
};

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
});

export default withMDX(nextConfig);
