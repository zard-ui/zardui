import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * Changelog prose with `backticks` rendered as inline code, so a command reads as code instead of raw markdown.
 * Inline on purpose: it sits inside the paragraph that holds it.
 */
@Component({
  selector: 'z-changelog-text',
  // Each segment is set through textContent: a bare interpolation would pick up the template's line breaks as spaces.
  template: `
    @for (segment of segments(); track $index) {
      @if (segment.code) {
        <code [textContent]="segment.text"></code>
      } @else {
        <span [textContent]="segment.text"></span>
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangelogTextComponent {
  readonly text = input.required<string>();

  protected readonly segments = computed(() =>
    this.text()
      .split('`')
      .map((part, index) => ({ text: part, code: index % 2 === 1 })),
  );
}
