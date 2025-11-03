import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, Renderer2, RendererFactory2 } from '@angular/core';

export interface JsonLdWebSite {
  '@context': 'https://schema.org';
  '@type': 'WebSite';
  name: string;
  url: string;
  description: string;
  author: {
    '@type': 'Person';
    name: string;
  };
}

export interface JsonLdSoftwareApplication {
  '@context': 'https://schema.org';
  '@type': 'SoftwareApplication';
  name: string;
  applicationCategory: string;
  offers: {
    '@type': 'Offer';
    price: string;
  };
  operatingSystem: string;
  description: string;
  url: string;
  author: {
    '@type': 'Person';
    name: string;
  };
}

export interface JsonLdArticle {
  '@context': 'https://schema.org';
  '@type': 'Article';
  headline: string;
  description: string;
  image?: string;
  author: {
    '@type': 'Person';
    name: string;
  };
  publisher: {
    '@type': 'Organization';
    name: string;
    logo: {
      '@type': 'ImageObject';
      url: string;
    };
  };
  datePublished?: string;
  dateModified?: string;
  url: string;
}

export interface JsonLdBreadcrumb {
  '@context': 'https://schema.org';
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item?: string;
  }>;
}

export type JsonLdSchema = JsonLdWebSite | JsonLdSoftwareApplication | JsonLdArticle | JsonLdBreadcrumb;

@Injectable({
  providedIn: 'root',
})
export class JsonLdService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly renderer: Renderer2;
  private currentScripts: HTMLScriptElement[] = [];
  private readonly baseUrl = 'https://zardui.com';
  private readonly authorName = 'Luiz Gomes';

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  setJsonLd(schema: JsonLdSchema): void {
    if (!this.isBrowser) {
      return;
    }

    this.removeJsonLd();

    const script = this.renderer.createElement('script');
    this.renderer.setAttribute(script, 'type', 'application/ld+json');
    const jsonContent = JSON.stringify(schema, null, 2);
    this.renderer.appendChild(script, this.renderer.createText(jsonContent));
    this.renderer.appendChild(document.head, script);

    this.currentScripts = [script];
  }

  removeJsonLd(): void {
    if (!this.isBrowser) {
      return;
    }

    this.currentScripts.forEach(script => {
      if (script && script.parentNode) {
        this.renderer.removeChild(document.head, script);
      }
    });
    this.currentScripts = [];
  }

  setHomeJsonLd(): void {
    const schema: JsonLdWebSite = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Zard UI',
      url: this.baseUrl,
      description: 'Finally, a real @shadcn/ui alternative for Angular. Free and open-source UI components built with Angular, TypeScript, and Tailwind CSS.',
      author: {
        '@type': 'Person',
        name: this.authorName,
      },
    };

    this.setJsonLd(schema);
  }

  setComponentJsonLd(componentName: string, description: string): void {
    const displayName = this.formatComponentName(componentName);
    const url = `${this.baseUrl}/docs/components/${componentName}`;

    const article: JsonLdArticle = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: `${displayName} - zard/ui`,
      description: description,
      image: `${this.baseUrl}/og/og-${componentName}.jpg`,
      author: {
        '@type': 'Person',
        name: this.authorName,
      },
      publisher: {
        '@type': 'Organization',
        name: 'Zard UI',
        logo: {
          '@type': 'ImageObject',
          url: `${this.baseUrl}/images/zard-og-image.png`,
        },
      },
      dateModified: new Date().toISOString(),
      url: url,
    };

    const breadcrumb: JsonLdBreadcrumb = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: this.baseUrl,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Components',
          item: `${this.baseUrl}/docs/components`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: displayName,
          item: url,
        },
      ],
    };

    this.setMultipleJsonLd([article, breadcrumb]);
  }

  setDocsJsonLd(title: string, description: string, path: string): void {
    const url = `${this.baseUrl}${path}`;

    const article: JsonLdArticle = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description: description,
      author: {
        '@type': 'Person',
        name: this.authorName,
      },
      publisher: {
        '@type': 'Organization',
        name: 'Zard UI',
        logo: {
          '@type': 'ImageObject',
          url: `${this.baseUrl}/images/zard-og-image.png`,
        },
      },
      dateModified: new Date().toISOString(),
      url: url,
    };

    this.setJsonLd(article);
  }

  setSoftwareApplicationJsonLd(): void {
    const schema: JsonLdSoftwareApplication = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Zard UI',
      applicationCategory: 'DeveloperApplication',
      offers: {
        '@type': 'Offer',
        price: '0',
      },
      operatingSystem: 'Any',
      description: 'Finally, a real @shadcn/ui alternative for Angular. Free and open-source UI components built with Angular, TypeScript, and Tailwind CSS.',
      url: this.baseUrl,
      author: {
        '@type': 'Person',
        name: this.authorName,
      },
    };

    this.setJsonLd(schema);
  }

  private setMultipleJsonLd(schemas: JsonLdSchema[]): void {
    if (!this.isBrowser) {
      return;
    }

    this.removeJsonLd();

    this.currentScripts = schemas.map(schema => {
      const script = this.renderer.createElement('script');
      this.renderer.setAttribute(script, 'type', 'application/ld+json');
      const jsonContent = JSON.stringify(schema, null, 2);
      this.renderer.appendChild(script, this.renderer.createText(jsonContent));
      this.renderer.appendChild(document.head, script);
      return script;
    });
  }

  private formatComponentName(componentName: string): string {
    return componentName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
