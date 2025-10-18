import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';

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
  private readonly baseUrl = 'https://zardui.com';
  private readonly defaultImage = 'https://zardui.com/site/og-image.png';

  setMetaTags(config: SeoConfig): void {
    const fullTitle = `${config.title} - zard/ui`;
    const url = config.url ? `${this.baseUrl}${config.url}` : this.baseUrl;
    const image = `${this.baseUrl}/og/${config.image}` || this.defaultImage;
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

  setComponentSeo(componentName: string, description?: string): void {
    const displayName = this.formatComponentName(componentName);
    const defaultDescription =
      description || `${displayName} component for Angular. Free, open-source, and fully customizable with TailwindCSS. Part of Zard UI component library.`;

    this.setMetaTags({
      title: displayName,
      description: defaultDescription,
      keywords: this.generateComponentKeywords(componentName),
      url: `/docs/components/${componentName}`,
      type: 'article',
    });
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
  }

  setHomeSeo(): void {
    this.setMetaTags({
      title: 'Home',
      description: 'Finally, a real @shadcn/ui alternative for Angular. Free and open-source UI components built with Angular, TypeScript, and Tailwind CSS.',
      keywords: [
        'Angular UI',
        'UI Components',
        'Angular library',
        'Zard UI',
        'ZardUI',
        'ng-zorro tailwind',
        'Tailwind Angular',
        'Shadcn UI alternative',
        'shadcn/ui angular',
        'Open Source UI',
        'Angular components',
        'TypeScript components',
      ],
      url: '/',
    });
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
      `shadcn/ui angular ${componentName}`,
      `Angular ${displayName} component`,
      `${displayName} component`,
      `Tailwind ${displayName}`,
      `Angular ${componentName}`,
      'Angular UI components',
      'Zard UI',
    ];
  }

  private generateDocsKeywords(title: string): string[] {
    return [`Zard UI ${title}`, `zard-ui ${title.toLowerCase()}`, `Angular Zard/ui ${title}`, 'Zard UI docs', `shadcn/ui angular ${title}`, `zard ${title}`];
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
