import type { NextConfig } from 'next';
import createMDX from '@next/mdx';

const nextConfig: NextConfig = {
  experimental: {},
  //output: 'export',
  images: {
    unoptimized: true,
  },
  // async rewrites() {
  //   return [
  //     {
  //       // source: 이 경로로 들어오는 요청을
  //       // destination: 이 주소로 대신 보내준다
  //       source: '/api/:path*',
  //       destination: `${process.env.NEXT_PUBLIC_TFT_BACKEND_URL}/api/:path*`,
  //     },
  //   ];
  // },
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
};

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
});

export default withMDX(nextConfig);
