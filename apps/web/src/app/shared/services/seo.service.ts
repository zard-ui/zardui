import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import { JsonLdService } from './json-ld.service';

export interface SeoConfig {
  title: string;
  description: string;
  keywords?: string[];
  url?: string;
  image?: string;
  type?: 'website' | 'article';
}

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly meta = inject(Meta);
  private readonly titleService = inject(Title);
  private readonly jsonLdService = inject(JsonLdService);
  private readonly baseUrl = 'https://zardui.com';
  private readonly defaultImage = 'https://zardui.com/site/og-image.png';

  setMetaTags(config: SeoConfig): void {
    const fullTitle = `${config.title} - zard/ui`;
    const url = config.url ? `${this.baseUrl}${config.url}` : this.baseUrl;
    const image = config.image
      ? config.image.startsWith('http')
        ? config.image
        : `${this.baseUrl}/og/${config.image}`
      : this.defaultImage;
    const keywords = config.keywords || this.generateDefaultKeywords(config.title);
    const type = config.type || 'website';

    this.titleService.setTitle(fullTitle);

    this.meta.updateTag({ name: 'description', content: config.description });
    this.meta.updateTag({ name: 'keywords', content: keywords.join(', ') });

    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: config.description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:type', content: type });
    this.meta.updateTag({ property: 'og:site_name', content: 'Zard UI' });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
    this.meta.updateTag({ name: 'twitter:description', content: config.description });
    this.meta.updateTag({ name: 'twitter:image', content: image });

    this.updateCanonicalUrl(url);
  }

  setComponentSeo(componentName: string, description: string, image: string): void {
    const displayName = this.formatComponentName(componentName);
    this.setMetaTags({
      title: displayName,
      description: description,
      keywords: this.generateComponentKeywords(componentName),
      url: `/docs/components/${componentName}`,
      image: image,
      type: 'website',
    });
    this.jsonLdService.setComponentJsonLd(componentName, description);
  }

  setDocsSeo(title: string, description: string, path: string, image: string): void {
    this.setMetaTags({
      title,
      description,
      keywords: this.generateDocsKeywords(title),
      url: path,
      type: 'website',
      image: image,
    });
    this.jsonLdService.setDocsJsonLd(title, description, path);
  }

  setHomeSeo(): void {
    this.setMetaTags({
      title: 'Zard UI - The @shadcn/ui Alternative for Angular',
      description:
        'Finally, a real @shadcn/ui alternative for Angular. Free and open-source UI components built with Angular, TypeScript, and Tailwind CSS.',
      keywords: [
        'Angular UI',
        'UI Components',
        'Angular library',
        'Zard UI',
        'ZardUI',
        'Zard',
        'Zard-ui',
        'Zard/ui',
        'Zard/ui shadcn',
        'Zard/ui shadcn/ui',
        'Angular shadcn/ui',
        'ng-zorro shandcn/ui',
        'Tailwind Angular shadcn/ui',
        'Shadcn UI alternative for angular',
        'Shadcn UI alternative',
        'shadcn/ui angular',
        'Open Source UI',
        'Angular tailwind components',
        'TypeScript components',
      ],
      url: '/',
      image: 'https://zardui.com/images/zard-og-image.png',
    });
    this.jsonLdService.setHomeJsonLd();
  }

  private generateDefaultKeywords(title: string): string[] {
    const formattedTitle = title.toLowerCase();
    return [
      `Zard UI ${formattedTitle}`,
      `zard-ui ${formattedTitle}`,
      `zard ${formattedTitle}`,
      `zardui ${formattedTitle}`,
      `shadcn/ui angular ${formattedTitle}`,
      'Angular UI',
      'Tailwind CSS',
      'Angular components',
    ];
  }

  private generateComponentKeywords(componentName: string): string[] {
    const displayName = this.formatComponentName(componentName);
    return [
      `Zard UI ${displayName}`,
      `zard-ui ${componentName}`,
      `zard ${componentName}`,
      `zardui ${componentName}`,
      `zard/ui ${componentName}`,
      `shadcn/ui angular ${componentName}`,
      `Angular ${displayName} component`,
      `${displayName} component`,
      `Tailwind ${displayName}`,
      `Angular ${componentName}`,
      `Angular UI component ${componentName}`,
      `Zard UI ${componentName}`,
    ];
  }

  private generateDocsKeywords(title: string): string[] {
    return [
      `Zard UI ${title}`,
      `zard-ui ${title.toLowerCase()}`,
      `Angular Zard/ui ${title}`,
      `Zard UI docs ${title}`,
      `shadcn/ui angular ${title}`,
      `zard ${title}`,
    ];
  }

  private formatComponentName(componentName: string): string {
    return componentName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private updateCanonicalUrl(url: string): void {
    if (!this.isBrowser) {
      return;
    }

    const existingLink = document.querySelector('link[rel="canonical"]');
    if (existingLink) {
      existingLink.setAttribute('href', url);
    } else {
      const link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      link.setAttribute('href', url);
      document.head.appendChild(link);
    }
  }
}
