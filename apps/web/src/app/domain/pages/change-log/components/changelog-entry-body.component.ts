import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { ChangelogExamplesComponent } from './changelog-examples.component';
import { ChangelogReleaseComponent } from './changelog-release.component';
import { ChangelogTextComponent } from './changelog-text.component';
import { type ChangelogEntry } from '../entries/changelog-entry.interface';
import { ChangelogService } from '../services/changelog.service';

/** 'Start a project with create' becomes 'start-a-project-with-create'. */
export function anchorOf(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * The prose of one changelog entry, laid out as shadcn/ui lays out its own: typeset paragraphs, a heading per
 * highlight with its command under it, then the components the entry shipped.
 *
 * The same body serves the index, where it sits under the entry's `<h2>` (so its sections are `<h3>`), and the
 * entry's page, where it sits under the `<h1>` and the overview is already the page description.
 */
@Component({
  selector: 'z-changelog-entry-body',
  imports: [ChangelogExamplesComponent, ChangelogReleaseComponent, ChangelogTextComponent],
  template: `
    <div class="typeset typeset-docs">
      @if (showOverview()) {
        <p><z-changelog-text [text]="entry().overview" /></p>
      }

      @if (entry().release; as release) {
        <z-changelog-release [release]="release" [headingLevel]="headingLevel()" />
      }

      @for (highlight of entry().highlights ?? []; track highlight.title) {
        @if (headingLevel() === 2) {
          <h2 [id]="anchorPrefix() + anchorOf(highlight.title)">{{ highlight.title }}</h2>
        } @else {
          <h3 [id]="anchorPrefix() + anchorOf(highlight.title)">{{ highlight.title }}</h3>
        }
        <p><z-changelog-text [text]="highlight.description" /></p>
        @if (highlight.renames?.length) {
          <ul>
            @for (rename of highlight.renames; track rename.from) {
              <li>
                <code class="line-through">{{ rename.from }}</code>
                <span aria-hidden="true" [textContent]="' → '"></span>
                <code>{{ rename.to.join(', ') }}</code>
              </li>
            }
          </ul>
        }
        @if (highlight.code) {
          <pre><code>{{ highlight.code }}</code></pre>
        }
      }

      <!--
        Rendered in full on the server; in the browser the entry's payload is imported once the entry approaches
        the viewport and only then does the block hydrate, so the server HTML it replaces always matches.
      -->
      @if (entry().loadExamples) {
        @defer (when examples(); hydrate when examples()) {
          <z-changelog-examples
            [examples]="examples() ?? []"
            [title]="entry().examplesTitle ?? 'New Components'"
            [headingLevel]="headingLevel()"
            [anchorPrefix]="anchorPrefix()"
          />
        }
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangelogEntryBodyComponent {
  private readonly changelogService = inject(ChangelogService);

  readonly entry = input.required<ChangelogEntry>();
  /** 2 on the entry's own page, 3 inside an article of the index. */
  readonly headingLevel = input<2 | 3>(3);
  readonly showOverview = input(true);
  /** Keeps heading ids unique on the index, where several entries share the page. */
  readonly anchorPrefix = input('');

  protected readonly examples = computed(() => this.changelogService.examplesOf(this.entry().meta.id));
  protected readonly anchorOf = anchorOf;
}
