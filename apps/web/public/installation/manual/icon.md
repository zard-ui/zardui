

```angular-ts title="icon.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DOCUMENT,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { NgIcon } from '@ng-icons/core';
import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { iconVariants, type ZardIconSizeVariants } from './icon.variants';
import { ZARD_ICONS, type ZardIcon } from './icons';

@Component({
  selector: 'z-icon, [z-icon]',
  imports: [NgIcon],
  template: `
    <ng-icon [svg]="icon()" [size]="size()" [strokeWidth]="zStrokeWidth()" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
  },
})
export class ZardIconComponent {
  private readonly document = inject(DOCUMENT);

  readonly zType = input.required<ZardIcon>();
  readonly zSize = input<ZardIconSizeVariants>('default');
  readonly zStrokeWidth = input<number>(2);
  readonly zAbsoluteStrokeWidth = input<boolean>(false);
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() =>
    mergeClasses(iconVariants({ zSize: this.zSize() }), this.class(), this.zStrokeWidth() === 0 ? 'stroke-none' : ''),
  );

  protected readonly icon = computed(() => ZARD_ICONS[this.zType()]);

  protected readonly size = computed(() => this.extractSizeFromClass());

  private extractSizeFromClass() {
    const classes = this.classes().split(' ');

    for (const cls of classes) {
      if (cls.startsWith('size-')) {
        return this.tailwindSizeToPx(cls.split('-')[1]);
      }
    }

    return '14';
  }

  private tailwindSizeToPx(size: string | number): string {
    const sizeNum = typeof size === 'number' ? size : parseFloat(size);
    const unit = this.getBaseFontSize() / 4;
    const px = sizeNum * unit;

    return `${px}`;
  }

  private getBaseFontSize(): number {
    if (!this.document.defaultView) {
      return 16;
    }
    const rootSize = this.document.defaultView.getComputedStyle(this.document.documentElement).fontSize;
    return parseFloat(rootSize) || 16;
  }
}

```



```angular-ts title="icon.variants.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { cva, type VariantProps } from 'class-variance-authority';

export const iconVariants = cva('flex items-center justify-center', {
  variants: {
    zSize: {
      sm: 'size-3',
      default: 'size-3.5',
      lg: 'size-4',
      xl: 'size-5',
    },
  },
  defaultVariants: {
    zSize: 'default',
  },
});

export type ZardIconSizeVariants = NonNullable<VariantProps<typeof iconVariants>['zSize']>;

```



```angular-ts title="icons.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import {
  lucideActivity,
  lucideArchive,
  lucideArrowLeft,
  lucideArrowRight,
  lucideArrowUp,
  lucideArrowUpRight,
  lucideBadgeCheck,
  lucideBan,
  lucideBell,
  lucideBold,
  lucideBookOpen,
  lucideBookOpenText,
  lucideCalendar,
  lucideCalendarPlus,
  lucideCheck,
  lucideChevronDown,
  lucideChevronLeft,
  lucideChevronRight,
  lucideChevronsUpDown,
  lucideChevronUp,
  lucideCircle,
  lucideCircleAlert,
  lucideCircleCheck,
  lucideCircleDollarSign,
  lucideCircleSmall,
  lucideCircleX,
  lucideClipboard,
  lucideClock,
  lucideCode,
  lucideCodeXml,
  lucideCopy,
  lucideCreditCard,
  lucideDollarSign,
  lucideEllipsis,
  lucideExternalLink,
  lucideEye,
  lucideFile,
  lucideFileText,
  lucideFolder,
  lucideFolderCode,
  lucideFolderOpen,
  lucideFolderPlus,
  lucideGalleryHorizontal,
  lucideGithub,
  lucideHeart,
  lucideHouse,
  lucideInbox,
  lucideInfo,
  lucideItalic,
  lucideLayers,
  lucideLayers2,
  lucideLayoutDashboard,
  lucideLightbulb,
  lucideLightbulbOff,
  lucideListFilterPlus,
  lucideLoaderCircle,
  lucideLogOut,
  lucideMail,
  lucideMinus,
  lucideMonitor,
  lucideMoon,
  lucideMoveRight,
  lucidePalette,
  lucidePanelLeft,
  lucidePlus,
  lucidePopcorn,
  lucidePuzzle,
  lucideSave,
  lucideSearch,
  lucideSettings,
  lucideShield,
  lucideSmartphone,
  lucideSparkles,
  lucideSquare,
  lucideSquareLibrary,
  lucideStar,
  lucideSun,
  lucideSunMoon,
  lucideTablet,
  lucideTag,
  lucideTerminal,
  lucideTextAlignCenter,
  lucideTextAlignEnd,
  lucideTextAlignStart,
  lucideTrash2,
  lucideTriangleAlert,
  lucideUnderline,
  lucideUser,
  lucideUserPlus,
  lucideUsers,
  lucideX,
  lucideZap,
} from '@ng-icons/lucide';

