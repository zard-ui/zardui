import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCog,
  lucideFolderTree,
  lucideGlobe,
  lucideInfinity,
  lucideList,
  lucideRefreshCw,
} from '@ng-icons/lucide';

interface PipelineStage {
  step: string;
  icon: string;
  title: string;
  path: string;
  description: string;
  tokens: string[];
}

interface CacheRule {
  icon: string;
  path: string;
  cacheControl: string;
  reason: string;
}

@Component({
  selector: 'z-registry-how-it-works-section',
  imports: [NgIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 class="font-heading mt-12 scroll-m-28 text-2xl font-semibold tracking-tight first:mt-0 lg:mt-20">
      How it works
    </h2>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      The registry is not a service: it is the output of a build step that runs in this repository and is published
      together with the website. Four stages turn Angular source files into static JSON.
    </p>

    <div class="mt-8">
      @for (stage of stages; track stage.title; let last = $last) {
        <article class="flex gap-4 sm:gap-6">
          <div class="flex flex-col items-center">
            <div
              class="bg-muted text-muted-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-full border"
            >
              <ng-icon [name]="stage.icon" class="text-lg" />
            </div>
            @if (!last) {
              <div class="bg-border w-px flex-1"></div>
            }
          </div>

          <div class="min-w-0 flex-1" [class.pb-10]="!last">
            <div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span class="text-muted-foreground font-mono text-xs">{{ stage.step }}</span>
              <h3 class="text-lg font-semibold tracking-tight">{{ stage.title }}</h3>
            </div>
            <p class="text-muted-foreground mt-1 font-mono text-xs break-all sm:text-sm">{{ stage.path }}</p>
            <p class="text-muted-foreground mt-3 text-base leading-relaxed">{{ stage.description }}</p>
            <div class="mt-3 flex flex-wrap items-center gap-2">
              @for (token of stage.tokens; track token) {
                <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">{{ token }}</code>
              }
            </div>
          </div>
        </article>
      }
    </div>

    <h3 class="mt-12 scroll-m-20 text-lg font-semibold tracking-tight">Caching and CORS</h3>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      The two kinds of file change at different rates, so they are cached differently.
    </p>

    <div class="mt-4 grid gap-4 sm:grid-cols-2">
      @for (rule of cacheRules; track rule.path) {
        <div class="rounded-lg border p-4">
          <div class="flex items-center gap-2">
            <ng-icon [name]="rule.icon" class="text-muted-foreground text-base" />
            <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">{{ rule.path }}</code>
          </div>
          <p class="text-muted-foreground mt-3 font-mono text-xs break-all">{{ rule.cacheControl }}</p>
          <p class="text-muted-foreground mt-2 text-sm leading-relaxed">{{ rule.reason }}</p>
        </div>
      }
    </div>

    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      Both rules answer with
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">Access-Control-Allow-Origin: *</code>
      and
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">
        Content-Type: application/json; charset=utf-8
      </code>
      , so the registry can be read from a browser as easily as from a terminal.
    </p>
  `,
  viewProviders: [
    provideIcons({ lucideFolderTree, lucideList, lucideCog, lucideGlobe, lucideInfinity, lucideRefreshCw }),
  ],
})
export class RegistryHowItWorksSectionComponent {
  readonly stages: PipelineStage[] = [
    {
      step: '01',
      icon: 'lucideFolderTree',
      title: 'Source',
      path: 'libs/zard/src/lib/shared/',
      description:
        'Every component, service and utility lives in the monorepo as ordinary Angular source. Nothing in these files is registry-specific.',
      tokens: ['components/', 'core/', 'services/', 'utils/'],
    },
    {
      step: '02',
      icon: 'lucideList',
      title: 'Manifest',
      path: 'packages/cli/src/core/registry/registry-data.ts',
      description:
        'A single TypeScript array declares what ships. Each entry names the item, where it should land in the consumer project, and which files and dependencies it needs.',
      tokens: ['name', 'basePath', 'dependencies', 'devDependencies', 'registryDependencies', 'files'],
    },
    {
      step: '03',
      icon: 'lucideCog',
      title: 'Build',
      path: 'scripts/build-registry.cts',
      description:
        'Running npm run build:registry reads each declared file from disk, inlines its full content and writes one JSON per item plus the index. When a component ships doc/overview.md, doc/api.md or demo files, they are folded into the docs and demos fields.',
      tokens: ['npm run build:registry'],
    },
    {
      step: '04',
      icon: 'lucideGlobe',
      title: 'Serve',
      path: 'apps/web/public/r/  →  https://zardui.com/r',
      description:
        'The generated files are plain static assets of this website. There is no API and no runtime: any HTTP client can read them.',
      tokens: ['registry.json', '<name>.json', 'blocks/'],
    },
  ];

  readonly cacheRules: CacheRule[] = [
    {
      icon: 'lucideInfinity',
      path: '/r/*',
      cacheControl: 'public, max-age=31536000, immutable',
      reason:
        'An item file describes one published version of a component, so it never changes once written and is cached for a year.',
    },
    {
      icon: 'lucideRefreshCw',
      path: '/r/registry.json',
      cacheControl: 'public, max-age=3600, must-revalidate',
      reason:
        'The index is the only document that has to reflect new items and new versions, so it is cached for an hour and revalidated afterwards.',
    },
  ];
}
