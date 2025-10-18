# Guia de Uso do JsonLdService

Este documento explica como usar o `JsonLdService` para melhorar o SEO do site com structured data (JSON-LD).

## O que é JSON-LD?

JSON-LD (JavaScript Object Notation for Linked Data) é um formato de dados estruturados que ajuda os mecanismos de busca a entender melhor o conteúdo do seu site. Isso pode resultar em:

- **Rich snippets** nos resultados de busca (estrelas, imagens, breadcrumbs, etc.)
- **Melhor ranking** no Google
- **Knowledge Graph** do Google
- **Melhor CTR** (Click-Through Rate)

## Como Funciona

O `JsonLdService` é automaticamente integrado com o `SeoService`. Quando você chama métodos do `SeoService`, o JSON-LD é criado automaticamente:

### 1. Página Inicial (Home)

```typescript
import { SeoService } from '@zard/shared/services/seo.service';
import { Component, inject, OnInit } from '@angular/core';

@Component({
  selector: 'z-home',
  template: `...`
})
export class HomePage implements OnInit {
  private readonly seoService = inject(SeoService);

  ngOnInit(): void {
    // Automaticamente cria meta tags + JSON-LD do tipo WebSite
    this.seoService.setHomeSeo();
  }
}
```

**JSON-LD gerado:**
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Zard UI",
  "url": "https://zardui.com",
  "description": "Finally, a real @shadcn/ui alternative for Angular...",
  "author": {
    "@type": "Person",
    "name": "Luiz Gomes"
  }
}
```

### 2. Páginas de Componentes

```typescript
import { SeoService } from '@zard/shared/services/seo.service';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'z-component',
  template: `...`
})
export class ComponentPage {
  private readonly seoService = inject(SeoService);

  setPageTitle() {
    const componentName = 'button';
    const description = 'A customizable button component...';
    const ogImage = 'og-button.jpg';

    // Automaticamente cria meta tags + JSON-LD do tipo Article + Breadcrumb
    this.seoService.setComponentSeo(componentName, description, ogImage);
  }
}
```

**JSON-LD gerado (2 schemas):**

1. **Article Schema:**
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Button - Angular Component",
  "description": "A customizable button component...",
  "image": "https://zardui.com/og/og-button.jpg",
  "author": {
    "@type": "Person",
    "name": "Luiz Gomes"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Zard UI",
    "logo": {
      "@type": "ImageObject",
      "url": "https://zardui.com/site/og-image.png"
    }
  },
  "dateModified": "2025-10-18T...",
  "url": "https://zardui.com/docs/components/button"
}
```

2. **Breadcrumb Schema:**
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://zardui.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Components",
      "item": "https://zardui.com/docs/components"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Button",
      "item": "https://zardui.com/docs/components/button"
    }
  ]
}
```

### 3. Páginas de Documentação

```typescript
import { SeoService } from '@zard/shared/services/seo.service';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'z-install',
  template: `...`
})
export class InstallPage {
  private readonly seoService = inject(SeoService);

  setPageTitle() {
    // Automaticamente cria meta tags + JSON-LD do tipo Article
    this.seoService.setDocsSeo(
      'Angular Installation',
      'Learn how to install Zard UI in your Angular project...',
      '/docs/installation/angular',
      'og-angular.jpg'
    );
  }
}
```

**JSON-LD gerado:**
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Angular Installation",
  "description": "Learn how to install Zard UI...",
  "author": {
    "@type": "Person",
    "name": "Luiz Gomes"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Zard UI",
    "logo": {
      "@type": "ImageObject",
      "url": "https://zardui.com/site/og-image.png"
    }
  },
  "dateModified": "2025-10-18T...",
  "url": "https://zardui.com/docs/installation/angular"
}
```

## Uso Direto do JsonLdService

Se você precisar criar um JSON-LD customizado, pode usar o `JsonLdService` diretamente:

```typescript
import { JsonLdService } from '@zard/shared/services/json-ld.service';
import { Component, inject, OnInit } from '@angular/core';

@Component({
  selector: 'z-custom-page',
  template: `...`
})
export class CustomPage implements OnInit {
  private readonly jsonLdService = inject(JsonLdService);

  ngOnInit(): void {
    // Criar um schema customizado
    this.jsonLdService.setJsonLd({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Minha Página Customizada',
      url: 'https://zardui.com/custom',
      description: 'Uma descrição customizada',
      author: {
        '@type': 'Person',
        name: 'Seu Nome'
      }
    });
  }

  ngOnDestroy(): void {
    // Limpar o JSON-LD ao sair da página
    this.jsonLdService.removeJsonLd();
  }
}
```

## Métodos Disponíveis

### JsonLdService

- **`setJsonLd(schema: JsonLdSchema)`** - Define um único schema JSON-LD
- **`removeJsonLd()`** - Remove o JSON-LD atual
- **`setHomeJsonLd()`** - Define JSON-LD para a home
- **`setComponentJsonLd(name, description)`** - Define JSON-LD para páginas de componentes
- **`setDocsJsonLd(title, description, path)`** - Define JSON-LD para páginas de documentação
- **`setSoftwareApplicationJsonLd()`** - Define JSON-LD como aplicação de software

### SeoService (já inclui JSON-LD automaticamente)

- **`setHomeSeo()`** - Define SEO + JSON-LD para home
- **`setComponentSeo(name, description, image)`** - Define SEO + JSON-LD para componentes
- **`setDocsSeo(title, description, path, image)`** - Define SEO + JSON-LD para docs

## Tipos de Schema Suportados

1. **WebSite** - Para a página inicial
2. **Article** - Para páginas de conteúdo (componentes, docs)
3. **BreadcrumbList** - Para navegação breadcrumb
4. **SoftwareApplication** - Para descrever a biblioteca como software

## Verificação

Para verificar se o JSON-LD está funcionando:

1. Abra o DevTools do navegador
2. Vá para a aba **Elements**
3. Procure por `<script type="application/ld+json">` no `<head>`
4. Use o [Google Rich Results Test](https://search.google.com/test/rich-results) para validar

## Benefícios para SEO

✅ **Rich Snippets** - Aparecer com informações enriquecidas no Google
✅ **Breadcrumbs** - Mostrar navegação nos resultados de busca
✅ **Author Information** - Credibilidade do conteúdo
✅ **Better Indexing** - Google entende melhor o conteúdo
✅ **Higher CTR** - Mais cliques nos resultados de busca

## Observações Importantes

- O JSON-LD **só é renderizado no browser** (não no SSR por padrão)
- Cada página deve ter seu próprio JSON-LD
- O JSON-LD é **atualizado automaticamente** ao navegar entre páginas
- Sempre remova o JSON-LD anterior antes de adicionar um novo (o serviço faz isso automaticamente)
