import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardDialogImports } from '@zard/components/dialog/dialog.imports';
import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardInputComponent } from '@zard/components/input/input.component';
import { ZardSelectImports } from '@zard/components/select/select.imports';
import { ZardTextareaComponent } from '@zard/components/textarea/textarea.component';
import { fontById } from '@zard/design';

import { PreviewDesignContext } from '../../lib/preview-design.context';

@Component({
  selector: 'z-preview-02-typography-specimen',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ZardCardImports,
    ZardButtonComponent,
    ZardDialogImports,
    ZardFieldImports,
    ZardInputComponent,
    ZardSelectImports,
    ZardTextareaComponent,
  ],
  host: { class: 'block' },
  template: `
    <z-card>
      <z-card-content class="flex flex-col gap-2">
        <div class="text-muted-foreground text-xs font-medium uppercase">{{ headingLabel() }} - {{ bodyLabel() }}</div>
        <p
          class="cn-font-heading style-sera:text-lg style-sera:font-semibold style-sera:tracking-wider style-sera:uppercase text-2xl font-medium"
        >
          Designing with rhythm and hierarchy.
        </p>
        <p class="text-muted-foreground text-sm leading-relaxed">
          A strong body style keeps long-form content readable and balances the visual weight of headings.
        </p>
        <p class="text-muted-foreground text-sm leading-relaxed">
          Thoughtful spacing and cadence help paragraphs scan quickly without feeling dense.
        </p>
      </z-card-content>
      <z-card-footer>
        <button type="button" z-button zType="outline" class="w-full" (click)="open.set(true)">Share Feedback</button>
        <z-dialog [(zVisible)]="open">
          <z-dialog-header>
            <z-dialog-title>Share Feedback</z-dialog-title>
            <z-dialog-description>Let us know how we can improve your experience.</z-dialog-description>
          </z-dialog-header>
          <z-field-group>
            <div class="grid grid-cols-2 gap-3">
              <z-field>
                <label z-field-label for="p2-feedback-name">Name</label>
                <input z-input id="p2-feedback-name" placeholder="Your name" />
              </z-field>
              <z-field>
                <label z-field-label for="p2-feedback-email">Email</label>
                <input z-input id="p2-feedback-email" type="email" placeholder="you@example.com" />
              </z-field>
            </div>
            <z-field>
              <z-field-label>Category</z-field-label>
              <z-select class="w-full" zValue="general" aria-label="Category">
                <z-select-group>
                  <z-select-item zValue="general">General</z-select-item>
                  <z-select-item zValue="bug">Bug Report</z-select-item>
                  <z-select-item zValue="feature">Feature Request</z-select-item>
                  <z-select-item zValue="improvement">Improvement</z-select-item>
                </z-select-group>
              </z-select>
            </z-field>
            <z-field>
              <label z-field-label for="p2-feedback-message">Message</label>
              <textarea
                z-textarea
                id="p2-feedback-message"
                placeholder="Tell us what's on your mind..."
                class="min-h-24 resize-none"
              ></textarea>
            </z-field>
          </z-field-group>
          <z-dialog-footer>
            <button type="button" z-button zType="outline" z-dialog-close>Cancel</button>
            <button type="button" z-button (click)="open.set(false)">Submit</button>
          </z-dialog-footer>
        </z-dialog>
      </z-card-footer>
    </z-card>
  `,
})
export class Preview02TypographySpecimenComponent {
  private readonly context = inject(PreviewDesignContext);

  protected readonly open = signal(false);

  protected readonly headingLabel = computed(() => {
    const design = this.context.design();
    const heading = fontById(design.fontHeading);
    return heading?.label && heading.label !== fontById(design.font)?.label ? heading.label : 'Inherit';
  });

  protected readonly bodyLabel = computed(() => fontById(this.context.design().font)?.label ?? 'Default');
}
