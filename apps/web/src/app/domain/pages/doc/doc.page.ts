import { MarkdownModule } from 'ngx-markdown';

import { CommonModule, ViewportScroller } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DynamicAnchorComponent } from '@zard/domain/components/dynamic-anchor/dynamic-anchor.component';
import { ZardMarkdownComponent } from '@zard/domain/components/markdown/markdown.component';
import { SidebarComponent } from '@zard/domain/components/sidebar/sidebar.component';
import { DocData, DOCS } from '@zard/shared/constants/docs.constant';

import { ScrollSpyItemDirective } from '../../directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '../../directives/scroll-spy.directive';

@Component({
  selector: 'z-documentation',
  templateUrl: './doc.page.html',
  standalone: true,
  imports: [CommonModule, DynamicAnchorComponent, MarkdownModule, ScrollSpyDirective, ScrollSpyItemDirective, SidebarComponent, ZardMarkdownComponent],
})
export class DocPage {
  activeAnchor?: string;
  docData?: DocData;

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
    const docName = this.activatedRoute.snapshot.paramMap.get('docName');
    if (!docName) this.router.navigateByUrl('/');

    const documentation = DOCS.find((x: DocData) => x.docName === docName);

    if (!documentation) this.router.navigateByUrl('/');
    else this.docData = documentation;
  }
}
