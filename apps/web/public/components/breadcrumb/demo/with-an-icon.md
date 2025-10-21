```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardBreadcrumbModule } from '../breadcrumb.module';
import { ZardIconComponent } from '../../icon/icon.component';
import { House, Puzzle, SquareLibrary } from 'lucide-angular';

@Component({
  standalone: true,
  imports: [ZardBreadcrumbModule, ZardIconComponent],
  template: `
    <z-breadcrumb>
      <z-breadcrumb-list zWrap="wrap" zAlign="start">
        <z-breadcrumb-item>
          <z-breadcrumb-link zLink="/">
            <div z-icon [zType]="HouseIcon"></div>
            Home
          </z-breadcrumb-link>
        </z-breadcrumb-item>
        <z-breadcrumb-separator />
        <z-breadcrumb-item>
          <z-breadcrumb-link zLink="/components">
            <div z-icon [zType]="PuzzleIcon"></div>
            Components
          </z-breadcrumb-link>
        </z-breadcrumb-item>
        <z-breadcrumb-separator />
        <z-breadcrumb-item>
          <z-breadcrumb-page>
            <div z-icon [zType]="SquareLibraryIcon"></div>
            Breadcrumb
          </z-breadcrumb-page>
        </z-breadcrumb-item>
      </z-breadcrumb-list>
    </z-breadcrumb>
  `,
})
export class ZardDemoBreadcrumbWithAnIconComponent {
  readonly HouseIcon = House;
  readonly PuzzleIcon = Puzzle;
  readonly SquareLibraryIcon = SquareLibrary;
}

```