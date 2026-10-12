import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideFile, lucideFileSearch, lucideInbox } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardDrawerImports } from '@zard/components/drawer/drawer.imports';
import { ZardItemImports, type ZardItemSizeVariants, type ZardItemVariantVariants } from '@zard/components/item';

import { ExampleImports } from './example.component';

const ICONS = { lucideFile, lucideFileSearch, lucideInbox };

const VARIANT_SECTIONS: readonly { title: string; variant: ZardItemVariantVariants; size: ZardItemSizeVariants }[] = [
  { title: 'Default', variant: 'default', size: 'default' },
  { title: 'Outline', variant: 'outline', size: 'default' },
  { title: 'Muted', variant: 'muted', size: 'default' },
  { title: 'Small', variant: 'default', size: 'sm' },
  { title: 'Outline - Small', variant: 'outline', size: 'sm' },
  { title: 'Muted - Small', variant: 'muted', size: 'sm' },
  { title: 'Extra Small', variant: 'default', size: 'xs' },
  { title: 'Outline - Extra Small', variant: 'outline', size: 'xs' },
  { title: 'Muted - Extra Small', variant: 'muted', size: 'xs' },
];

const LINK_SECTIONS: readonly { title: string; variant: ZardItemVariantVariants }[] = [
  { title: 'asChild', variant: 'default' },
  { title: 'Outline - asChild', variant: 'outline' },
  { title: 'Muted - asChild', variant: 'muted' },
];

const IMAGE_SECTIONS: readonly { title: string; variant: ZardItemVariantVariants; size: ZardItemSizeVariants }[] = [
  { title: 'Default - ItemMedia image', variant: 'default', size: 'default' },
  { title: 'Outline - ItemMedia image', variant: 'outline', size: 'default' },
  { title: 'Outline - ItemMedia image - Small', variant: 'outline', size: 'sm' },
  { title: 'Outline - ItemMedia image - Extra Small', variant: 'outline', size: 'xs' },
  { title: 'Muted - ItemMedia image', variant: 'muted', size: 'default' },
];

const SEPARATED_ITEMS: readonly { title: string; description: string }[] = [
  { title: 'Inbox', description: 'View all incoming messages.' },
  { title: 'Sent', description: 'View all sent messages.' },
  { title: 'Drafts', description: 'View all draft messages.' },
  { title: 'Archive', description: 'View archived messages.' },
];

const EXPLORED_FILES = ['app/chat/page.tsx', 'components/message.tsx', 'lib/ai.ts', 'app/api/chat/route.ts'];

/**
 * The nine items shadcn repeats for every variant and size. Extra small drops the descriptions, and only the default
 * size keeps a default-size outline button.
 */
