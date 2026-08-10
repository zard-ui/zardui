export type FeaturedArticleLanguage = 'pt-BR' | 'en';

export interface FeaturedArticle {
  /** Stable slug — used as the `@for` track and as the key of the degraded cover state. */
  id: string;
  title: string;
  /** Author of the article, so the writer gets the credit on the card. */
  author: string;
  /** Canonical article URL — the whole card links here. */
  url: string;
  /** Cover image served by the publisher's CDN. See the note about `cover_image` vs `social_image`. */
  cover: string;
  /** Publication date in ISO (`YYYY-MM-DD`) — formatted in the view. */
  publishedAt: string;
  /** Reading time in minutes, as reported by the publisher. */
  readingTime: number;
  /** Where the article was published, rendered as a badge over the cover. */
  source: string;
  tags: readonly string[];
  language: FeaturedArticleLanguage;
}

/**
 * Articles featured on `/docs/featured/articles`.
 *
 * Adding a new one is a single entry here and nothing else: the page derives the card,
 * the language grouping and the ordering from these fields.
 *
 * Metadata was read from dev.to's public article endpoint
 * (`https://dev.to/api/articles/{username}/{slug}`), which needs no API key.
 *
 * About the covers: dev.to exposes both `cover_image` and `social_image`. When an author never
 * uploads a dedicated cover, `cover_image` comes back `null` while `social_image` still holds the
 * image dev.to actually renders on the article — that is the case of the ZardUI Beta post below.
 * Always keep the remote CDN URL here; covers are never copied into the repository.
 */
export const FEATURED_ARTICLES: readonly FeaturedArticle[] = [
  {
    id: 'zardui-beta-bringing-shadcnuis-philosophy-to-angular-where-you-own-every-line-of-code',
    title: "ZardUI Beta: Bringing shadcn/ui's Philosophy to Angular - Where You Own Every Line of Code",
    author: 'Samuel Rizzon',
    url: 'https://dev.to/samuelrizzondev/zardui-beta-bringing-shadcnuis-philosophy-to-angular-where-you-own-every-line-of-code-2a79',
    // `cover_image` is null on this one, so this is the `social_image` returned by the API.
    cover:
      'https://media2.dev.to/dynamic/image/width=1000,height=500,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Frusyrcfgg8m3axncu03f.png',
    publishedAt: '2025-08-19',
    readingTime: 4,
    source: 'dev.to',
    tags: ['webdev', 'angular', 'shadcn', 'opensource'],
    language: 'en',
  },
  {
    id: 'building-fast-in-angular-with-zard-ui-tailwind-css-and-signals',
    title: 'Building fast in Angular with Zard UI, Tailwind CSS and Signals',
    author: 'hassantayyab',
    url: 'https://dev.to/hassantayyab/building-fast-in-angular-with-zard-ui-tailwind-css-and-signals-cj5',
    cover:
      'https://media2.dev.to/dynamic/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2F3pu9rhupvijjnc87n38n.png',
    publishedAt: '2025-11-24',
    readingTime: 4,
    source: 'dev.to',
    tags: ['webdev', 'angular', 'tailwindcss', 'typescript'],
    language: 'en',
  },
];
