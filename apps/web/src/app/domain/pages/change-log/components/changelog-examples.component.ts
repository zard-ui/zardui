import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeTabsComponent } from '@highlight/components/code-tabs/code-tabs.component';

import { ZardCodeBoxComponent } from '@doc/widget/components/zard-code-box/zard-code-box.component';

import { type ChangelogExample } from '../entries/changelog-entry.interface';

/**
 * Renders the components an entry shipped: a heading linking to the component's page, a live demo and the
 * install command. Deliberately a separate component — it holds everything heavy on the page, so the changelog
 * defers it per entry instead of mounting all of them at once.
 *
 * Sits inside the entry's typeset: the headings and paragraphs follow it, the demo and the command opt out.
 */
@Component({
  selector: 'z-changelog-examples',
  imports: [CodeTabsComponent, RouterLink, ZardCodeBoxComponent],
  host: { class: 'contents' },
  template: `
    @if (headingLevel() === 2) {
      <h2 [id]="anchorPrefix() + 'components'">{{ title() }}</h2>
    } @else {
      <h3 [id]="anchorPrefix() + 'components'">{{ title() }}</h3>
    }

    @for (example of examples(); track example.componentName) {
      @if (headingLevel() === 2) {
        <h3 [id]="anchorPrefix() + example.componentName">
          <a
            class="no-underline underline-offset-4 hover:underline"
            [routerLink]="'/docs/components/' + example.componentName"
          >
            {{ nameOf(example) }}
          </a>
        </h3>
      } @else {
        <h4 [id]="anchorPrefix() + example.componentName">
          <a
            class="no-underline underline-offset-4 hover:underline"
            [routerLink]="'/docs/components/' + example.componentName"
          >
            {{ nameOf(example) }}
          </a>
        </h4>
      }
      @if (example.description) {
        <p>{{ example.description }}</p>
      }
      <!-- The command first: the demo carries a bottom margin of its own, which spaces it from the next component. -->
      <div data-not-typeset class="mt-4 flex flex-col gap-4">
        @if (example.cliAdd) {
          <z-code-tabs [data]="example.cliAdd" />
        }
        <z-code-box
          [codeData]="example.codeData"
          [dynamicComponent]="example.component"
          [fillContainer]="example.fillContainer"
          [type]="example.type"
        />
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangelogExamplesComponent {
  readonly examples = input.required<ChangelogExample[]>();
  readonly title = input('New Components');
  /** 2 on an entry's own page, 3 inside an article of the index. */
  readonly headingLevel = input<2 | 3>(3);
  /** Keeps ids unique on the index, where several entries share the page. */
  readonly anchorPrefix = input('');

  /** 'native-select' reads 'Native Select', 'input-otp' reads 'Input OTP'. */
  nameOf(example: ChangelogExample): string {
    return example.componentName
      .split('-')
      .map(word => (word === 'otp' ? 'OTP' : word.charAt(0).toUpperCase() + word.slice(1)))
      .join(' ');
  }
}
