import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowUp,
  lucideAtSign,
  lucideBookOpen,
  lucideCheck,
  lucideChevronRight,
  lucideCircleDashed,
  lucideGlobe,
  lucideLayers,
  lucidePaperclip,
  lucidePlus,
  lucideX,
} from '@ng-icons/lucide';

import { ZardAvatarComponent } from '@zard/components/avatar/avatar.component';
import { ZardBadgeComponent } from '@zard/components/badge/badge.component';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCommandImports, type ZardCommandOption } from '@zard/components/command';
import { ZardDropdownImports } from '@zard/components/dropdown';
import { ZardInputDirective } from '@zard/components/input/input.directive';
import { ZardInputGroupComponent } from '@zard/components/input-group/input-group.component';
import { ZardMenuImports } from '@zard/components/menu';
import { ZardPopoverComponent, ZardPopoverDirective } from '@zard/components/popover';
import { ZardSwitchComponent } from '@zard/components/switch/switch.component';
import { ZardTooltipDirective } from '@zard/components/tooltip';
import { ZardIdDirective } from '@zard/core';

interface MentionableItem {
  type: 'page' | 'user';
  title: string;
  image: string;
  workspace?: string;
}

interface ModelItem {
  name: string;
  badge?: string;
}

const SAMPLE_DATA = {
  mentionable: [
    { type: 'page' as const, title: 'Meeting Notes', image: '📝' },
    { type: 'page' as const, title: 'Project Dashboard', image: '📊' },
    { type: 'page' as const, title: 'Ideas & Brainstorming', image: '💡' },
    { type: 'page' as const, title: 'Calendar & Events', image: '📅' },
    { type: 'page' as const, title: 'Documentation', image: '📚' },
    { type: 'page' as const, title: 'Goals & Objectives', image: '🎯' },
    { type: 'page' as const, title: 'Budget Planning', image: '💰' },
    { type: 'page' as const, title: 'Team Directory', image: '👥' },
    { type: 'page' as const, title: 'Technical Specs', image: '📋' },
    { type: 'page' as const, title: 'Analytics Report', image: '📄' },
    { type: 'user' as const, title: 'shadcn', image: 'https://github.com/shadcn.png', workspace: 'Workspace' },
    { type: 'user' as const, title: 'maxleiter', image: 'https://github.com/maxleiter.png', workspace: 'Workspace' },
    { type: 'user' as const, title: 'evilrabbit', image: 'https://github.com/evilrabbit.png', workspace: 'Workspace' },
  ],
  models: [{ name: 'Auto' }, { name: 'Agent Mode', badge: 'Beta' }, { name: 'Plan Mode' }],
};

