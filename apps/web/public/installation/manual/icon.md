

```angular-ts title="icon.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import type { ClassValue } from 'clsx';

import { iconVariants, type ZardIconVariants } from './icon.variants';
import { mergeClasses } from '../../shared/utils/utils';
import { ZARD_ICONS, type ZardIcon } from './icons';

@Component({
  selector: 'z-icon, [z-icon]',
  standalone: true,
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: ` <lucide-angular [img]="icon()" [strokeWidth]="zStrokeWidth()" [absoluteStrokeWidth]="zAbsoluteStrokeWidth()" [class]="classes()" /> `,
  host: {},
})
export class ZardIconComponent {
  readonly zType = input.required<ZardIcon>();
  readonly zSize = input<ZardIconVariants['zSize']>('default');
  readonly zStrokeWidth = input<number>(2);
  readonly zAbsoluteStrokeWidth = input<boolean>(false);
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(iconVariants({ zSize: this.zSize() }), this.class()));

  protected readonly icon = computed(() => {
    const type = this.zType();
    if (typeof type === 'string') {
      return ZARD_ICONS[type as keyof typeof ZARD_ICONS];
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

export type ZardIconVariants = VariantProps<typeof iconVariants>;

```



```angular-ts title="icons.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import {
  ArrowRight,
  ArrowUp,
  BadgeCheck,
  Ban,
  Bell,
  Bold,
  BookOpen,
  BookOpenText,
  Calendar,
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
  CircleX,
  Clipboard,
  Code,
  CodeXml,
  Copy,
  Ellipsis,
  Eye,
  File,
  FileText,
  Folder,
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
  LoaderCircle,
  LogOut,
  type LucideIconData,
  Mail,
  Monitor,
  Moon,
  MoveRight,
  Palette,
  PanelLeft,
  Popcorn,
  Puzzle,
  Save,
  Search,
  Settings,
  Shield,
  Smartphone,
  Sparkles,
  SquareLibrary,
  Star,
  Sun,
  Tablet,
  Terminal,
  TextAlignCenter,
  TextAlignEnd,
  TextAlignStart,
  TriangleAlert,
  Underline,
  User,
  Users,
  X,
  Zap,
} from 'lucide-angular';

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
  ban: Ban,
  'chevron-down': ChevronDown,
  'chevron-up': ChevronUp,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'chevrons-up-down': ChevronsUpDown,
  'move-right': MoveRight,
  'arrow-right': ArrowRight,
  'arrow-up': ArrowUp,
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
} as const satisfies Record<string, LucideIconData>;

export declare type ZardIcon = keyof typeof ZARD_ICONS | LucideIconData;

```

