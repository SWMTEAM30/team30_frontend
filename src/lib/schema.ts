/**
 * Schema.org 구조화된 데이터 생성 유틸리티
 * JSON-LD 형식으로 구조화된 데이터를 생성합니다.
 */

export interface OrganizationSchema {
  '@context': string;
  '@type': 'Organization';
  name: string;
  url: string;
  logo?: string;
  description?: string;
  sameAs?: string[];
  contactPoint?: {
    '@type': 'ContactPoint';
    contactType: string;
    email?: string;
  };
}

export interface WebSiteSchema {
  '@context': string;
  '@type': 'WebSite';
  name: string;
  url: string;
  description?: string;
  potentialAction?: {
    '@type': 'SearchAction';
    target: {
      '@type': 'EntryPoint';
      urlTemplate: string;
    };
    'query-input': string;
  };
}

export interface SoftwareApplicationSchema {
  '@context': string;
  '@type': 'SoftwareApplication';
  name: string;
  applicationCategory: string;
  operatingSystem: string;
  offers: {
    '@type': 'Offer';
    price: string;
    priceCurrency: string;
  };
  aggregateRating?: {
    '@type': 'AggregateRating';
    ratingValue: string;
    ratingCount: string;
  };
  description?: string;
  url?: string;
  screenshot?: string;
}

export interface ArticleSchema {
  '@context': string;
  '@type': 'Article';
  headline: string;
  description?: string;
  image?: string | string[];
  datePublished?: string;
  dateModified?: string;
  author?: {
    '@type': 'Organization';
    name: string;
  };
  publisher?: {
    '@type': 'Organization';
    name: string;
    logo?: {
      '@type': 'ImageObject';
      url: string;
    };
  };
  mainEntityOfPage?: {
    '@type': 'WebPage';
    '@id': string;
  };
}

export interface WebPageSchema {
  '@context': string;
  '@type': 'WebPage';
  name: string;
  description?: string;
  url: string;
  isPartOf?: {
    '@type': 'WebSite';
    name: string;
    url: string;
  };
}

/**
 * Organization 스키마 생성
 */
export function createOrganizationSchema(
  name: string = 'The First Take',
  url: string = 'https://the-first-take.com',
  logo?: string,
  description?: string
): OrganizationSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    ...(logo && { logo: `${url}${logo}` }),
    ...(description && { description }),
    sameAs: [
      // 소셜 미디어 링크가 있다면 추가
    ],
  };
}

/**
 * WebSite 스키마 생성
 */
export function createWebSiteSchema(
  name: string = 'The First Take',
  url: string = 'https://the-first-take.com',
  description?: string
): WebSiteSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
    ...(description && { description }),
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${url}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * SoftwareApplication 스키마 생성
 */
export function createSoftwareApplicationSchema(
  name: string = 'The First Take',
  description?: string,
  url?: string,
  screenshot?: string
): SoftwareApplicationSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'Web, iOS, Android',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'KRW',
    },
    ...(description && { description }),
    ...(url && { url }),
    ...(screenshot && { screenshot: `${url || 'https://the-first-take.com'}${screenshot}` }),
  };
}

/**
 * Article 스키마 생성
 */
export function createArticleSchema(
  headline: string,
  description?: string,
  image?: string | string[],
  datePublished?: string,
  dateModified?: string,
  url?: string,
  authorName: string = 'The First Take',
  publisherName: string = 'The First Take',
  publisherLogo?: string
): ArticleSchema {
  const baseUrl = 'https://the-first-take.com';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    ...(description && { description }),
    ...(image && {
      image: Array.isArray(image)
        ? image.map((img) => (img.startsWith('http') ? img : `${baseUrl}${img}`))
        : image.startsWith('http')
        ? image
        : `${baseUrl}${image}`,
    }),
    ...(datePublished && { datePublished }),
    ...(dateModified && { dateModified }),
    author: {
      '@type': 'Organization',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: publisherName,
      ...(publisherLogo && {
        logo: {
          '@type': 'ImageObject',
          url: publisherLogo.startsWith('http') ? publisherLogo : `${baseUrl}${publisherLogo}`,
        },
      }),
    },
    ...(url && {
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': url.startsWith('http') ? url : `${baseUrl}${url}`,
      },
    }),
  };
}

/**
 * WebPage 스키마 생성
 */
export function createWebPageSchema(
  name: string,
  description?: string,
  url?: string
): WebPageSchema {
  const baseUrl = 'https://the-first-take.com';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    ...(description && { description }),
    url: url ? (url.startsWith('http') ? url : `${baseUrl}${url}`) : baseUrl,
    isPartOf: {
      '@type': 'WebSite',
      name: 'The First Take',
      url: baseUrl,
    },
  };
}

/**
 * JSON-LD 스크립트 태그 생성
 */
export function generateJsonLdScript(schema: Record<string, unknown>): string {
  return JSON.stringify(schema, null, 2);
}

