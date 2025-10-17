import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';

import { DocContentComponent } from '@docs/domain/components/doc-content/doc-content.component';
import { DocHeadingComponent } from '@docs/domain/components/doc-heading/doc-heading.component';
import { COMPONENTS_PATH } from '@docs/shared/constants/routes.constant';
import { SeoService } from '@docs/shared/services/seo.service';

@Component({
  selector: 'z-components-list',
  template: `
    <z-content>
      <z-doc-heading title="Components" description="Here you can find all the components available in the library. We are working on adding more components."> </z-doc-heading>
      <div>
        <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-x-8 lg:gap-x-16 lg:gap-y-6 xl:gap-x-20">
          @for (component of list; track component.name) {
            <a [href]="component.path" class="inline-flex items-center gap-2 text-lg font-medium underline-offset-4 hover:underline md:text-base"> {{ component.name }} </a>
          }
        </section>
      </div>
    </z-content>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocContentComponent, DocHeadingComponent],
})
export class ComponentsListPage implements OnInit {
  private readonly seoService = inject(SeoService);

  readonly list = [...COMPONENTS_PATH.data];

  ngOnInit(): void {
    this.seoService.setDocsSeo(
      'Components',
      'Here you can find all the components available in the library. We are working on adding more components.',
      '/docs/components',
      'og-components.jpg',
    );
  }
}
