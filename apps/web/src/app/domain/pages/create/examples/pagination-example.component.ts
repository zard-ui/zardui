import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardFieldImports } from '@zard/components/field';
import { ZardPaginationImports } from '@zard/components/pagination';
import { ZardSelectImports } from '@zard/components/select';

import { ExampleImports } from './example.component';

/** shadcn/ui's `pagination-example`, in zard. The links are inert, as shadcn's `href="#"` ones are. */
@Component({
  selector: 'z-pagination-example',
  imports: [ExampleImports, ZardFieldImports, ZardPaginationImports, ZardSelectImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <z-example-wrapper>
      <z-example zTitle="Basic">
        <z-pagination [zContent]="basic" />
        <ng-template #basic>
          <ul z-pagination-content>
            <li z-pagination-item><z-pagination-previous /></li>
            @for (page of basicPages; track page) {
              <li z-pagination-item>
                <a z-pagination-button href="#" [zActive]="page === 2">{{ page }}</a>
              </li>
            }
            <li z-pagination-item><z-pagination-ellipsis /></li>
            <li z-pagination-item><z-pagination-next /></li>
          </ul>
        </ng-template>
      </z-example>

      <z-example zTitle="Simple">
        <z-pagination [zContent]="simple" />
        <ng-template #simple>
          <ul z-pagination-content>
            @for (page of simplePages; track page) {
              <li z-pagination-item>
                <a z-pagination-button href="#" [zActive]="page === 2">{{ page }}</a>
              </li>
            }
          </ul>
        </ng-template>
      </z-example>

      <z-example zTitle="With Select" zContainerClass="col-span-2">
        <div class="flex items-center justify-between gap-4">
          <div z-field zOrientation="horizontal" class="w-fit">
            <label z-field-label for="select-rows-per-page">Rows per page</label>
            <z-select id="select-rows-per-page" class="w-20" zAlign="start" [(zValue)]="rowsPerPage">
              <z-select-group>
                <z-select-item zValue="10">10</z-select-item>
                <z-select-item zValue="25">25</z-select-item>
                <z-select-item zValue="50">50</z-select-item>
                <z-select-item zValue="100">100</z-select-item>
              </z-select-group>
            </z-select>
          </div>
          <z-pagination class="mx-0 w-auto" [zContent]="nav" />
          <ng-template #nav>
            <ul z-pagination-content>
              <li z-pagination-item><z-pagination-previous /></li>
              <li z-pagination-item><z-pagination-next /></li>
            </ul>
          </ng-template>
        </div>
      </z-example>
    </z-example-wrapper>
  `,
})
export class PaginationExampleComponent {
  protected readonly basicPages = [1, 2, 3] as const;
  protected readonly simplePages = [1, 2, 3, 4, 5] as const;
  protected readonly rowsPerPage = signal<string | string[]>('25');
}
