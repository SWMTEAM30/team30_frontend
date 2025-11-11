import { MetadataRoute } from 'next';
import { getAllStaticPaths } from '@/lib/wikiLoader';
import fs from 'fs';
import path from 'path';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://the-first-take.com';
  
  // 정적 페이지들
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/chat`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/signin`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/wiki`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  // 위키 페이지들을 동적으로 생성
  const wikiPaths = getAllStaticPaths('content/wiki');
  const wikiPages: MetadataRoute.Sitemap = wikiPaths.map(({ slug }) => {
    const wikiDirectory = path.join(process.cwd(), 'content/wiki');
    const filePath = path.join(wikiDirectory, ...slug) + '.mdx';
    
    // 파일이 존재하면 수정 시간을 가져오고, 없으면 현재 시간 사용
    let lastModified = new Date();
    try {
      const stats = fs.statSync(filePath);
      lastModified = stats.mtime;
    } catch (error) {
      // 파일이 없으면 현재 시간 사용
      console.warn(`Wiki file not found: ${filePath}`);
    }

    return {
      url: `${baseUrl}/wiki/${slug.join('/')}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    };
  });

  return [...staticPages, ...wikiPages];
}
