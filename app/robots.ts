import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          // 동적 채팅방은 크롤링하지 않음 (개인화된 콘텐츠)
          '/chat/*/',
        ],
      },
    ],
    sitemap: 'https://the-first-take.com/sitemap.xml',
    host: 'https://the-first-take.com',
  };
}
