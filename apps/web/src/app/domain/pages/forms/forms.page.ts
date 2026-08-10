import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';

import { provideIcons } from '@ng-icons/core';
import { lucideCode, lucideWorkflow, lucideZap } from '@ng-icons/lucide';

import { DocContentComponent } from '@doc/domain/components/doc-content/doc-content.component';
import { DocHeadingComponent } from '@doc/domain/components/doc-heading/doc-heading.component';
import { NavigationConfig } from '@doc/domain/components/dynamic-anchor/dynamic-anchor.component';
import { ScrollSpyItemDirective } from '@doc/domain/directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '@doc/domain/directives/scroll-spy.directive';
import { SeoService } from '@doc/shared/services/seo.service';

import { FormApproachCardComponent } from './components/form-approach-card.component';
import { FORM_APPROACHES, formApproachPath } from './forms.constant';

const APPROACH_ICONS: Record<string, string> = {
  'signal-forms': 'lucideZap',
  'reactive-forms': 'lucideWorkflow',
  'template-driven-forms': 'lucideCode',
};

@Component({
  selector: 'z-forms',
  imports: [
    DocContentComponent,
    DocHeadingComponent,
    FormApproachCardComponent,
    ScrollSpyDirective,
    ScrollSpyItemDirective,
  ],
  template: `
    <z-content
      [navigationConfig]="navigationConfig"
      [activeAnchor]="activeAnchor"
      scrollSpy
      (scrollSpyChange)="activeAnchor = $event"
    >
      <z-doc-heading
        title="Forms"
        description="Build forms with Angular and zard/ui."
        scrollSpyItem="overview"
        id="overview"
      ></z-doc-heading>

      <section class="flex flex-col gap-8 sm:gap-10" scrollSpyItem="approaches" id="approaches">
        <div class="flex flex-col gap-6">
          <h2 class="font-heading mt-8 scroll-m-28 text-2xl font-medium tracking-tight first:mt-0 lg:mt-12">
            Pick Your Approach
          </h2>
          <p class="leading-relaxed">
            Angular ships three ways to build a form. Start by picking the one you want to use, then follow the guide to
            learn how to build accessible, validated forms with the zard/ui components you already have.
          </p>
        </div>

        <div class="grid gap-6 sm:grid-cols-2">
          @for (approach of approaches; track approach.slug) {
            <z-form-approach-card
              [name]="approach.name"
              [path]="path(approach.slug)"
              [icon]="iconFor(approach.slug)"
              [available]="approach.available"
            />
          }
        </div>
      </section>

      <section class="flex flex-col gap-4" scrollSpyItem="which-one" id="which-one">
        <h2 class="font-heading mt-8 scroll-m-28 text-2xl font-medium tracking-tight lg:mt-12">
          Which one should I use?
        </h2>
        <p class="text-muted-foreground leading-relaxed">
          All three build on the same zard/ui primitives —
          <code class="bg-muted rounded px-1.5 py-0.5 text-sm">field / input / select / checkbox</code>
          and friends. What changes is where the state and the validation rules live.
        </p>

        <div class="overflow-x-auto rounded-lg border">
          <table class="w-full text-left text-sm">
            <thead class="bg-muted/50">
              <tr>
                <th class="px-4 py-3 font-medium">Approach</th>
                <th class="px-4 py-3 font-medium">State lives in</th>
                <th class="px-4 py-3 font-medium">Best for</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-t">
                <td class="px-4 py-3 font-medium">Signal Forms</td>
                <td class="text-muted-foreground px-4 py-3">A writable signal you own</td>
                <td class="text-muted-foreground px-4 py-3">New code on Angular 21+, signal-based apps</td>
              </tr>
              <tr class="border-t">
                <td class="px-4 py-3 font-medium">Reactive Forms</td>
                <td class="text-muted-foreground px-4 py-3">
                  <code class="bg-muted rounded px-1.5 py-0.5 text-xs">FormGroup</code>
                  /
                  <code class="bg-muted rounded px-1.5 py-0.5 text-xs">FormControl</code>
                </td>
                <td class="text-muted-foreground px-4 py-3">Dynamic forms, complex validation, existing codebases</td>
              </tr>
              <tr class="border-t">
                <td class="px-4 py-3 font-medium">Template-driven Forms</td>
                <td class="text-muted-foreground px-4 py-3">
                  A plain object bound with
                  <code class="bg-muted rounded px-1.5 py-0.5 text-xs">ngModel</code>
                </td>
                <td class="text-muted-foreground px-4 py-3">Short forms with a handful of fields</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p class="text-muted-foreground leading-relaxed">
          If you are starting fresh and already on Angular 21, go with Signal Forms. If you need something that has been
          stable for years, Reactive Forms is the safe choice.
        </p>
      </section>
    </z-content>
  `,
  viewProviders: [provideIcons({ lucideCode, lucideWorkflow, lucideZap })],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormsPage implements OnInit {
  private readonly seoService = inject(SeoService);

  protected readonly approaches = FORM_APPROACHES;
  activeAnchor?: string;

  readonly navigationConfig: NavigationConfig = {
    items: [
      { id: 'overview', label: 'Overview', type: 'core' },
      { id: 'approaches', label: 'Pick Your Approach', type: 'custom' },
      { id: 'which-one', label: 'Which one should I use?', type: 'custom' },
    ],
  };

  protected path(slug: string): string {
    return formApproachPath(slug);
  }

  protected iconFor(slug: string): string {
    return APPROACH_ICONS[slug] ?? 'lucideCode';
  }

  ngOnInit(): void {
    this.seoService.setDocsSeo(
      'Forms',
      'Build forms with Angular and zard/ui. Guides for Signal Forms, Reactive Forms and Template-driven Forms.',
      '/docs/forms',
      'og-forms.jpg',
    );
  }
}
