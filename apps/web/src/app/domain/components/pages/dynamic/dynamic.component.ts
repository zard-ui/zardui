import { MarkdownModule } from 'ngx-markdown';

import { CommonModule, ViewportScroller } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentData, COMPONENTS } from '@zard/shared/constants/components.constant';
import { ZardCodeBoxComponent } from '@zard/widget/components/zard-code-box/zard-code-box.component';

import { DynamicAnchorComponent } from '../../components/dynamic-anchor/dynamic-anchor.component';
import { ScrollSpyItemDirective } from '../../directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '../../directives/scroll-spy.directive';

@Component({
  selector: 'z-dynamic',
  templateUrl: './dynamic.component.html',
  styleUrls: ['./dynamic.component.scss'],
  standalone: true,
  imports: [CommonModule, DynamicAnchorComponent, MarkdownModule, ZardCodeBoxComponent, ScrollSpyDirective, ScrollSpyItemDirective],
})
export class DynamicComponent {
  activeAnchor?: string;
  componentData?: ComponentData;

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

  private loadData() {
    this.viewportScroller.scrollToPosition([0, 0]);
    const componentName = this.activatedRoute.snapshot.paramMap.get('componentName');
    if (!componentName) this.router.navigateByUrl('/');

    const component = COMPONENTS.find(x => x.componentName === componentName);

    if (!component) this.router.navigateByUrl('/');
    else this.componentData = component;
  }
}
