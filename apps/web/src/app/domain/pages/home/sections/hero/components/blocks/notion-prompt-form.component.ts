import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';

import { ZardAvatarComponent } from '@zard/components/avatar/avatar.component';
import { ZardBadgeComponent } from '@zard/components/badge/badge.component';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardDropdownImports } from '@zard/components/dropdown';
import { ZardIconComponent } from '@zard/components/icon/icon.component';
import { ZardInputDirective } from '@zard/components/input/input.directive';
import { ZardInputGroupComponent } from '@zard/components/input-group/input-group.component';
import { ZardSwitchComponent } from '@zard/components/switch/switch.component';
import { ZardTooltipDirective } from '@zard/components/tooltip';

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
    ...ZardDropdownImports,
    ZardIconComponent,
    ZardInputDirective,
    ZardInputGroupComponent,
    ZardSwitchComponent,
    ZardTooltipDirective,
  ],
  template: `
    <form class="[--radius:1.2rem]">
      <div class="flex flex-col gap-2">
        <label class="sr-only" for="notion-prompt">Prompt</label>
        <z-input-group [zAddonBefore]="addonBefore" [zAddonAfter]="addonAfter" zAddonAlign="block">
          <textarea
            z-input
            id="notion-prompt"
            placeholder="Ask, search, or make anything..."
            class="field-sizing-content min-h-16 resize-none"
          ></textarea>
        </z-input-group>

        <!-- Addon Before: Mentions -->
        <ng-template #addonBefore>
          <div class="flex items-center gap-1">
            <button
              z-button
              zType="outline"
              zSize="sm"
              zShape="circle"
              zTooltip="Mention a person, page, or date"
              z-dropdown
              [zDropdownMenu]="mentionMenu"
              [class]="hasMentions() ? 'size-8!' : ''"
            >
              <z-icon zType="at-sign" />
              @if (!hasMentions()) {
                Add context
              }
            </button>
            <z-dropdown-menu-content #mentionMenu="zDropdownMenuContent" class="w-64 p-0 [--radius:1.2rem]">
              <div class="p-2">
                <div class="bg-muted/50 mb-2 flex items-center gap-2 rounded-md px-2 py-1.5">
                  <z-icon zType="search" class="text-muted-foreground size-4" />
                  <span class="text-muted-foreground text-sm">Search pages...</span>
                </div>
              </div>
              <z-dropdown-menu-label class="text-muted-foreground px-3 text-xs">Pages</z-dropdown-menu-label>
              @for (item of availablePages(); track item.title) {
                <z-dropdown-menu-item (click)="addMention(item.title)">
                  <span class="flex size-4 items-center justify-center">{{ item.image }}</span>
                  {{ item.title }}
                </z-dropdown-menu-item>
              }
              @if (availableUsers().length > 0) {
                <div class="bg-border my-1 h-px"></div>
                <z-dropdown-menu-label class="text-muted-foreground px-3 text-xs">Users</z-dropdown-menu-label>
                @for (item of availableUsers(); track item.title) {
                  <z-dropdown-menu-item (click)="addMention(item.title)">
                    <z-avatar [zSrc]="item.image" class="size-4" />
                    {{ item.title }}
                  </z-dropdown-menu-item>
                }
              }
            </z-dropdown-menu-content>

            <!-- Selected Mentions -->
            <div class="no-scrollbar -m-1.5 flex gap-1 overflow-y-auto p-1.5">
              @for (mention of mentions(); track mention) {
                @if (getMentionItem(mention); as item) {
                  <button
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
                    <z-icon zType="x" />
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
            <button z-button zType="ghost" zSize="sm" zShape="circle" zTooltip="Attach file" aria-label="Attach file">
              <z-icon zType="paperclip" />
            </button>

            <!-- Model Selector -->
            <button
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
                    <z-icon zType="check" class="size-4" />
                  }
                </z-dropdown-menu-item>
              }
            </z-dropdown-menu-content>

            <!-- Sources Selector -->
            <button z-button zType="ghost" zSize="sm" zShape="circle" z-dropdown [zDropdownMenu]="sourcesMenu">
              <z-icon zType="globe" />
              All Sources
            </button>
            <z-dropdown-menu-content #sourcesMenu="zDropdownMenuContent" class="w-64 [--radius:1rem]">
              <div class="flex items-center justify-between px-2 py-1.5">
                <label for="web-search" class="flex items-center gap-2">
                  <z-icon zType="globe" class="size-4" />
                  <span class="text-sm">Web Search</span>
                </label>
                <z-switch zId="web-search" />
              </div>
              <div class="bg-border my-1 h-px"></div>
              <div class="flex items-center justify-between px-2 py-1.5">
                <label for="apps" class="flex items-center gap-2">
                  <z-icon zType="layers" class="size-4" />
                  <span class="text-sm">Apps and Integrations</span>
                </label>
                <z-switch zId="apps" />
              </div>
              <z-dropdown-menu-item>
                <z-icon zType="circle-dashed" class="size-4" />
                All Sources I can access
              </z-dropdown-menu-item>
              <z-dropdown-menu-item>
                <z-avatar zSrc="https://github.com/shadcn.png" class="size-4" />
                <span class="flex-1">shadcn</span>
                <z-icon zType="chevron-right" class="size-4" />
              </z-dropdown-menu-item>
              <z-dropdown-menu-item>
                <z-icon zType="book-open" class="size-4" />
                Help Center
              </z-dropdown-menu-item>
              <div class="bg-border my-1 h-px"></div>
              <z-dropdown-menu-item>
                <z-icon zType="plus" class="size-4" />
                Connect Apps
              </z-dropdown-menu-item>
              <z-dropdown-menu-label class="text-muted-foreground text-xs">
                We'll only search in the sources selected here.
              </z-dropdown-menu-label>
            </z-dropdown-menu-content>

            <!-- Send Button -->
            <button z-button zSize="sm" zShape="circle" class="ml-auto" aria-label="Send">
              <z-icon zType="arrow-up" />
            </button>
          </div>
        </ng-template>
      </div>
    </form>
  `,
})
export class BlockNotionPromptFormComponent {
  readonly mentions = signal<string[]>([]);
  readonly selectedModel = signal<ModelItem>(SAMPLE_DATA.models[0]);
  readonly models = SAMPLE_DATA.models;
  readonly mentionable = SAMPLE_DATA.mentionable;

  readonly hasMentions = computed(() => this.mentions().length > 0);

  readonly availablePages = computed(() =>
    this.mentionable.filter(item => item.type === 'page' && !this.mentions().includes(item.title)),
  );

  readonly availableUsers = computed(() =>
    this.mentionable.filter(item => item.type === 'user' && !this.mentions().includes(item.title)),
  );

  getMentionItem(title: string): MentionableItem | undefined {
    return this.mentionable.find(item => item.title === title);
  }

  addMention(title: string): void {
    this.mentions.update(prev => [...prev, title]);
  }

  removeMention(title: string): void {
    this.mentions.update(prev => prev.filter(m => m !== title));
  }

  selectModel(model: ModelItem): void {
    this.selectedModel.set(model);
  }
}
