---
title: Empty
description: Use the Empty component to display an empty state.
---

# Empty

Use the Empty component to display an empty state.

## Installation

### CLI

```bash
npx zard-cli@latest add empty
```

### Manual

```angular-ts
import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  type TemplateRef,
  ViewEncapsulation,
} from '@angular/core';

import { NgIcon } from '@ng-icons/core';
import type { ClassValue } from 'clsx';

import { ZardStringTemplateOutletDirective } from '@/shared/core/directives/string-template-outlet.directive';
import { mergeClasses } from '@/shared/utils/merge-classes';

import {
  emptyActionsVariants,
  emptyDescriptionVariants,
  emptyHeaderVariants,
  emptyIconVariants,
  emptyImageVariants,
  emptyTitleVariants,
  emptyVariants,
} from './empty.variants';

@Component({
  selector: 'z-empty',
  imports: [NgOptimizedImage, NgIcon, ZardStringTemplateOutletDirective],
  template: `
    @let image = zImage();
    @let icon = zIcon();
    @let title = zTitle();
    @let description = zDescription();
    @let actions = zActions();

    <div data-slot="empty-header" [class]="headerClasses()">
      @if (image) {
        <div data-slot="empty-media" data-variant="default" [class]="imageClasses()">
          <ng-container *zStringTemplateOutlet="image">
            <img [ngSrc]="image" width="64" height="64" alt="Empty" class="mx-auto" />
          </ng-container>
        </div>
      } @else if (icon) {
        <div data-slot="empty-media" data-variant="icon" [class]="iconClasses()" data-testid="icon">
          <ng-icon [name]="icon" class="size-4!" />
        </div>
      }

      @if (title) {
        <div data-slot="empty-title" [class]="titleClasses()">
          <ng-container *zStringTemplateOutlet="title">{{ title }}</ng-container>
        </div>
      }

      @if (description) {
        <div data-slot="empty-description" [class]="descriptionClasses()">
          <ng-container *zStringTemplateOutlet="description">{{ description }}</ng-container>
        </div>
      }
    </div>

    @if (actions.length) {
      <div data-slot="empty-content" [class]="actionsClasses()">
        @for (action of actions; track $index) {
          <ng-container *zStringTemplateOutlet="action" />
        }
      </div>
    }

    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'empty',
    '[class]': 'classes()',
  },
  exportAs: 'zEmpty',
})
export class ZardEmptyComponent {
  readonly zActions = input<TemplateRef<void>[]>([]);
  readonly zIcon = input<string>();
  readonly zImage = input<string | TemplateRef<void>>();
  readonly zTitle = input<string | TemplateRef<void>>();
  readonly zDescription = input<string | TemplateRef<void>>();
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(emptyVariants(), this.class()));
  protected readonly headerClasses = computed(() => emptyHeaderVariants());
  protected readonly imageClasses = computed(() => emptyImageVariants());
  protected readonly iconClasses = computed(() => emptyIconVariants());
  protected readonly titleClasses = computed(() => emptyTitleVariants());
  protected readonly descriptionClasses = computed(() => emptyDescriptionVariants());
  protected readonly actionsClasses = computed(() => emptyActionsVariants());
}
```

```angular-ts
import { cva } from 'class-variance-authority';

export const emptyVariants = cva(
  'flex w-full min-w-0 flex-1 flex-col items-center justify-center gap-4 rounded-xl border-dashed p-6 text-center text-balance',
  {
    variants: {},
  },
);

export const emptyHeaderVariants = cva('flex max-w-sm flex-col items-center gap-2', {
  variants: {},
});

export const emptyImageVariants = cva(
  'mb-2 flex shrink-0 items-center justify-center bg-transparent [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {},
  },
);

export const emptyIconVariants = cva(
  `bg-muted text-foreground mb-2 flex size-8 shrink-0 items-center justify-center rounded-lg [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4`,
  {
    variants: {},
  },
);

export const emptyTitleVariants = cva('text-sm font-medium tracking-tight', {
  variants: {},
});

export const emptyDescriptionVariants = cva(
  'text-muted-foreground [&>a:hover]:text-primary text-sm/relaxed [&>a]:underline [&>a]:underline-offset-4',
  {
    variants: {},
  },
);

