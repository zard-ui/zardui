import { isPlatformBrowser, NgTemplateOutlet } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, PLATFORM_ID, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideCopy } from '@ng-icons/lucide';
import { firstValueFrom } from 'rxjs';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardSelectImports } from '@zard/components/select/select.imports';

import { TypesetGeneratorService } from '../../services/typeset-generator.service';

type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';
type CodePanel = 'docs' | 'prompt';

/** The item as the registry publishes it — only the file content is needed here. */
interface RegistryItemResponse {
  files: { name: string; content: string }[];
}

const PACKAGE_MANAGERS: readonly PackageManager[] = ['npm', 'pnpm', 'yarn', 'bun'];

const CLI_COMMAND = 'npx zard-cli@latest add typeset';
const IMPORT_CSS = `@import 'tailwindcss';\n@import './typeset.css';`;

@Component({
  selector: 'z-typeset-code-panel',
  standalone: true,
  imports: [NgIcon, NgTemplateOutlet, RouterLink, ZardButtonComponent, ZardSelectImports],
  providers: [provideIcons({ lucideCheck, lucideCopy })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex h-full min-h-0 flex-col gap-2' },
  templateUrl: './typeset-code-panel.component.html',
})
export class TypesetCodePanelComponent {
  protected readonly service = inject(TypesetGeneratorService);
  private readonly http = inject(HttpClient);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  protected readonly panels: readonly CodePanel[] = ['docs', 'prompt'];
  protected readonly activePanel = signal<CodePanel>('docs');

  protected readonly packageManagers = PACKAGE_MANAGERS;
  protected readonly packageManager = signal<PackageManager>('npm');

  protected readonly cliCommand = CLI_COMMAND;
  protected readonly importCss = IMPORT_CSS;

  /** Which button last reported a successful copy, so only that one says so. */
  protected readonly copied = signal<string | null>(null);

  protected readonly installCommand = computed(() => this.service.exportInstallCommand(this.packageManager()));
  protected readonly fontCss = computed(() => this.service.exportFontCss());
  protected readonly presetCss = computed(() => this.service.exportCss());
  protected readonly usage = computed(() => this.service.exportUsage());
  protected readonly prompt = computed(() => this.service.exportPrompt());

  protected onPackageManager(value: string | string[]): void {
    const manager = Array.isArray(value) ? value[0] : value;
    if (PACKAGE_MANAGERS.includes(manager as PackageManager)) {
      this.packageManager.set(manager as PackageManager);
    }
  }

  protected async copy(key: string, text: string): Promise<void> {
    if (!(await writeToClipboard(text))) return;

    this.copied.set(key);
    setTimeout(() => this.copied.update(current => (current === key ? null : current)), 2000);
  }

  /**
   * Copies the stylesheet itself, straight from the published registry item.
   *
   * The file is a build artifact under `public/r/`, so there is one copy of it
   * and no chance of the page handing out a stale transcription.
   */
  protected async copyStylesheet(): Promise<void> {
    if (!this.isBrowser) return;

    try {
      const item = await firstValueFrom(this.http.get<RegistryItemResponse>('/r/typeset.json'));
      const css = item.files.find(file => file.name === 'typeset.css')?.content;
      if (css) await this.copy('stylesheet', css);
    } catch {
      // With no network, the link to the file is still next to the button.
    }
  }
}

async function writeToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
