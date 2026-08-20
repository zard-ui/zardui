import { ChangeDetectionStrategy, Component, computed, input, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';

import { IconName, NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCheck,
  lucideFullscreen,
  lucideMonitor,
  lucideRotateCw,
  lucideSmartphone,
  lucideTablet,
  lucideTerminal,
} from '@ng-icons/lucide';

import { ZardSeparatorComponent } from '@zard/components/separator/separator.component';
import { tabButtonVariants, tabNavVariants } from '@zard/components/tabs/tabs.variants';
import { ZardToggleGroupComponent } from '@zard/components/toggle-group/toggle-group.component';

import { BlockCodeViewerComponent } from '../block-code-viewer/block-code-viewer.component';
import { BlockPreviewComponent } from '../block-preview/block-preview.component';

export interface BlockFile {
  name: string;
  path: string;
  content: string;
  language: string;
}

export interface Block {
  id: string;
  title: string;
  description: string;
  component: any;
  files: BlockFile[];
  category?: string;
  image?: {
    light: string;
    dark: string;
  };
}

export interface ViewportOption {
  value: string;
  ariaLabel: string;
  icon: IconName;
}

/** How much of the preview area the iframe takes, as a percentage. Same values shadcn toggles between. */
export type BlockViewportSize = '100' | '60' | '30';

@Component({
  selector: 'z-block-container',
  imports: [
    NgIcon,
    RouterLink,
    ZardSeparatorComponent,
    ZardToggleGroupComponent,
    BlockPreviewComponent,
    BlockCodeViewerComponent,
  ],
  templateUrl: './block-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({
      lucideCheck,
      lucideFullscreen,
      lucideMonitor,
      lucideRotateCw,
      lucideSmartphone,
      lucideTablet,
      lucideTerminal,
    }),
  ],
})
export class BlockContainerComponent {
  readonly block = input.required<Block>();

  private readonly preview = viewChild(BlockPreviewComponent);

  protected readonly activeTab = signal<'preview' | 'code'>('preview');
  protected readonly viewportSize = signal<BlockViewportSize>('100');
  protected readonly copied = signal(false);
  private copiedTimeout?: ReturnType<typeof setTimeout>;

  protected readonly tabOptions = [
    { label: 'Preview', value: 'preview' as const },
    { label: 'Code', value: 'code' as const },
  ];

  protected readonly viewportOptions: ViewportOption[] = [
    { value: '100', ariaLabel: 'Desktop view', icon: 'lucideMonitor' },
    { value: '60', ariaLabel: 'Tablet view', icon: 'lucideTablet' },
    { value: '30', ariaLabel: 'Mobile view', icon: 'lucideSmartphone' },
  ];

  protected readonly navClasses = tabNavVariants({ zVariant: 'default' });
  protected readonly buttonClasses = tabButtonVariants();

  /** shadcn labels a block with its description; the trailing period is dropped as it is there. */
  protected readonly heading = computed(() => this.block().description.replace(/\.$/, ''));
  protected readonly previewUrl = computed(() => `/blocks/preview/${this.block().id}`);
  protected readonly command = computed(() => `npx zard-cli add ${this.block().id}`);

  protected selectTab(value: 'preview' | 'code'): void {
    this.activeTab.set(value);
  }

  protected onViewportChange(value: string | string[]): void {
    if (typeof value === 'string' && value) {
      this.viewportSize.set(value as BlockViewportSize);
    }
  }

  protected refreshPreview(): void {
    this.preview()?.reload();
  }

  protected copyCommand(): void {
    navigator.clipboard
      .writeText(this.command())
      .then(() => {
        this.copied.set(true);
        clearTimeout(this.copiedTimeout);
        this.copiedTimeout = setTimeout(() => this.copied.set(false), 2000);
      })
      .catch(() => undefined);
  }
}
