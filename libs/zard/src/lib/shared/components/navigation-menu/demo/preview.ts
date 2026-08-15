import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleAlert, lucideCircleCheck, lucideCircleDashed } from '@ng-icons/lucide';

import { navigationMenuTriggerVariants, ZardNavigationMenuImports } from '@/shared/components/navigation-menu';

interface ComponentLink {
  title: string;
  href: string;
  description: string;
}

@Component({
  selector: 'z-demo-navigation-menu-preview',
  imports: [ZardNavigationMenuImports, NgIcon],
  template: `
    <z-navigation-menu>
      <ul z-navigation-menu-list>
        <li z-navigation-menu-item>
          <button type="button" z-navigation-menu-trigger [zNavigationMenuTriggerFor]="gettingStarted">
            Getting started
          </button>

          <ng-template #gettingStarted>
            <div z-navigation-menu-content>
              <ul class="w-96">
                <li>
                  <a z-navigation-menu-link href="#">
                    <div class="flex flex-col gap-1 text-sm">
                      <div class="leading-none font-medium">Introduction</div>
                      <div class="text-muted-foreground line-clamp-2">
                        Re-usable components built with Tailwind CSS.
                      </div>
                    </div>
                  </a>
                </li>
                <li>
                  <a z-navigation-menu-link href="#">
                    <div class="flex flex-col gap-1 text-sm">
                      <div class="leading-none font-medium">Installation</div>
                      <div class="text-muted-foreground line-clamp-2">
                        How to install dependencies and structure your app.
                      </div>
                    </div>
                  </a>
                </li>
                <li>
                  <a z-navigation-menu-link href="#">
                    <div class="flex flex-col gap-1 text-sm">
                      <div class="leading-none font-medium">Typography</div>
                      <div class="text-muted-foreground line-clamp-2">Styles for headings, paragraphs, lists...etc</div>
                    </div>
                  </a>
                </li>
              </ul>
            </div>
          </ng-template>
        </li>

        <li z-navigation-menu-item class="hidden md:flex">
          <button type="button" z-navigation-menu-trigger [zNavigationMenuTriggerFor]="componentsMenu">
            Components
          </button>

          <ng-template #componentsMenu>
            <div z-navigation-menu-content>
              <ul class="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                @for (component of components; track component.title) {
                  <li>
                    <a z-navigation-menu-link href="#">
                      <div class="flex flex-col gap-1 text-sm">
                        <div class="leading-none font-medium">{{ component.title }}</div>
                        <div class="text-muted-foreground line-clamp-2">{{ component.description }}</div>
                      </div>
                    </a>
                  </li>
                }
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
                    <ng-icon name="lucideCircleDashed" />
                    To Do
                  </a>
                  <a z-navigation-menu-link href="#" class="flex-row items-center gap-2">
                    <ng-icon name="lucideCircleCheck" />
                    Done
                  </a>
                </li>
              </ul>
            </div>
          </ng-template>
        </li>

        <li z-navigation-menu-item>
          <a z-navigation-menu-link href="#" [class]="triggerClass">Docs</a>
        </li>
      </ul>
    </z-navigation-menu>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideCircleAlert, lucideCircleCheck, lucideCircleDashed })],
})
export class ZardDemoNavigationMenuPreviewComponent {
  /** A plain link styled like a trigger, so it lines up with the rest of the bar. */
  protected readonly triggerClass = navigationMenuTriggerVariants();

  protected readonly components: ComponentLink[] = [
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
  ];
}
