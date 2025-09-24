import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// slug 배열을 받아 실제 파일 경로를 만드는 함수
export function getMDXContent(dir: string, slug: string[]) {
  const wikiDirectory = path.join(process.cwd(), dir);
  const filePath = path.join(wikiDirectory, ...slug) + '.mdx';
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { content, data: frontmatter } = matter(fileContents);
  return { content, frontmatter };
}

/**
 * content/wiki 폴더와 그 하위 폴더를 모두 탐색하여
 * 모든 .mdx 파일의 경로를 재귀적으로 찾아주는 헬퍼 함수
 */
export function getAllStaticPaths(dir: string): { slug: string[] }[] {
  const directory = path.join(process.cwd(), dir);
  const fileNames = fs.readdirSync(dir);
  let paths: { slug: string[] }[] = [];

  fileNames.forEach((fileName) => {
    const fullPath = path.join(dir, fileName);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      paths = paths.concat(getAllStaticPaths(fullPath));
    } else if (fileName.endsWith('.mdx')) {
      const relativePath = path.relative(directory, fullPath);
      const slug = relativePath.replace(/\.mdx$/, '').split(path.sep);
      paths.push({ slug });
    }
  });

  return paths;
}
