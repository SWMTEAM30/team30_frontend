import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/private/', '/api/'],
      },
    ],
    sitemap: 'https://thefirsttake.com/sitemap.xml',
    host: 'https://thefirsttake.com',
  };
} 