@Component({
  selector: 'z-item-example-variants',
  imports: [NgIcon, ZardButtonComponent, ZardItemImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons(ICONS)],
  host: { class: 'contents' },
  template: `
    @let v = zVariant();
    @let s = zSize();
    @let described = s !== 'xs';
    <z-item [zVariant]="v" [zSize]="s">
      <z-item-content>
        <z-item-title>Title Only</z-item-title>
      </z-item-content>
    </z-item>
    <z-item [zVariant]="v" [zSize]="s">
      <z-item-content>
        <z-item-title>Title + Button</z-item-title>
      </z-item-content>
      <z-item-actions>
        <button type="button" z-button zType="outline" [zSize]="outlineButtonSize()">Action</button>
      </z-item-actions>
    </z-item>
    <z-item [zVariant]="v" [zSize]="s">
      <z-item-content>
        <z-item-title>Title + Description</z-item-title>
        @if (described) {
          <z-item-description>This is a description that provides additional context.</z-item-description>
        }
      </z-item-content>
    </z-item>
    <z-item [zVariant]="v" [zSize]="s">
      <z-item-content>
        <z-item-title>Title + Description + Button</z-item-title>
        @if (described) {
          <z-item-description>This item includes a title, description, and action button.</z-item-description>
        }
      </z-item-content>
      <z-item-actions>
        <button type="button" z-button zType="outline" [zSize]="outlineButtonSize()">Action</button>
      </z-item-actions>
    </z-item>
    <z-item [zVariant]="v" [zSize]="s">
      <z-item-media zVariant="icon">
        <ng-icon name="lucideInbox" />
      </z-item-media>
      <z-item-content>
        <z-item-title>Media + Title</z-item-title>
      </z-item-content>
    </z-item>
    <z-item [zVariant]="v" [zSize]="s">
      <z-item-media zVariant="icon">
        <ng-icon name="lucideInbox" />
      </z-item-media>
      <z-item-content>
        <z-item-title>Media + Title + Button</z-item-title>
      </z-item-content>
      <z-item-actions>
        <button type="button" z-button zSize="sm">Action</button>
      </z-item-actions>
    </z-item>
    <z-item [zVariant]="v" [zSize]="s">
      <z-item-media zVariant="icon">
        <ng-icon name="lucideInbox" />
      </z-item-media>
      <z-item-content>
        <z-item-title>Media + Title + Description</z-item-title>
        @if (described) {
          <z-item-description>This item includes media, title, and description.</z-item-description>
        }
      </z-item-content>
    </z-item>
    <z-item [zVariant]="v" [zSize]="s">
      <z-item-media zVariant="icon">
        <ng-icon name="lucideInbox" />
      </z-item-media>
      <z-item-content>
        <z-item-title>Media + Title + Description + Button</z-item-title>
        @if (described) {
          <z-item-description>
            Complete item with all components: media, title, description, and button.
          </z-item-description>
        }
      </z-item-content>
      <z-item-actions>
        <button type="button" z-button zSize="sm">Action</button>
      </z-item-actions>
    </z-item>
    <z-item [zVariant]="v" [zSize]="s">
      <z-item-content>
        <z-item-title>Multiple Actions</z-item-title>
        @if (described) {
          <z-item-description>Item with multiple action buttons in the actions area.</z-item-description>
        }
      </z-item-content>
      <z-item-actions>
        <button type="button" z-button zType="outline" zSize="sm">Cancel</button>
        <button type="button" z-button zSize="sm">Confirm</button>
      </z-item-actions>
    </z-item>
  `,
})
export class ItemExampleVariantsComponent {
  readonly zVariant = input<ZardItemVariantVariants>('default');
  readonly zSize = input<ZardItemSizeVariants>('default');

  protected readonly outlineButtonSize = computed(() => (this.zSize() === 'default' ? 'default' : 'sm'));
}

/** shadcn's `Item asChild` around an `<a>`: zard's item is an attribute component, so it sits on the anchor. */
@Component({
  selector: 'z-item-example-links',
  imports: [NgIcon, ZardButtonComponent, ZardItemImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons(ICONS)],
  host: { class: 'contents' },
  template: `
    @let v = zVariant();
    <z-item-group>
      <a z-item href="#" [zVariant]="v" (click)="$event.preventDefault()">
        <z-item-content>
          <z-item-title>Title Only (Link)</z-item-title>
        </z-item-content>
      </a>
      <a z-item href="#" [zVariant]="v" (click)="$event.preventDefault()">
        <z-item-content>
          <z-item-title>Title + Description (Link)</z-item-title>
          <z-item-description>Clickable item with title and description.</z-item-description>
        </z-item-content>
      </a>
      <a z-item href="#" [zVariant]="v" (click)="$event.preventDefault()">
        <z-item-media zVariant="icon">
          <ng-icon name="lucideInbox" />
        </z-item-media>
        <z-item-content>
          <z-item-title>Media + Title (Link)</z-item-title>
        </z-item-content>
      </a>
      <a z-item href="#" [zVariant]="v" (click)="$event.preventDefault()">
        <z-item-media zVariant="icon">
          <ng-icon name="lucideInbox" />
        </z-item-media>
        <z-item-content>
          <z-item-title>Media + Title + Description (Link)</z-item-title>
          <z-item-description>Complete link item with media, title, and description.</z-item-description>
        </z-item-content>
      </a>
      <a z-item href="#" [zVariant]="v" (click)="$event.preventDefault()">
        <z-item-content>
          <z-item-title>With Actions (Link)</z-item-title>
          <z-item-description>Link item that also has action buttons.</z-item-description>
        </z-item-content>
        <z-item-actions>
          <button type="button" z-button zType="outline" zSize="sm">Share</button>
        </z-item-actions>
      </a>
    </z-item-group>
  `,
})
export class ItemExampleLinksComponent {
  readonly zVariant = input<ZardItemVariantVariants>('default');
}

