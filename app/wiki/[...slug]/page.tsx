import { getAllStaticPaths, getMDXContent } from '@/lib/static-page';
import { MDXRemote } from 'next-mdx-remote/rsc';

export async function generateStaticParams() {
  return getAllStaticPaths('content/wiki');
}

export default async function WikiPage({ params }: any) {
  const { content, frontmatter } = getMDXContent('content/wiki', params.slug);

  return (
    <article className="prose">
      <h1>{frontmatter.name}</h1>
      <MDXRemote source={content} components={{}} />
    </article>
  );
}
