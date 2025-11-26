import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, PLATFORM_ID } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, NavigationEnd, RouterLink } from '@angular/router';

import type { ClassValue } from 'clsx';
import { LucideAngularModule, Copy, ChevronDown, ArrowLeft, ArrowRight, ChevronUp } from 'lucide-angular';
import { filter, map, startWith } from 'rxjs/operators';

import { environment } from '@doc/env/environment';
import { SECTIONS, DOCS_PATH, COMPONENTS_PATH } from '@doc/shared/constants/routes.constant';

import type { AiAssistOption } from './ai-assist.types';
import { ZardButtonComponent } from '../../../../../../../libs/zard/button/button.component';
import { ZardDividerComponent } from '../../../../../../../libs/zard/divider/divider.component';
import { ZardPopoverComponent, ZardPopoverDirective } from '../../../../../../../libs/zard/popover/popover.component';

@Component({
  selector: 'z-assist',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    ZardPopoverComponent,
    ZardPopoverDirective,
    ZardDividerComponent,
    ZardButtonComponent,
    LucideAngularModule,
  ],
  templateUrl: './ai-assist.component.html',
  host: {
    '[class]': 'hostClasses()',
  },
})
export class AiAssistComponent {
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly appRoutes = [...SECTIONS.data, ...DOCS_PATH.data, ...COMPONENTS_PATH.data]
    .filter(route => route.available)
    .filter(route => route.path !== '/llms.txt');

  private readonly baseUrl = 'https://zardui.com';

  readonly CopyIcon = Copy;
  readonly ChevronDownIcon = ChevronDown;
  readonly ChevronUpIcon = ChevronUp;
  readonly ArrowLeftIcon = ArrowLeft;
  readonly ArrowRightIcon = ArrowRight;
  readonly class = input<ClassValue>('');

  protected readonly featureCopyPage = environment.features.copyPage;
  protected readonly featureCopyMD = environment.features.copyMD;

  protected readonly hostClasses = computed(() => this.class());

  protected readonly currentPath = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.router.url),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  protected readonly currentRouteIndex = computed(() => {
    const path = this.currentPath();

    let index = this.appRoutes.findIndex(route => route.path === path);

    if (index === -1 && path) {
      const segments = path.split('/').filter(Boolean);
      for (let i = segments.length; i > 0; i--) {
        const parentPath = '/' + segments.slice(0, i).join('/');
        index = this.appRoutes.findIndex(route => route.path === parentPath);
        if (index !== -1) break;
      }
    }

    return index;
  });

  protected readonly prevUrl = computed(() => {
    const index = this.currentRouteIndex();
    if (index <= 0) return null;
    return this.appRoutes[index - 1]?.path || null;
  });

  protected readonly nextUrl = computed(() => {
    const index = this.currentRouteIndex();
    if (index === -1 || index >= this.appRoutes.length - 1) return null;
    return this.appRoutes[index + 1]?.path || null;
  });

  protected readonly currentPageUrl = computed(() => {
    const path = this.currentPath();
    return path ? `${this.baseUrl}${path}` : this.baseUrl;
  });

  protected readonly aiOptions = computed<AiAssistOption[]>(() => {
    const currentUrl = this.currentPageUrl();
    const options: AiAssistOption[] = [
      {
        id: 'chatgpt',
        label: 'Open in ChatGPT',
        url: this.buildAiUrl('chatgpt', currentUrl),
      },
      {
        id: 'claude',
        label: 'Open in Claude',
        url: this.buildAiUrl('claude', currentUrl),
      },
    ];

    if (this.featureCopyMD) {
      options.unshift({
        id: 'markdown',
        label: 'View as Markdown',
        url: `${currentUrl}.md`,
      });
    }

    return options;
  });

  onCopyPage(): void {
    if (!this.isBrowser) return;
    this.copyPageContent();
  }

  private buildAiUrl(provider: 'chatgpt' | 'claude', currentUrl: string): string {
    const message = encodeURIComponent(
      `I'm looking at this ZardUI documentation: ${currentUrl}.\nHelp me understand how to use it. Be ready to explain concepts, give examples, or help debug based on it.\n  `,
    );

    const baseUrls = {
      chatgpt: 'https://chatgpt.com',
      claude: 'https://claude.ai/new',
    };

    return `${baseUrls[provider]}?q=${message}`;
  }

  private async copyPageContent(): Promise<void> {
    if (!this.isBrowser) return;

    try {
      const pageContent = this.document.body.innerText;
      await navigator.clipboard.writeText(pageContent);
      console.log('Page content copied to clipboard');
    } catch (err) {
      console.error('Failed to copy page content:', err);
    }
  }
}
