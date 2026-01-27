

```angular-ts title="icon.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';
import { LucideAngularModule } from 'lucide-angular';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { iconVariants, type ZardIconSizeVariants } from './icon.variants';
import { ZARD_ICONS, type ZardIcon } from './icons';

@Component({
  selector: 'z-icon, [z-icon]',
  imports: [LucideAngularModule],
  template: `
    <lucide-angular
      [img]="icon()"
      [strokeWidth]="zStrokeWidth()"
      [absoluteStrokeWidth]="zAbsoluteStrokeWidth()"
      [class]="classes()"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ZardIconComponent {
  readonly zType = input.required<ZardIcon>();
  readonly zSize = input<ZardIconSizeVariants>('default');
  readonly zStrokeWidth = input<number>(2);
  readonly zAbsoluteStrokeWidth = input<boolean>(false);
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() =>
    mergeClasses(iconVariants({ zSize: this.zSize() }), this.class(), this.zStrokeWidth() === 0 ? 'stroke-none' : ''),
  );

  protected readonly icon = computed(() => {
    const type = this.zType();
    if (typeof type === 'string') {
      return ZARD_ICONS[type];
    }

    return type;
  });
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
  Activity,
  Archive,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  BadgeCheck,
  Ban,
  Bell,
  Bold,
  BookOpen,
  BookOpenText,
  Calendar,
  CalendarPlus,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  ChevronUp,
  Circle,
  CircleAlert,
  CircleCheck,
  CircleDollarSign,
  CircleSmall,
  CircleX,
  Clipboard,
  Clock,
  Code,
  CodeXml,
  Copy,
  CreditCard,
  DollarSign,
  Ellipsis,
  Eye,
  File,
  FileText,
  Folder,
  FolderCode,
  FolderOpen,
  FolderPlus,
  Heart,
  House,
  Inbox,
  Info,
  Italic,
  Layers,
  Layers2,
  LayoutDashboard,
  Lightbulb,
  LightbulbOff,
  ListFilterPlus,
  LoaderCircle,
  LogOut,
  type LucideIconData,
  Mail,
  Minus,
  Monitor,
  Moon,
  MoveRight,
  Palette,
  PanelLeft,
  Plus,
  Popcorn,
  Puzzle,
  Save,
  Search,
  Settings,
  Shield,
  Smartphone,
  Sparkles,
  Square,
  SquareLibrary,
  Star,
  Sun,
  SunMoon,
  Tablet,
  Tag,
  Terminal,
  TextAlignCenter,
  TextAlignEnd,
  TextAlignStart,
  Trash2,
  TriangleAlert,
  Underline,
  User,
  UserPlus,
  Users,
  X,
  Zap,
} from 'lucide-angular';

const DarkMode: LucideIconData = [
  ['path', { d: 'M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0' }],
  ['path', { d: 'M12 3l0 18' }],
  ['path', { d: 'M12 9l4.65 -4.65' }],
  ['path', { d: 'M12 14.3l7.37 -7.37' }],
  ['path', { d: 'M12 19.6l8.85 -8.85' }],
];

export const ZARD_ICONS = {
  house: House,
  settings: Settings,
  user: User,
  search: Search,
  bell: Bell,
  mail: Mail,
  calendar: Calendar,
  'log-out': LogOut,
  'panel-left': PanelLeft,
  bold: Bold,
  inbox: Inbox,
  italic: Italic,
  underline: Underline,
  'text-align-center': TextAlignCenter,
  'text-align-end': TextAlignEnd,
  'text-align-start': TextAlignStart,
  check: Check,
  x: X,
  info: Info,
  'triangle-alert': TriangleAlert,
  circle: Circle,
  'circle-alert': CircleAlert,
  'circle-check': CircleCheck,
  'circle-x': CircleX,
  'circle-dollar-sign': CircleDollarSign,
  'circle-small': CircleSmall,
  ban: Ban,
  'chevron-down': ChevronDown,
  'chevron-up': ChevronUp,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'chevrons-up-down': ChevronsUpDown,
  'move-right': MoveRight,
  'arrow-right': ArrowRight,
  'arrow-up': ArrowUp,
  'arrow-up-right': ArrowUpRight,
  folder: Folder,
  'folder-open': FolderOpen,
  'folder-plus': FolderPlus,
  file: File,
  'file-text': FileText,
  'layout-dashboard': LayoutDashboard,
  'loader-circle': LoaderCircle,
  save: Save,
  copy: Copy,
  eye: Eye,
  ellipsis: Ellipsis,
  terminal: Terminal,
  clipboard: Clipboard,
  moon: Moon,
  sun: Sun,
  lightbulb: Lightbulb,
  'lightbulb-off': LightbulbOff,
  palette: Palette,
  sparkles: Sparkles,
  heart: Heart,
  star: Star,
  zap: Zap,
  popcorn: Popcorn,
  shield: Shield,
  puzzle: Puzzle,
  layers: Layers,
  'layers-2': Layers2,
  'square-library': SquareLibrary,
  code: Code,
  'code-xml': CodeXml,
  'book-open': BookOpen,
  'book-open-text': BookOpenText,
  users: Users,
  monitor: Monitor,
  smartphone: Smartphone,
  tablet: Tablet,
  'badge-check': BadgeCheck,
  'folder-code': FolderCode,
  plus: Plus,
  minus: Minus,
  'arrow-left': ArrowLeft,
  archive: Archive,
  clock: Clock,
  'calendar-plus': CalendarPlus,
  'list-filter-plus': ListFilterPlus,
  trash: Trash2,
  tag: Tag,
  'sun-moon': SunMoon,
  'dark-mode': DarkMode,
  square: Square,
  'dollar-sign': DollarSign,
  'user-plus': UserPlus,
  'credit-card': CreditCard,
  activity: Activity,
} as const satisfies Record<string, LucideIconData>;

export declare type ZardIcon = keyof typeof ZARD_ICONS | LucideIconData;

```



```angular-ts title="index.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
export * from './icon.component';
export * from './icons';
export * from './icon.variants';

```

