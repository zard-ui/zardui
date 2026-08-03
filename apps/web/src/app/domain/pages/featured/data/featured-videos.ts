export type FeaturedVideoLanguage = 'pt-BR' | 'en';

export interface FeaturedVideo {
  /** YouTube video ID — the thumbnail and the watch URL are both derived from it. */
  id: string;
  title: string;
  /** Channel/author of the content, so the creator gets the credit. */
  author?: string;
  /** Second where the ZardUI segment starts (for long live streams). */
  timestamp?: number;
  language: FeaturedVideoLanguage;
}

/**
 * Videos featured on `/docs/featured/youtube`.
 *
 * Adding a new one is a single entry here and nothing else: the page derives the thumbnail,
 * the watch URL and the language grouping from these fields.
 *
 * Titles and channel names were read from YouTube's public oEmbed endpoint
 * (`https://www.youtube.com/oembed?url=...&format=json`), which needs no API key.
 */
export const FEATURED_VIDEOS: readonly FeaturedVideo[] = [
  {
    id: 'zKUhEOdW7Zw',
    title: 'ZardUI: A alternativa BRASILEIRA ao shadcn/ui para Angular que você precisa conhecer!',
    author: 'Code Dimension',
    timestamp: 517,
    language: 'pt-BR',
  },
  {
    id: 'v1rEaS_1TN4',
    title: 'AngularSP Meetup #77 - Big O, ZardUI e muito mais',
    author: 'AngularSP',
    timestamp: 2658,
    language: 'pt-BR',
  },
  {
    id: 'o4Xjn-EZ1Lo',
    title: '🔥 Zard UI – A Melhor Biblioteca de Componentes para Angular?',
    author: 'Samuel Rizzon | Dev',
    language: 'pt-BR',
  },
  {
    id: 'pHkQ0PhPa4o',
    title: 'Refazendo o shadcn para Angular ao vivo | ZardUI',
    author: 'Samuel Rizzon | Dev',
    timestamp: 418,
    language: 'pt-BR',
  },
  {
    id: 'MXGZZQK_thk',
    title: 'Refazendo o shadcn para Angular ao vivo | Criando o modal do ZardUI (parte 3)',
    author: 'Samuel Rizzon | Dev',
    language: 'pt-BR',
  },
  {
    id: 'fIKnUsd1tAA',
    title: 'Refazendo o shadcn para Angular ao vivo | Criando o modal do ZardUI (parte 2)',
    author: 'Samuel Rizzon | Dev',
    timestamp: 1956,
    language: 'pt-BR',
  },
  {
    id: '6Oy2FaFjeFM',
    title: '[Refazendo o shadcn para Angular] Criando o componente de modal do zero',
    author: 'Samuel Rizzon | Dev',
    timestamp: 3708,
    language: 'pt-BR',
  },
  {
    id: '6IPD80ms-K0',
    title: '00 - Coding like the ancient Babylonians and Mesopotamians | #ClassicCoding',
    author: 'Lucas Silva',
    language: 'en',
  },
];
