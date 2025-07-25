import { getMDXContent } from '@/lib/static-page';
import { MDXRemote } from 'next-mdx-remote/rsc';

export default async function WikiPage({ params }: { params: { slug: string[] } }) {
  const { content, frontmatter } = getMDXContent('content/wiki', params.slug);

  return (
    <article className="prose p-8">
      <h1>{frontmatter.name}</h1>
      <MDXRemote source={content} components={{}} />
    </article>
  );
}
