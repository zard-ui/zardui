// eslint-disable-next-line @nx/enforce-module-boundaries
import { COMPONENTS } from 'apps/web/src/app/shared/constants/components.constant';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ZardCodeBoxComponent } from 'apps/web/src/app/widget/components/zard-code-box/zard-code-box.component';
import { MarkdownModule } from 'ngx-markdown';

import { CommonModule, ViewportScroller } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ScrollSpyItemDirective } from '../../directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '../../directives/scroll-spy.directive';

@Component({
  selector: 'z-dynamic',
  templateUrl: './dynamic.component.html',
  styleUrls: ['./dynamic.component.scss'],
  standalone: true,
  imports: [CommonModule, MarkdownModule, ZardCodeBoxComponent, ScrollSpyDirective, ScrollSpyItemDirective],
})
export class DynamicComponent {
  activeAnchor?: string;
  componentData: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private viewportScroller: ViewportScroller,
  ) {
    this.activatedRoute.params.subscribe(_ => {
      this.loadData();
    });
    this.loadData();
  }

  scrollToAnchor(anchor: string) {
    this.activeAnchor = anchor;
    this.viewportScroller.scrollToAnchor(anchor);
  }

  private loadData() {
    this.viewportScroller.scrollToPosition([0, 0]);
    const componentName = this.activatedRoute.snapshot.paramMap.get('componentName');
    if (!componentName) this.router.navigateByUrl('/');

    const component = COMPONENTS.find(x => x.componentName === componentName);

    if (!component) this.router.navigateByUrl('/');
    this.componentData = component;
  }
}