/** The three items with an image as media; extra small drops the descriptions. */
@Component({
  selector: 'z-item-example-images',
  imports: [ZardButtonComponent, ZardItemImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: `
    @let v = zVariant();
    @let s = zSize();
    @let described = s !== 'xs';
    <z-item [zVariant]="v" [zSize]="s">
      <z-item-media zVariant="image">
        <img
          src="https://avatar.vercel.sh/Project"
          alt="Project"
          width="40"
          height="40"
          class="object-cover grayscale"
        />
      </z-item-media>
      <z-item-content>
        <z-item-title>Project Dashboard</z-item-title>
        @if (described) {
          <z-item-description>Overview of project settings and configuration.</z-item-description>
        }
      </z-item-content>
    </z-item>
    <z-item [zVariant]="v" [zSize]="s">
      <z-item-media zVariant="image">
        <img
          src="https://avatar.vercel.sh/Document"
          alt="Document"
          width="40"
          height="40"
          class="object-cover grayscale"
        />
      </z-item-media>
      <z-item-content>
        <z-item-title>Document</z-item-title>
        @if (described) {
          <z-item-description>A document with metadata displayed.</z-item-description>
        }
      </z-item-content>
      <z-item-actions>
        <button type="button" z-button zType="outline" zSize="sm">View</button>
      </z-item-actions>
    </z-item>
    <z-item [zVariant]="v" [zSize]="s">
      <z-item-media zVariant="image">
        <img src="https://avatar.vercel.sh/File" alt="File" width="40" height="40" class="object-cover grayscale" />
      </z-item-media>
      <z-item-content>
        <z-item-title>File Attachment</z-item-title>
        @if (described) {
          <z-item-description>Complete file with image, title, description, and action button.</z-item-description>
        }
      </z-item-content>
      <z-item-actions>
        <button type="button" z-button zSize="sm">Download</button>
      </z-item-actions>
    </z-item>
  `,
})
export class ItemExampleImagesComponent {
  readonly zVariant = input<ZardItemVariantVariants>('default');
  readonly zSize = input<ZardItemSizeVariants>('default');
}

/** shadcn/ui's `item-example`, in zard. */
@Component({
  selector: 'z-item-example',
  imports: [
    ExampleImports,
    NgIcon,
    ZardButtonComponent,
    ZardDrawerImports,
    ZardItemImports,
    ItemExampleVariantsComponent,
    ItemExampleLinksComponent,
    ItemExampleImagesComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons(ICONS)],
  template: `
    <z-example-wrapper>
      @for (section of variantSections; track section.title) {
        <z-example [zTitle]="section.title">
          <z-item-example-variants [zVariant]="section.variant" [zSize]="section.size" />
        </z-example>
      }

      @for (section of linkSections; track section.title) {
        <z-example [zTitle]="section.title">
          <z-item-example-links [zVariant]="section.variant" />
        </z-example>
      }

      <z-example zTitle="ItemGroup">
        <z-item-group>
          <z-item>
            <z-item-content>
              <z-item-title>Item 1</z-item-title>
              <z-item-description>First item in the group.</z-item-description>
            </z-item-content>
          </z-item>
          <z-item>
            <z-item-content>
              <z-item-title>Item 2</z-item-title>
              <z-item-description>Second item in the group.</z-item-description>
            </z-item-content>
          </z-item>
          <z-item>
            <z-item-content>
              <z-item-title>Item 3</z-item-title>
              <z-item-description>Third item in the group.</z-item-description>
            </z-item-content>
          </z-item>
        </z-item-group>
      </z-example>

      <z-example zTitle="Outline - ItemGroup">
        <z-item-group>
          <z-item zVariant="outline">
            <z-item-media zVariant="icon"><ng-icon name="lucideInbox" /></z-item-media>
            <z-item-content>
              <z-item-title>Item 1</z-item-title>
              <z-item-description>First item with icon.</z-item-description>
            </z-item-content>
          </z-item>
          <z-item zVariant="outline">
            <z-item-media zVariant="icon"><ng-icon name="lucideInbox" /></z-item-media>
            <z-item-content>
              <z-item-title>Item 2</z-item-title>
              <z-item-description>Second item with icon.</z-item-description>
            </z-item-content>
          </z-item>
          <z-item zVariant="outline">
            <z-item-media zVariant="icon"><ng-icon name="lucideInbox" /></z-item-media>
            <z-item-content>
              <z-item-title>Item 3</z-item-title>
              <z-item-description>Third item with icon.</z-item-description>
            </z-item-content>
          </z-item>
        </z-item-group>
      </z-example>

      <z-example zTitle="Muted - ItemGroup">
        <z-item-group>
          <z-item zVariant="muted">
            <z-item-content>
              <z-item-title>Item 1</z-item-title>
              <z-item-description>First item in muted group.</z-item-description>
            </z-item-content>
            <z-item-actions>
              <button type="button" z-button zType="outline" zSize="sm">Action</button>
            </z-item-actions>
          </z-item>
          <z-item zVariant="muted">
            <z-item-content>
              <z-item-title>Item 2</z-item-title>
              <z-item-description>Second item in muted group.</z-item-description>
            </z-item-content>
            <z-item-actions>
              <button type="button" z-button zType="outline" zSize="sm">Action</button>
            </z-item-actions>
          </z-item>
          <z-item zVariant="muted">
            <z-item-content>
              <z-item-title>Item 3</z-item-title>
              <z-item-description>Third item in muted group.</z-item-description>
            </z-item-content>
            <z-item-actions>
              <button type="button" z-button zType="outline" zSize="sm">Action</button>
            </z-item-actions>
          </z-item>
        </z-item-group>
      </z-example>

      <z-example zTitle="ItemSeparator">
        <z-item-group>
          @for (item of separatedItems; track item.title) {
            @if (!$first) {
              <z-item-separator />
            }
            <z-item zVariant="outline">
              <z-item-media zVariant="icon"><ng-icon name="lucideInbox" /></z-item-media>
              <z-item-content>
                <z-item-title>{{ item.title }}</z-item-title>
                <z-item-description>{{ item.description }}</z-item-description>
              </z-item-content>
            </z-item>
          }
        </z-item-group>
      </z-example>

      <z-example zTitle="ItemHeader">
        <z-item>
          <z-item-header><span class="text-sm font-medium">Design System</span></z-item-header>
          <z-item-content>
            <z-item-title>Component Library</z-item-title>
            <z-item-description>
              A comprehensive collection of reusable UI components for building consistent interfaces.
            </z-item-description>
          </z-item-content>
        </z-item>
        <z-item zVariant="outline">
          <z-item-header><span class="text-sm font-medium">Marketing</span></z-item-header>
          <z-item-content>
            <z-item-title>Campaign Analytics</z-item-title>
            <z-item-description>
              Track performance metrics and engagement rates across all marketing channels.
            </z-item-description>
          </z-item-content>
        </z-item>
        <z-item zVariant="muted">
          <z-item-header><span class="text-sm font-medium">Engineering</span></z-item-header>
          <z-item-content>
            <z-item-title>API Documentation</z-item-title>
            <z-item-description>
              Complete reference guide for all available endpoints and authentication methods.
            </z-item-description>
          </z-item-content>
        </z-item>
      </z-example>

      <z-example zTitle="ItemFooter">
        <z-item>
          <z-item-content>
            <z-item-title>Quarterly Report Q4 2024</z-item-title>
            <z-item-description>
              Financial overview including revenue, expenses, and growth metrics for the fourth quarter.
            </z-item-description>
          </z-item-content>
          <z-item-footer><span class="text-muted-foreground text-sm">Last updated 2 hours ago</span></z-item-footer>
        </z-item>
        <z-item zVariant="outline">
          <z-item-content>
            <z-item-title>User Research Findings</z-item-title>
            <z-item-description>
              Insights from interviews and surveys conducted with 50+ users across different demographics.
            </z-item-description>
          </z-item-content>
          <z-item-footer><span class="text-muted-foreground text-sm">Created by Sarah Chen</span></z-item-footer>
        </z-item>
        <z-item zVariant="muted">
          <z-item-content>
            <z-item-title>Product Roadmap</z-item-title>
            <z-item-description>
              Planned features and improvements scheduled for the next three months.
            </z-item-description>
          </z-item-content>
          <z-item-footer><span class="text-muted-foreground text-sm">12 comments</span></z-item-footer>
        </z-item>
      </z-example>

      <z-example zTitle="ItemHeader + ItemFooter">
        <z-item>
          <z-item-header><span class="text-sm font-medium">Team Project</span></z-item-header>
          <z-item-content>
            <z-item-title>Website Redesign</z-item-title>
            <z-item-description>
              Complete overhaul of the company website with modern design principles and improved user experience.
            </z-item-description>
          </z-item-content>
          <z-item-footer><span class="text-muted-foreground text-sm">Updated 5 minutes ago</span></z-item-footer>
        </z-item>
        <z-item zVariant="outline">
          <z-item-header><span class="text-sm font-medium">Client Work</span></z-item-header>
          <z-item-content>
            <z-item-title>Mobile App Development</z-item-title>
            <z-item-description>
              Building a cross-platform mobile application for iOS and Android with React Native.
            </z-item-description>
          </z-item-content>
          <z-item-footer><span class="text-muted-foreground text-sm">Status: In Progress</span></z-item-footer>
        </z-item>
        <z-item zVariant="muted">
          <z-item-header><span class="text-sm font-medium">Documentation</span></z-item-header>
          <z-item-content>
            <z-item-title>API Integration Guide</z-item-title>
            <z-item-description>
              Step-by-step instructions for integrating third-party APIs with authentication and error handling.
            </z-item-description>
          </z-item-content>
          <z-item-footer>
            <span class="text-muted-foreground text-sm">Category: Technical • 3 attachments</span>
          </z-item-footer>
        </z-item>
      </z-example>

      <z-example zTitle="Item with Drawer">
        <button type="button" z-item zVariant="outline" (click)="drawerOpen.set(true)">
          <z-item-media zVariant="icon"><ng-icon name="lucideFileSearch" /></z-item-media>
          <z-item-content>
            <z-item-title>Explored 4 files</z-item-title>
            <z-item-description>Review the files that were searched for this answer.</z-item-description>
          </z-item-content>
        </button>
        <z-drawer [(zVisible)]="drawerOpen">
          <z-drawer-header>
            <z-drawer-title>Explored files</z-drawer-title>
            <z-drawer-description>Files opened while generating the response.</z-drawer-description>
          </z-drawer-header>
          <div class="grid gap-3 p-4">
            @for (file of exploredFiles; track file) {
              <z-item zVariant="muted" zSize="sm">
                <z-item-media zVariant="icon"><ng-icon name="lucideFile" /></z-item-media>
                <z-item-content>
                  <z-item-title>{{ file }}</z-item-title>
                </z-item-content>
              </z-item>
            }
          </div>
        </z-drawer>
      </z-example>

      @for (section of imageSections; track section.title) {
        <z-example [zTitle]="section.title">
          <z-item-example-images [zVariant]="section.variant" [zSize]="section.size" />
        </z-example>
      }
    </z-example-wrapper>
  `,
})
export class ItemExampleComponent {
  protected readonly variantSections = VARIANT_SECTIONS;
  protected readonly linkSections = LINK_SECTIONS;
  protected readonly imageSections = IMAGE_SECTIONS;
  protected readonly separatedItems = SEPARATED_ITEMS;
  protected readonly exploredFiles = EXPLORED_FILES;
  protected readonly drawerOpen = signal(false);
}
