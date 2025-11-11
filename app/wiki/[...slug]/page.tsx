import { getAllStaticPaths, getMDXContent } from '@/lib/wikiLoader';
import { MDXRemote } from 'next-mdx-remote/rsc';
import JsonLd from '@/components/seo/JsonLd';
import { createArticleSchema } from '@/lib/schema';
import fs from 'fs';
import path from 'path';

export async function generateStaticParams() {
  return getAllStaticPaths('content/wiki');
}

export default async function WikiPage({ params }: any) {
  const resolvedParams = await params;
  const slugPath = Array.isArray(resolvedParams.slug) ? resolvedParams.slug : [resolvedParams.slug];
  const { content, frontmatter } = getMDXContent('content/wiki', slugPath);
  const wikiUrl = `/wiki/${slugPath.join('/')}`;
  
  // 파일 수정 시간 가져오기
  const wikiDirectory = path.join(process.cwd(), 'content/wiki');
  const filePath = path.join(wikiDirectory, ...slugPath) + '.mdx';
  let dateModified: string | undefined;
  let datePublished: string | undefined;
  
  try {
    const stats = fs.statSync(filePath);
    dateModified = stats.mtime.toISOString();
    datePublished = stats.birthtime.toISOString();
  } catch (error) {
    // 파일이 없으면 현재 시간 사용
    dateModified = new Date().toISOString();
    datePublished = new Date().toISOString();
  }

  const articleSchema = createArticleSchema(
    frontmatter.name || '패션 스타일 가이드',
    frontmatter.description || `${frontmatter.name}에 대한 상세한 패션 스타일 가이드입니다.`,
    frontmatter.image || '/TFT_icon.png',
    datePublished,
    dateModified,
    wikiUrl,
    'The First Take',
    'The First Take',
    '/TFT_icon.png'
  );

  return (
    <>
      <JsonLd data={articleSchema} />
      <article className="prose">
        <h1>{frontmatter.name}</h1>
        <MDXRemote source={content} components={{}} />
      </article>
    </>
  );
}