const DarkMode = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"/>
  <path d="M12 3l0 18"/>
  <path d="M12 9l4.65 -4.65"/>
  <path d="M12 14.3l7.37 -7.37"/>
  <path d="M12 19.6l8.85 -8.85"/>
</svg>
`;

export const ZARD_ICONS = {
  house: lucideHouse,
  settings: lucideSettings,
  user: lucideUser,
  search: lucideSearch,
  bell: lucideBell,
  mail: lucideMail,
  calendar: lucideCalendar,
  'log-out': lucideLogOut,
  'panel-left': lucidePanelLeft,
  bold: lucideBold,
  inbox: lucideInbox,
  italic: lucideItalic,
  underline: lucideUnderline,
  'text-align-center': lucideTextAlignCenter,
  'text-align-end': lucideTextAlignEnd,
  'text-align-start': lucideTextAlignStart,
  check: lucideCheck,
  x: lucideX,
  info: lucideInfo,
  'triangle-alert': lucideTriangleAlert,
  circle: lucideCircle,
  'circle-alert': lucideCircleAlert,
  'circle-check': lucideCircleCheck,
  'circle-x': lucideCircleX,
  'circle-dollar-sign': lucideCircleDollarSign,
  'circle-small': lucideCircleSmall,
  ban: lucideBan,
  'chevron-down': lucideChevronDown,
  'chevron-up': lucideChevronUp,
  'chevron-left': lucideChevronLeft,
  'chevron-right': lucideChevronRight,
  'chevrons-up-down': lucideChevronsUpDown,
  'move-right': lucideMoveRight,
  'arrow-right': lucideArrowRight,
  'arrow-up': lucideArrowUp,
  'arrow-up-right': lucideArrowUpRight,
  folder: lucideFolder,
  'folder-open': lucideFolderOpen,
  'folder-plus': lucideFolderPlus,
  file: lucideFile,
  'file-text': lucideFileText,
  'layout-dashboard': lucideLayoutDashboard,
  'loader-circle': lucideLoaderCircle,
  save: lucideSave,
  copy: lucideCopy,
  eye: lucideEye,
  ellipsis: lucideEllipsis,
  terminal: lucideTerminal,
  clipboard: lucideClipboard,
  moon: lucideMoon,
  sun: lucideSun,
  lightbulb: lucideLightbulb,
  'lightbulb-off': lucideLightbulbOff,
  palette: lucidePalette,
  sparkles: lucideSparkles,
  heart: lucideHeart,
  star: lucideStar,
  zap: lucideZap,
  popcorn: lucidePopcorn,
  shield: lucideShield,
  puzzle: lucidePuzzle,
  layers: lucideLayers,
  'layers-2': lucideLayers2,
  'square-library': lucideSquareLibrary,
  code: lucideCode,
  'code-xml': lucideCodeXml,
  'book-open': lucideBookOpen,
  'book-open-text': lucideBookOpenText,
  users: lucideUsers,
  monitor: lucideMonitor,
  smartphone: lucideSmartphone,
  tablet: lucideTablet,
  'badge-check': lucideBadgeCheck,
  'folder-code': lucideFolderCode,
  'gallery-horizontal': lucideGalleryHorizontal,
  plus: lucidePlus,
  minus: lucideMinus,
  'arrow-left': lucideArrowLeft,
  archive: lucideArchive,
  clock: lucideClock,
  'calendar-plus': lucideCalendarPlus,
  'list-filter-plus': lucideListFilterPlus,
  trash: lucideTrash2,
  tag: lucideTag,
  'sun-moon': lucideSunMoon,
  'dark-mode': DarkMode,
  square: lucideSquare,
  'dollar-sign': lucideDollarSign,
  'user-plus': lucideUserPlus,
  'credit-card': lucideCreditCard,
  activity: lucideActivity,
  github: lucideGithub,
  'external-link': lucideExternalLink,
} as const;

export declare type ZardIcon = keyof typeof ZARD_ICONS;

```



```angular-ts title="index.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
export * from './icon.component';
export * from './icons';
export * from './icon.variants';

```

