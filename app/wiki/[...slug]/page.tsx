import { getAllStaticPaths, getMDXContent } from '@/lib/static-page';
import { MDXRemote } from 'next-mdx-remote/rsc';

/**
 * Next.js가 빌드 시점에 이 함수를 실행하여,
 * 어떤 정적 페이지들을 미리 생성해야 할지 목록을 받아갑니다.
 * 최종 반환값 예시: [{ slug: ['style', 'classic'] }, { slug: ['material', 'denim'] }]
 */

export async function generateStaticParams() {
  return getAllStaticPaths('content/wiki');
}

export default async function WikiPage({ params }: { params: { slug: string[] } }) {
  const { content, frontmatter } = getMDXContent('content/wiki', params.slug);

  return (
    <article className="prose p-8">
      <h1>{frontmatter.name}</h1>
      <MDXRemote source={content} components={{}} />
    </article>
  );
}
