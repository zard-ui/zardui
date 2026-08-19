import { ViewportScroller } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  TemplateRef,
  ViewContainerRef,
  ViewEncapsulation,
  viewChild,
  type OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { SeoService } from '@doc/shared/services/seo.service';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardDialogService } from '@zard/components/dialog/dialog.service';

import { TypesetCodePanelComponent } from './components/typeset-code-panel/typeset-code-panel.component';
import { TypesetCustomizerComponent } from './components/typeset-customizer/typeset-customizer.component';
import { TypesetPreviewComponent } from './components/typeset-preview/typeset-preview.component';
import { TypesetGeneratorService } from './services/typeset-generator.service';

@Component({
  selector: 'app-typeset-page',
  standalone: true,
  imports: [
    RouterLink,
    ZardButtonComponent,
    TypesetCustomizerComponent,
    TypesetPreviewComponent,
    TypesetCodePanelComponent,
  ],
  // O service guarda o estado que vive na URL desta rota; escopá-lo à página
  // evita que ele sobreviva à navegação e reapareça com escolhas de antes.
  providers: [TypesetGeneratorService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './typeset.page.html',
})
export class TypesetPage implements OnInit {
  private readonly seoService = inject(SeoService);
  private readonly viewportScroller = inject(ViewportScroller);
  private readonly dialogService = inject(ZardDialogService);
  private readonly viewContainerRef = inject(ViewContainerRef);

  private readonly codeTemplate = viewChild.required<TemplateRef<unknown>>('codeTemplate');
  private readonly customizerTemplate = viewChild.required<TemplateRef<unknown>>('customizerTemplate');

  ngOnInit(): void {
    this.viewportScroller.scrollToPosition([0, 0]);
    this.seoService.setDocsSeo(
      'Typeset generator',
      'Pick the fonts and the rhythm for your prose, see it applied to real content, and take away the CSS, the font install commands and the preset.',
      '/typeset',
      'og-typeset-generator.jpg',
    );
  }

  protected openCode(): void {
    this.dialogService.create({
      zTitle: 'Get code',
      zDescription: 'Everything you need to put this typeset in your project.',
      zContent: this.codeTemplate(),
      zViewContainerRef: this.viewContainerRef,
      zHideFooter: true,
      zWidth: '48rem',
    });
  }

  protected openCustomizer(): void {
    this.dialogService.create({
      zTitle: 'Customize',
      zContent: this.customizerTemplate(),
      zViewContainerRef: this.viewContainerRef,
      zHideFooter: true,
      zWidth: '26rem',
    });
  }
}
