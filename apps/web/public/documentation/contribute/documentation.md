```angular-ts title="apps/web/src/app/domain/pages/dark-mode/dark-mode.page.ts" showLineNumbers copyButton
import { BLOCK_0 as HEADER_BLOCK_0, BLOCK_1 as HEADER_BLOCK_1 } from '@generated/pages/dark-mode/header-usage';
import { TABS_0 } from '@generated/pages/dark-mode/service-installation';
import { CodeBlockComponent } from '@highlight/components/code-block/code-block.component';
import { CodeTabsComponent } from '@highlight/components/code-tabs/code-tabs.component';
import type { CodeBlockData, CodeTabData } from '@highlight/types';

export class DarkModePage {
  readonly serviceInstallationTabs: CodeTabData = TABS_0;
  readonly headerComponentBlock: CodeBlockData = HEADER_BLOCK_0;
  readonly headerTemplateBlock: CodeBlockData = HEADER_BLOCK_1;
}
```

```angular-html title="Rendering the generated blocks" showLineNumbers copyButton
<z-code-tabs [data]="serviceInstallationTabs" />
<z-code-block [data]="headerComponentBlock" />
```

```angular-ts title="Skeleton of a documentation page" showLineNumbers copyButton
@Component({
  selector: 'z-contribute-faq',
  imports: [DocContentComponent, DocHeadingComponent, ScrollSpyDirective, ScrollSpyItemDirective],
  templateUrl: './faq.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContributeFaqPage implements OnInit {
  activeAnchor?: string;

  private readonly seoService = inject(SeoService);

  readonly navigationConfig: NavigationConfig = {
    items: [
      { id: 'overview', label: 'Overview', type: 'core' },
      { id: 'commits', label: 'Commits', type: 'custom' },
    ],
  };

  ngOnInit(): void {
    this.seoService.setDocsSeo('FAQ', 'Answers to common issues.', '/docs/contribute/faq', 'og-contribute-faq.jpg');
  }
}
```

```angular-html title="Skeleton of the matching template" showLineNumbers copyButton
<z-content
  scrollSpy
  [activeAnchor]="activeAnchor"
  [navigationConfig]="navigationConfig"
  (scrollSpyChange)="activeAnchor = $event"
>
  <z-doc-heading title="FAQ" description="Answers to common issues." scrollSpyItem="overview" id="overview" />

  <section class="flex flex-col gap-6" scrollSpyItem="commits" id="commits">
    <h2 class="text-xl font-bold tracking-tight sm:text-2xl">Commits</h2>
  </section>
</z-content>
```

```bash title="The documentation pipeline" copyButton
# Markdown sources -> apps/web/src/generated/**
npm run generate:highlight

# Everything the CI runs: highlight + component .md + registry + routes + build + page .md
npm run build

# Only the route list (after adding or renaming a route)
node apps/web/update-routes.mjs
```
