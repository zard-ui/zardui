```angular-ts showLineNumbers
import { Component } from '@angular/core';

import { ZardPaginationModule } from '../pagination.module';


@Component({
  standalone: true,
  imports: [ZardPaginationModule],
  template: `
    <z-pagination-basic>
      <z-pagination-content>
        <z-pagination-item>
          <z-pagination-previous zLink="/#" />
        </z-pagination-item>
        <z-pagination-item>
          <z-pagination-link zLink="/#">1</z-pagination-link>
        </z-pagination-item>
        <z-pagination-item>
          <z-pagination-link zLink="/#" zActive>2</z-pagination-link>
        </z-pagination-item>
        <z-pagination-item>
          <z-pagination-link zLink="/#">3</z-pagination-link>
        </z-pagination-item>
        <z-pagination-item>
          <z-pagination-ellipsis />
        </z-pagination-item>
        <z-pagination-item>
          <z-pagination-next zLink="/#" />
        </z-pagination-item>
      </z-pagination-content>
    </z-pagination-basic>
  `,
})
export class ZardDemoPaginationBasicComponent {}

```