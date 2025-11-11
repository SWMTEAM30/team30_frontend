/**
 * JSON-LD 구조화된 데이터를 렌더링하는 컴포넌트
 */

import type {
  OrganizationSchema,
  WebSiteSchema,
  SoftwareApplicationSchema,
  ArticleSchema,
  WebPageSchema,
} from '@/lib/schema';

type SchemaType =
  | OrganizationSchema
  | WebSiteSchema
  | SoftwareApplicationSchema
  | ArticleSchema
  | WebPageSchema
  | Record<string, unknown>;

interface JsonLdProps {
  data: SchemaType | SchemaType[];
}

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