@Component({
  selector: 'z-block-notion-prompt-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ZardAvatarComponent,
    ZardBadgeComponent,
    ZardButtonComponent,
    ...ZardCommandImports,
    ...ZardDropdownImports,
    ...ZardMenuImports,
    NgIcon,
    ZardInputDirective,
    ZardInputGroupComponent,
    ZardPopoverComponent,
    ZardPopoverDirective,
    ZardSwitchComponent,
    ZardTooltipDirective,
    ZardIdDirective,
  ],
  viewProviders: [
    provideIcons({
      lucideAtSign,
      lucideX,
      lucidePaperclip,
      lucideGlobe,
      lucideCheck,
      lucideChevronRight,
      lucideLayers,
      lucideCircleDashed,
      lucideBookOpen,
      lucidePlus,
      lucideArrowUp,
    }),
  ],
  template: `
    <form zardId="notion-prompt" #z="zardId">
      <div class="flex flex-col gap-2">
        <label class="sr-only" [attr.for]="z.id()">Prompt</label>
        <z-input-group [zAddonBefore]="addonBefore" [zAddonAfter]="addonAfter" zAddonAlign="block">
          <textarea
            z-input
            [id]="z.id()"
            placeholder="Ask, search, or make anything..."
            class="field-sizing-content min-h-16 resize-none"
          ></textarea>
        </z-input-group>

        <!-- Addon Before: Mentions -->
        <ng-template #addonBefore>
          <div class="flex items-center gap-1">
            <button
              type="button"
              z-button
              zType="outline"
              zPopover
              [zContent]="mentionPopover"
              [class]="hasMentions() ? 'size-8!' : ''"
            >
              <ng-icon name="lucideAtSign" />
              @if (!hasMentions()) {
                Add context
              }
            </button>
            <ng-template #mentionPopover>
              <z-popover class="w-64 p-0 [--radius:0.75rem]">
                <z-command class="min-h-auto" (zCommandSelected)="onMentionSelected($event)">
                  <z-command-input placeholder="Search pages..." />
                  <z-command-list class="max-h-64">
                    <z-command-empty>No results found.</z-command-empty>
                    @if (availablePages().length > 0) {
                      <z-command-option-group zLabel="Pages">
                        @for (item of availablePages(); track item.title) {
                          <z-command-option [zValue]="item.title" [zLabel]="item.image + ' ' + item.title" />
                        }
                      </z-command-option-group>
                    }
                    @if (availableUsers().length > 0) {
                      <z-command-option-group zLabel="Users">
                        @for (item of availableUsers(); track item.title) {
                          <z-command-option [zValue]="item.title" [zLabel]="item.title" />
                        }
                      </z-command-option-group>
                    }
                  </z-command-list>
                </z-command>
              </z-popover>
            </ng-template>

            <!-- Selected Mentions -->
            <div class="no-scrollbar -m-1.5 flex gap-1 overflow-x-auto p-1.5">
              @for (mention of mentions(); track mention) {
                @if (getMentionItem(mention); as item) {
                  <button
                    type="button"
                    z-button
                    zType="secondary"
                    zSize="sm"
                    zShape="circle"
                    class="pl-2!"
                    (click)="removeMention(mention)"
                  >
                    @if (item.type === 'page') {
                      <span class="flex size-4 items-center justify-center">{{ item.image }}</span>
                    } @else {
                      <z-avatar [zSrc]="item.image" class="size-4" />
                    }
                    {{ item.title }}
                    <ng-icon name="lucideX" />
                  </button>
                }
              }
            </div>
          </div>
        </ng-template>

        <!-- Addon After: Actions -->
        <ng-template #addonAfter>
          <div class="flex w-full items-center gap-1">
            <!-- Attach File -->
            <button
              type="button"
              z-button
              zType="ghost"
              zSize="sm"
              zShape="circle"
              zTooltip="Attach file"
              aria-label="Attach file"
            >
              <ng-icon name="lucidePaperclip" />
            </button>

            <!-- Model Selector -->
            <button
              type="button"
              z-button
              zType="ghost"
              zSize="sm"
              zShape="circle"
              zTooltip="Select AI model"
              z-dropdown
              [zDropdownMenu]="modelMenu"
            >
              {{ selectedModel().name }}
            </button>
            <z-dropdown-menu-content #modelMenu="zDropdownMenuContent" class="w-48 [--radius:1rem]">
              <z-dropdown-menu-label class="text-muted-foreground text-xs">Select Agent Mode</z-dropdown-menu-label>
              @for (model of models; track model.name) {
                <z-dropdown-menu-item
                  (click)="selectModel(model)"
                  class="pl-2 *:[span:first-child]:right-2 *:[span:first-child]:left-auto"
                >
                  <span class="flex-1">{{ model.name }}</span>
                  @if (model.badge) {
                    <z-badge
                      zType="secondary"
                      class="h-5 rounded-sm bg-blue-100 px-1 text-xs text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                    >
                      {{ model.badge }}
                    </z-badge>
                  }
                  @if (selectedModel().name === model.name) {
                    <ng-icon name="lucideCheck" class="size-4" />
                  }
                </z-dropdown-menu-item>
              }
            </z-dropdown-menu-content>

            <!-- Sources Selector -->
            <button
              type="button"
              z-button
              zType="ghost"
              zSize="sm"
              zShape="circle"
              z-menu
              [zMenuTriggerFor]="sourcesMenu"
            >
              <ng-icon name="lucideGlobe" />
              All Sources
            </button>
            <ng-template #sourcesMenu>
              <div z-menu-content class="w-64 [--radius:1rem]">
                <div class="flex items-center justify-between px-2 py-1.5">
                  <label [attr.for]="z.id() + '-web-search'" class="flex items-center gap-2">
                    <ng-icon name="lucideGlobe" class="size-4" />
                    <span class="text-sm">Web Search</span>
                  </label>
                  <z-switch [zId]="z.id() + '-web-search'" />
                </div>
                <div class="bg-border my-1 h-px"></div>
                <div class="flex items-center justify-between px-2 py-1.5">
                  <label [attr.for]="z.id() + '-apps'" class="flex items-center gap-2">
                    <ng-icon name="lucideLayers" class="size-4" />
                    <span class="text-sm">Apps and Integrations</span>
                  </label>
                  <z-switch [zId]="z.id() + '-apps'" />
                </div>
                <button type="button" z-menu-item>
                  <ng-icon name="lucideCircleDashed" class="size-4" />
                  All Sources I can access
                </button>
                <button
                  type="button"
                  z-menu-item
                  z-menu
                  [zMenuTriggerFor]="usersSubmenu"
                  zPlacement="rightTop"
                  zTrigger="hover"
                  class="justify-between"
                >
                  <div class="flex items-center gap-2">
                    <z-avatar zSrc="https://github.com/shadcn.png" class="size-4" />
                    shadcn
                  </div>
                  <ng-icon name="lucideChevronRight" class="size-4" />
                </button>
                <button type="button" z-menu-item>
                  <ng-icon name="lucideBookOpen" class="size-4" />
                  Help Center
                </button>
                <div class="bg-border my-1 h-px"></div>
                <button type="button" z-menu-item>
                  <ng-icon name="lucidePlus" class="size-4" />
                  Connect Apps
                </button>
                <div class="text-muted-foreground px-2 py-1.5 text-xs">
                  We'll only search in the sources selected here.
                </div>
              </div>
            </ng-template>
            <ng-template #usersSubmenu>
              <div z-menu-content class="w-56">
                <button type="button" z-menu-item>
                  <z-avatar zSrc="https://github.com/shadcn.png" class="size-4" />
                  <span class="flex-1">shadcn</span>
                  <span class="text-muted-foreground text-xs">Workspace</span>
                </button>
                <button type="button" z-menu-item>
                  <z-avatar zSrc="https://github.com/maxleiter.png" class="size-4" />
                  <span class="flex-1">maxleiter</span>
                  <span class="text-muted-foreground text-xs">Workspace</span>
                </button>
                <button type="button" z-menu-item>
                  <z-avatar zSrc="https://github.com/evilrabbit.png" class="size-4" />
                  <span class="flex-1">evilrabbit</span>
                  <span class="text-muted-foreground text-xs">Workspace</span>
                </button>
              </div>
            </ng-template>

            <!-- Send Button -->
            <button type="button" z-button zSize="sm" zShape="circle" class="ml-auto" aria-label="Send">
              <ng-icon name="lucideArrowUp" />
            </button>
          </div>
        </ng-template>
      </div>
    </form>
  `,
})
export class BlockNotionPromptFormComponent {
  protected readonly mentions = signal<string[]>([]);
  protected readonly selectedModel = signal<ModelItem>(SAMPLE_DATA.models[0]);
  protected readonly models = SAMPLE_DATA.models;
  protected readonly mentionable = SAMPLE_DATA.mentionable;

  protected readonly hasMentions = computed(() => this.mentions().length > 0);

  protected readonly availablePages = computed(() =>
    this.mentionable.filter(item => item.type === 'page' && !this.mentions().includes(item.title)),
  );

  protected readonly availableUsers = computed(() =>
    this.mentionable.filter(item => item.type === 'user' && !this.mentions().includes(item.title)),
  );

  protected getMentionItem(title: string): MentionableItem | undefined {
    return this.mentionable.find(item => item.title === title);
  }

  protected addMention(title: string): void {
    this.mentions.update(prev => [...prev, title]);
  }

  protected removeMention(title: string): void {
    this.mentions.update(prev => prev.filter(m => m !== title));
  }

  protected onMentionSelected(option: ZardCommandOption): void {
    this.addMention(option.value as string);
  }

  protected selectModel(model: ModelItem): void {
    this.selectedModel.set(model);
  }
}