export const emptyActionsVariants = cva(
  'flex w-full max-w-sm min-w-0 items-center justify-center gap-2 text-sm text-balance',
  {
    variants: {},
  },
);
```

```angular-ts
export * from './empty.component';
export * from './empty.variants';
```

## Usage

```angular-ts
import { ZardEmptyComponent } from '@/shared/components/empty/empty.component';
```

```angular-html
<z-empty zTitle="No data" zDescription="There is no data to display."></z-empty>
```

## Examples

### Outline

Use the `border` utility class to create an outline empty state.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { provideIcons } from '@ng-icons/core';
import { lucideCloud } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardEmptyComponent } from '@/shared/components/empty';

@Component({
  selector: 'z-demo-empty-outline',
  imports: [ZardButtonComponent, ZardEmptyComponent],
  template: `
    <z-empty
      class="border border-dashed"
      zIcon="lucideCloud"
      zTitle="Cloud Storage Empty"
      zDescription="Upload files to your cloud storage to access them anywhere."
      [zActions]="[actionPrimary]"
    >
      <ng-template #actionPrimary>
        <button type="button" z-button zType="outline" zSize="sm">Upload Files</button>
      </ng-template>
    </z-empty>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideCloud })],
})
export class ZardDemoEmptyOutlineComponent {}
```

### Background

Use the `bg-*` and `bg-gradient-*` utilities to add a background to the empty state.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBell, lucideRefreshCcw } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardEmptyComponent } from '@/shared/components/empty';

@Component({
  selector: 'z-demo-empty-background',
  imports: [ZardButtonComponent, ZardEmptyComponent, NgIcon],
  template: `
    <z-empty
      class="bg-muted/30 **:data-[slot=empty-description]:max-w-xs **:data-[slot=empty-description]:text-pretty"
      zIcon="lucideBell"
      zTitle="No Notifications"
      zDescription="You're all caught up. New notifications will appear here."
      [zActions]="[actionPrimary]"
    >
      <ng-template #actionPrimary>
        <button type="button" z-button zType="outline">
          <ng-icon name="lucideRefreshCcw" />
          Refresh
        </button>
      </ng-template>
    </z-empty>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideBell, lucideRefreshCcw })],
})
export class ZardDemoEmptyBackgroundComponent {}
```

### Avatar

Set `zImage` to a template projecting a `z-avatar` to represent a person in the empty state.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardAvatarComponent } from '@/shared/components/avatar';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardEmptyComponent } from '@/shared/components/empty';

@Component({
  selector: 'z-demo-empty-avatar',
  imports: [ZardAvatarComponent, ZardButtonComponent, ZardEmptyComponent],
  template: `
    <z-empty
      [zImage]="customImage"
      zTitle="User Offline"
      zDescription="This user is currently offline. You can leave a message to notify them or try again later."
      [zActions]="[actionPrimary]"
    />

    <ng-template #customImage>
      <z-avatar
        zSize="lg"
        zSrc="/images/avatar/imgs/avatar_image.jpg"
        zFallback="CN"
        zAlt="User avatar"
        class="grayscale"
      />
    </ng-template>

    <ng-template #actionPrimary>
      <button type="button" z-button>Leave Message</button>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoEmptyAvatarComponent {}
```

### Avatar Group

Set `zImage` to a template projecting a `z-avatar-group` to represent multiple people in the empty state.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';

import { ZardAvatarComponent, ZardAvatarGroupComponent } from '@/shared/components/avatar';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardEmptyComponent } from '@/shared/components/empty';

@Component({
  selector: 'z-demo-empty-avatar-group',
  imports: [ZardAvatarComponent, ZardAvatarGroupComponent, ZardButtonComponent, NgIcon, ZardEmptyComponent],
  template: `
    <z-empty
      [zImage]="customImage"
      zTitle="No Team Members"
      zDescription="Invite your team to collaborate on this project."
      [zActions]="[actionInvite]"
    />

    <ng-template #customImage>
      <z-avatar-group>
        <z-avatar zSize="lg" zSrc="https://github.com/srizzon.png" class="grayscale" />
        <z-avatar zSize="lg" zSrc="https://github.com/Luizgomess.png" class="grayscale" />
        <z-avatar zSize="lg" zSrc="https://github.com/ribeiromatheuss.png" class="grayscale" />
        <z-avatar zSize="lg" zSrc="https://github.com/mikij.png" class="grayscale" />
      </z-avatar-group>
    </ng-template>

    <ng-template #actionInvite>
      <button type="button" z-button zSize="sm">
        <ng-icon name="lucidePlus" />
        Invite Members
      </button>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucidePlus })],
})
export class ZardDemoEmptyAvatarGroupComponent {}
```

### Input Group

Compose a `z-input-group` to add a search field to the empty state.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch } from '@ng-icons/lucide';

import { ZardEmptyComponent } from '@/shared/components/empty';
import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZardInputGroupImports } from '@/shared/components/input-group/input-group.imports';
import { ZardKbdComponent } from '@/shared/components/kbd/kbd.component';

@Component({
  selector: 'z-demo-empty-input-group',
  imports: [ZardEmptyComponent, ZardInputComponent, ZardKbdComponent, NgIcon, ...ZardInputGroupImports],
  template: `
    <z-empty
      class="**:data-[slot=empty-content]:flex-col"
      zTitle="404 - Not Found"
      zDescription="The page you're looking for doesn't exist. Try searching for what you need below."
      [zActions]="[searchInput, supportLink]"
    >
      <ng-template #searchInput>
        <z-input-group class="sm:w-3/4">
          <input z-input placeholder="Try searching for pages..." />
          <z-input-group-addon>
            <ng-icon name="lucideSearch" class="text-muted-foreground" />
          </z-input-group-addon>
          <z-input-group-addon zAlign="inline-end">
            <z-kbd>/</z-kbd>
          </z-input-group-addon>
        </z-input-group>
      </ng-template>

      <ng-template #supportLink>
        <p
          class="text-muted-foreground [&>a:hover]:text-primary text-sm/relaxed [&>a]:underline [&>a]:underline-offset-4"
        >
          Need help?
          <a href="#">Contact support</a>
        </p>
      </ng-template>
    </z-empty>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideSearch })],
})
export class ZardDemoEmptyInputGroupComponent {}
```

### Rtl

To enable RTL support in zard/ui, see the [RTL configuration guide](/docs/rtl).

```angular-ts
// You will notice this example is rendered inside a wrapper that sets the dir and data-lang attributes, and
// reads its text from a translations helper. This is because this site is not RTL by default.
// In your application you won't need either: set dir="rtl" on <html> (or use the CDK Dir directive on a subtree)
// and write the text of your own language. See the RTL guide: https://zardui.com/docs/rtl

