import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucidePlus } from '@ng-icons/lucide';

import { ZardAvatarImports, type ZardAvatarSizeVariants } from '@zard/components/avatar';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardEmptyComponent } from '@zard/components/empty/empty.component';

import { ExampleImports } from './example.component';

const SIZES: readonly ZardAvatarSizeVariants[] = ['sm', 'default', 'lg'];

const GROUP: readonly { src: string; alt: string; fallback: string }[] = [
  { src: 'https://github.com/shadcn.png', alt: '@shadcn', fallback: 'CN' },
  { src: 'https://github.com/maxleiter.png', alt: '@maxleiter', fallback: 'LR' },
  { src: 'https://github.com/evilrabbit.png', alt: '@evilrabbit', fallback: 'ER' },
];

/*
 * `z-avatar-group-count` only renders "+N", so the icon counts are a plain element carrying its classes. `[&_img]` is
 * how shadcn's `AvatarImage className` reaches the image zard draws inside `z-avatar`.
 */
const ICON_COUNT_CLASS: Record<ZardAvatarSizeVariants, string> = {
  sm: 'cn-avatar-group-count cn-avatar-group-count-size-sm select-none',
  default: 'cn-avatar-group-count cn-avatar-group-count-size-default select-none',
  lg: 'cn-avatar-group-count cn-avatar-group-count-size-lg select-none',
};

/** shadcn/ui's `avatar-example`, in zard. */
@Component({
  selector: 'z-avatar-example',
  imports: [ExampleImports, NgIcon, ZardAvatarImports, ZardButtonComponent, ZardEmptyComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideCheck, lucidePlus })],
  template: `
    <z-example-wrapper>
      <z-example zTitle="Sizes">
        <div class="flex flex-wrap items-center gap-2">
          @for (size of sizes; track size) {
            <z-avatar [zSize]="size" zSrc="https://github.com/shadcn.png" zAlt="@shadcn" zFallback="CN" />
          }
        </div>
        <div class="flex flex-wrap items-center gap-2">
          @for (size of sizes; track size) {
            <z-avatar [zSize]="size" zFallback="CN" />
          }
        </div>
      </z-example>

      <z-example zTitle="Badge">
        <div class="flex flex-wrap items-center gap-2">
          @for (size of sizes; track size) {
            <z-avatar
              [zSize]="size"
              zSrc="https://github.com/jorgezreik.png"
              zAlt="@jorgezreik"
              zFallback="JZ"
              zShowBadge
            />
          }
        </div>
        <div class="flex flex-wrap items-center gap-2">
          @for (size of sizes; track size) {
            <z-avatar [zSize]="size" zFallback="JZ" zShowBadge />
          }
        </div>
      </z-example>

      <z-example zTitle="Badge with Icon">
        <div class="flex flex-wrap items-center gap-2">
          @for (size of sizes; track size) {
            <z-avatar
              [zSize]="size"
              zSrc="https://github.com/pranathip.png"
              zAlt="@pranathip"
              zFallback="PP"
              zShowBadge
              zBadgeIcon="lucidePlus"
            />
          }
        </div>
        <div class="flex flex-wrap items-center gap-2">
          @for (size of sizes; track size) {
            <z-avatar [zSize]="size" zFallback="PP" zShowBadge zBadgeIcon="lucideCheck" />
          }
        </div>
      </z-example>

      <z-example zTitle="Group">
        @for (size of sizes; track size) {
          <z-avatar-group>
            @for (member of group; track member.src) {
              <z-avatar [zSize]="size" [zSrc]="member.src" [zAlt]="member.alt" [zFallback]="member.fallback" />
            }
          </z-avatar-group>
        }
      </z-example>

      <z-example zTitle="Group with Count">
        @for (size of sizes; track size) {
          <z-avatar-group>
            @for (member of group; track member.src) {
              <z-avatar [zSize]="size" [zSrc]="member.src" [zAlt]="member.alt" [zFallback]="member.fallback" />
            }
            <z-avatar-group-count [zSize]="size" [zCount]="3" />
          </z-avatar-group>
        }
      </z-example>

      <z-example zTitle="Group with Icon Count">
        @for (size of sizes; track size) {
          <z-avatar-group>
            @for (member of group; track member.src) {
              <z-avatar
                [zSize]="size"
                [zSrc]="member.src"
                [zAlt]="member.alt"
                [zFallback]="member.fallback"
                [class]="size === 'lg' ? '[&_img]:grayscale' : ''"
              />
            }
            <div data-slot="avatar" [attr.data-size]="size" [class]="iconCountClass[size]">
              <ng-icon name="lucidePlus" />
            </div>
          </z-avatar-group>
        }
      </z-example>

      <z-example zTitle="In Empty">
        <ng-template #teamMedia>
          <z-avatar-group>
            @for (member of group; track member.src) {
              <z-avatar
                zSize="lg"
                [zSrc]="member.src"
                [zAlt]="member.alt"
                [zFallback]="member.fallback"
                class="[&_img]:grayscale"
              />
            }
            <div data-slot="avatar" data-size="lg" [class]="iconCountClass.lg">
              <ng-icon name="lucidePlus" />
            </div>
          </z-avatar-group>
        </ng-template>
        <ng-template #inviteAction>
          <button type="button" z-button>
            <ng-icon name="lucidePlus" />
            Invite Members
          </button>
        </ng-template>
        <z-empty
          class="w-full flex-none border"
          [zImage]="teamMedia"
          zTitle="No Team Members"
          zDescription="Invite your team to collaborate on this project."
          [zActions]="[inviteAction]"
        />
      </z-example>
    </z-example-wrapper>
  `,
})
export class AvatarExampleComponent {
  protected readonly sizes = SIZES;
  protected readonly group = GROUP;
  protected readonly iconCountClass = ICON_COUNT_CLASS;
}
