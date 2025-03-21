import { ClipboardButtonComponent } from '@zard/domain/components/components/clipboard-button/clipboard-button.component';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardComponent } from '@zard/components/card/card.component';
import { ComponentType } from '@angular/cdk/overlay';
import { NgComponentOutlet } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'z-code-box',
  imports: [MarkdownModule, NgComponentOutlet, ZardButtonComponent, ZardCardComponent],
  templateUrl: './zard-code-box.component.html',
})
export class ZardCodeBoxComponent {
  showCodeButton = false;
  clipboardButton = ClipboardButtonComponent;

  @Input() path?: string;
  @Input() onlyDemo?: boolean;
  @Input() dynamicComponent!: ComponentType<unknown>;
}