import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUpRight, lucideFolderCode } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardEmptyComponent } from '@/shared/components/empty';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

interface EmptyRtlValues {
  title: string;
  description: string;
  createProject: string;
  importProject: string;
  learnMore: string;
}

const translations: ZardRtlTranslations<EmptyRtlValues> = {
  en: {
    dir: 'ltr',
    values: {
      title: 'No Projects Yet',
      description: "You haven't created any projects yet. Get started by creating your first project.",
      createProject: 'Create Project',
      importProject: 'Import Project',
      learnMore: 'Learn More',
    },
  },
  ar: {
    dir: 'rtl',
    values: {
      title: 'لا توجد مشاريع بعد',
      description: 'لم تقم بإنشاء أي مشاريع بعد. ابدأ بإنشاء مشروعك الأول.',
      createProject: 'إنشاء مشروع',
      importProject: 'استيراد مشروع',
      learnMore: 'تعرف على المزيد',
    },
  },
  he: {
    dir: 'rtl',
    values: {
      title: 'אין פרויקטים עדיין',
      description: 'עדיין לא יצרת פרויקטים. התחל על ידי יצירת הפרויקט הראשון שלך.',
      createProject: 'צור פרויקט',
      importProject: 'ייבא פרויקט',
      learnMore: 'למד עוד',
    },
  },
};

@Component({
  selector: 'z-demo-empty-rtl',
  imports: [ZardButtonComponent, ZardEmptyComponent, NgIcon],
  template: `
    <z-empty
      zIcon="lucideFolderCode"
      [zTitle]="i18n.t().title"
      [zDescription]="i18n.t().description"
      [zActions]="[actionPrimary, actionSecondary]"
    >
      <ng-template #actionPrimary>
        <button type="button" z-button>{{ i18n.t().createProject }}</button>
      </ng-template>
      <ng-template #actionSecondary>
        <button type="button" z-button zType="outline">{{ i18n.t().importProject }}</button>
      </ng-template>
    </z-empty>
    <a z-button zType="link" zSize="sm" href="#" class="text-muted-foreground mx-auto flex w-fit">
      {{ i18n.t().learnMore }}
      <ng-icon name="lucideArrowUpRight" data-icon="inline-end" class="rtl:-rotate-90" />
    </a>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideArrowUpRight, lucideFolderCode })],
})
export class ZardDemoEmptyRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);
}
```

## API Reference

### z-empty

Displays a placeholder when no data is available, commonly used in tables, lists, or search results.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zIcon]` | Icon name rendered in the media slot as the `icon` variant (`data-variant="icon"`). Ignored when `zImage` is set. | `ZardIcon` | `-` |
| `[zImage]` | Image URL or custom template (e.g. a `z-avatar`/`z-avatar-group`) rendered in the media slot as the `default` variant (`data-variant="default"`). Takes priority over `zIcon`. | `string \| TemplateRef<void>` | `-` |
| `[zDescription]` | Description text or custom template | `string \| TemplateRef<void>` | `-` |
| `[zTitle]` | Title text or custom template | `string \| TemplateRef<void>` | `-` |
| `[zActions]` | Array of action templates | `TemplateRef<void>[]` | `[]` |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |

---

[Open in browser](https://zardui.com/docs/components/empty)
