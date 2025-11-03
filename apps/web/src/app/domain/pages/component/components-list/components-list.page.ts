import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';

import { DocContentComponent } from '@doc/domain/components/doc-content/doc-content.component';
import { DocHeadingComponent } from '@doc/domain/components/doc-heading/doc-heading.component';
import { COMPONENTS_PATH } from '@doc/shared/constants/routes.constant';
import { SeoService } from '@doc/shared/services/seo.service';

@Component({
  selector: 'z-components-list',
  template: `
    <z-content>
      <z-doc-heading title="Components" description="Here you can find all the components available in the library. We are working on adding more components."> </z-doc-heading>
      <div>
        <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-x-8 lg:gap-x-16 lg:gap-y-6 xl:gap-x-20">
          @for (component of list; track component.name) {
            @if (component.available) {
              <a [routerLink]="component.path" class="inline-flex items-center gap-2 text-lg font-medium underline-offset-4 hover:underline md:text-base"> {{ component.name }} </a>
            }
          }
        </section>
      </div>
    </z-content>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocContentComponent, DocHeadingComponent, RouterLinkWithHref],
})
export class ComponentsListPage implements OnInit {
  private readonly seoService = inject(SeoService);

  readonly list = [...COMPONENTS_PATH.data];

  ngOnInit(): void {
    this.seoService.setDocsSeo(
      'Components',
      'Here you can find all the components available in the library. We are working on adding more components.',
      '/doc/components',
      'og-components.jpg',
    );
  }
}
