import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleAlert } from '@ng-icons/lucide';

import { navigationMenuTriggerVariants, ZardNavigationMenuImports } from '@zard/components/navigation-menu';

import { ExampleImports } from './example.component';

const COMPONENTS = [
  {
    title: 'Alert Dialog',
    href: '/docs/primitives/alert-dialog',
    description: 'A modal dialog that interrupts the user with important content and expects a response.',
  },
  {
    title: 'Hover Card',
    href: '/docs/primitives/hover-card',
    description: 'For sighted users to preview content available behind a link.',
  },
  {
    title: 'Progress',
    href: '/docs/primitives/progress',
    description:
      'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.',
  },
  {
    title: 'Scroll-area',
    href: '/docs/primitives/scroll-area',
    description: 'Visually or semantically separates content.',
  },
  {
    title: 'Tabs',
    href: '/docs/primitives/tabs',
    description: 'A set of layered sections of content—known as tab panels—that are displayed one at a time.',
  },
  {
    title: 'Tooltip',
    href: '/docs/primitives/tooltip',
    description:
      'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
  },
] as const;

const GETTING_STARTED = [
  { title: 'Introduction', href: '/docs', description: 'Re-usable components built with Tailwind CSS.' },
  {
    title: 'Installation',
    href: '/docs/installation',
    description: 'How to install dependencies and structure your app.',
  },
  {
    title: 'Typography',
    href: '/docs/primitives/typography',
    description: 'Styles for headings, paragraphs, lists...etc',
  },
] as const;

const LIST = [
  { title: 'Components', description: 'Browse all components in the library.' },
  { title: 'Documentation', description: 'Learn how to use the library.' },
  { title: 'Blog', description: 'Read our latest blog posts.' },
] as const;

/** shadcn/ui's `navigation-menu-example`, in zard. Its `ListItem` is the `listItem` template. */
@Component({
  selector: 'z-navigation-menu-example',
  imports: [ExampleImports, NgIcon, NgTemplateOutlet, ZardNavigationMenuImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideCircleAlert })],
  template: `
    <z-example-wrapper zClass="lg:grid-cols-1">
      <z-example zTitle="With Viewport">
        <z-navigation-menu>
          <ul z-navigation-menu-list>
            <li z-navigation-menu-item>
              <button type="button" z-navigation-menu-trigger [zNavigationMenuTriggerFor]="gettingStarted">
                Getting started
              </button>
              <ng-template #gettingStarted>
                <div z-navigation-menu-content>
                  <ul class="w-96">
                    @for (item of gettingStartedItems; track item.title) {
                      <ng-container *ngTemplateOutlet="listItem; context: { $implicit: item }" />
                    }
                  </ul>
                </div>
              </ng-template>
            </li>
            <li z-navigation-menu-item>
              <button type="button" z-navigation-menu-trigger [zNavigationMenuTriggerFor]="componentsMenu">
                Components
              </button>
              <ng-template #componentsMenu>
                <div z-navigation-menu-content>
                  <ul class="grid w-[400px] gap-1 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    @for (item of components; track item.title) {
                      <ng-container *ngTemplateOutlet="listItem; context: { $implicit: item }" />
                    }
                  </ul>
                </div>
              </ng-template>
            </li>
            <li z-navigation-menu-item>
              <a z-navigation-menu-link href="/docs" [class]="triggerClass">Documentation</a>
            </li>
          </ul>
        </z-navigation-menu>
      </z-example>

      <z-example zTitle="Without Viewport">
        <z-navigation-menu [zViewport]="false">
          <ul z-navigation-menu-list>
            <li z-navigation-menu-item>
              <a z-navigation-menu-link href="/docs" [class]="triggerClass">Documentation</a>
            </li>
            <li z-navigation-menu-item>
              <button type="button" z-navigation-menu-trigger [zNavigationMenuTriggerFor]="list">List</button>
              <ng-template #list>
                <div z-navigation-menu-content>
                  <ul class="w-72">
                    <li>
                      @for (item of listItems; track item.title) {
                        <a z-navigation-menu-link href="#">
                          <div class="flex flex-col">
                            <div
                              class="style-sera:font-heading style-sera:tracking-wide style-sera:uppercase font-medium"
                            >
                              {{ item.title }}
                            </div>
                            <div class="text-muted-foreground style-sera:mt-0.5 style-sera:leading-relaxed">
                              {{ item.description }}
                            </div>
                          </div>
                        </a>
                      }
                    </li>
                  </ul>
                </div>
              </ng-template>
            </li>
            <li z-navigation-menu-item>
              <button type="button" z-navigation-menu-trigger [zNavigationMenuTriggerFor]="simpleList">
                Simple List
              </button>
              <ng-template #simpleList>
                <div z-navigation-menu-content>
                  <ul>
                    <li>
                      <a z-navigation-menu-link href="#">Components</a>
                      <a z-navigation-menu-link href="#">Documentation</a>
                      <a z-navigation-menu-link href="#">Blocks</a>
                    </li>
                  </ul>
                </div>
              </ng-template>
            </li>
            <li z-navigation-menu-item>
              <button type="button" z-navigation-menu-trigger [zNavigationMenuTriggerFor]="withIcon">With Icon</button>
              <ng-template #withIcon>
                <div z-navigation-menu-content>
                  <ul class="grid w-[200px]">
                    <li>
                      <a z-navigation-menu-link href="#" class="flex-row items-center gap-2">
                        <ng-icon name="lucideCircleAlert" />
                        Backlog
                      </a>
                      <a z-navigation-menu-link href="#" class="flex-row items-center gap-2">
                        <ng-icon name="lucideCircleAlert" />
                        To Do
                      </a>
                      <a z-navigation-menu-link href="#">
                        <ng-icon name="lucideCircleAlert" />
                        Done
                      </a>
                    </li>
                  </ul>
                </div>
              </ng-template>
            </li>
          </ul>
        </z-navigation-menu>
      </z-example>
    </z-example-wrapper>

    <ng-template #listItem let-item>
      <li>
        <a z-navigation-menu-link [href]="item.href">
          <div
            class="style-vega:text-sm style-nova:text-sm style-lyra:text-xs style-maia:text-sm style-mira:text-xs style-luma:text-sm flex flex-col gap-1"
          >
            <div class="style-sera:font-heading style-sera:tracking-wide style-sera:uppercase leading-none font-medium">
              {{ item.title }}
            </div>
            <div class="text-muted-foreground style-sera:mt-0.5 style-sera:leading-relaxed line-clamp-2">
              {{ item.description }}
            </div>
          </div>
        </a>
      </li>
    </ng-template>
  `,
})
export class NavigationMenuExampleComponent {
  protected readonly components = COMPONENTS;
  protected readonly gettingStartedItems = GETTING_STARTED;
  protected readonly listItems = LIST;
  protected readonly triggerClass = navigationMenuTriggerVariants();
}
