import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'The First Take - AI 패션 스타일링',
    short_name: 'The First Take',
    description: 'AI와 함께 나만의 패션 스타일을 찾아보세요.',
    start_url: '/',
    display: 'standalone',
    background_color: '\#F1FAFB',
    theme_color: '\#4993FA',
    icons: [
      {
        src: '/TFT_icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/TFT_icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
