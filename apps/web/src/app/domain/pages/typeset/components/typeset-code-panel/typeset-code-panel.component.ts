import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, PLATFORM_ID, signal } from '@angular/core';

import { firstValueFrom } from 'rxjs';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardTabComponent, ZardTabGroupComponent } from '@zard/components/tabs/tabs.component';

import { TypesetGeneratorService } from '../../services/typeset-generator.service';

type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';

/** The item as the registry publishes it — only the file content is needed here. */
interface RegistryItemResponse {
  files: { name: string; content: string }[];
}

const PACKAGE_MANAGERS: readonly PackageManager[] = ['npm', 'pnpm', 'yarn', 'bun'];

@Component({
  selector: 'app-typeset-code-panel',
  standalone: true,
  imports: [ZardButtonComponent, ZardTabComponent, ZardTabGroupComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './typeset-code-panel.component.html',
})
export class TypesetCodePanelComponent {
  protected readonly service = inject(TypesetGeneratorService);
  private readonly http = inject(HttpClient);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  protected readonly packageManagers = PACKAGE_MANAGERS;
  protected readonly packageManager = signal<PackageManager>('npm');

  /** Which button last reported a successful copy, so only that one says so. */
  protected readonly copied = signal<string | null>(null);

  protected readonly installCommand = computed(() => this.service.exportInstallCommand(this.packageManager()));
  protected readonly fontCss = computed(() => this.service.exportFontCss());
  protected readonly presetCss = computed(() => this.service.exportCss());
  protected readonly usage = computed(() => this.service.exportUsage());
  protected readonly prompt = computed(() => this.service.exportPrompt());

  protected setPackageManager(manager: PackageManager): void {
    this.packageManager.set(manager);
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
      // Sem rede, o link para o arquivo continua ao lado do botão.
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
