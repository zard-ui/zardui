import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardButtonComponent } from '@zard/components/button';
import { ZardDrawerImports, type ZardDrawerPlacement } from '@zard/components/drawer';

import { ExampleImports } from './example.component';

const PARAGRAPHS = [
  'Your changes are saved automatically as you type.',
  'Delivery usually takes three to five business days, depending on your location and the shipping method you selected at checkout.',
  'We use your email address for account notifications and order updates. You can change this anytime from your profile settings.',
  "Two-factor authentication adds an extra layer of security to your account. When enabled, you'll need to enter a code from your authenticator app in addition to your password. We recommend enabling it if you store payment methods or sensitive information.",
  'By continuing, you agree to our Terms of Service and Privacy Policy. We collect usage data to improve the product, personalize your experience, and troubleshoot issues. You can export or delete your data at any time from the account settings page. Third-party integrations may have their own policies, and you should review them before connecting external services.',
  "Refunds are processed within five to ten business days after we receive your return. Items must be unused and in their original packaging to qualify. Shipping costs are non-refundable unless the return is due to our error or a defective product. Once approved, the refund is issued to your original payment method; credit card refunds may take an additional billing cycle to appear on your statement. If you paid with store credit, the balance is restored to your account immediately. Contact support if you haven't received your refund after two weeks.",
  'Last updated March 12, 2026.',
  'Upgrade to Pro for unlimited projects, priority support, and advanced analytics. Cancel anytime from billing settings.',
  "You haven't verified your email yet. Check your inbox for a confirmation link—we sent it when you signed up. The link expires after 24 hours, but you can request a new one below.",
  'API requests are rate-limited to 1,000 calls per hour on the free plan. Exceeding the limit returns a 429 response with a Retry-After header. Upgrade to a paid plan for higher limits and dedicated support. Webhook deliveries are retried up to three times with exponential backoff if your endpoint returns a non-2xx status.',
  'No payment method on file.',
  "Our design team rebuilt the checkout flow last quarter after interviews with forty-two customers. The biggest friction point was surprise fees at the final step, so we moved shipping and tax estimates earlier in the process. Early tests show a twelve percent drop in cart abandonment. We're still rolling out the update region by region, and you may see the old flow until your account is migrated.",
] as const;

const DRAWER_SIDES = [
  { label: 'up', placement: 'top' },
  { label: 'right', placement: 'right' },
  { label: 'down', placement: 'bottom' },
  { label: 'left', placement: 'left' },
] as const satisfies readonly { label: string; placement: ZardDrawerPlacement }[];

const SNAP_POINTS = ['31rem', 1] as const;

/** The placeholder block shadcn draws: a fixed-height strip on a vertical drawer, the whole body on a side one. */
const BLOCK_CLASS =
  'bg-muted group-data-[axis=x]/drawer:size-full group-data-[axis=y]/drawer:h-80 group-data-[axis=y]/drawer:w-full';

const CUSTOM_SIZES = [
  {
    label: 'Down',
    title: 'Down drawer',
    description: 'Drawer with a custom height.',
    placement: 'bottom',
    class: 'h-64',
  },
  { label: 'Up', title: 'Up drawer', description: 'Drawer with a custom height.', placement: 'top', class: 'h-[50vh]' },
  {
    label: 'Left',
    title: 'Left drawer',
    description: 'Drawer with a custom width.',
    placement: 'left',
    class: 'w-xl sm:w-xl',
  },
  {
    label: 'Right',
    title: 'Right drawer',
    description: 'Drawer with a custom width.',
    placement: 'right',
    class: 'w-xs sm:w-xs',
  },
] as const satisfies readonly {
  label: string;
  title: string;
  description: string;
  placement: ZardDrawerPlacement;
  class: string;
}[];

/** shadcn/ui's `drawer-example`, in zard. */
@Component({
  selector: 'z-drawer-example',
  imports: [ExampleImports, ZardButtonComponent, ZardDrawerImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <z-example-wrapper>
      <z-example zTitle="Demo">
        <div class="flex flex-wrap gap-2">
          <button type="button" z-button zType="outline" (click)="show('demo-open')">Open Drawer</button>
          <z-drawer [zVisible]="isOpen('demo-open')" (zVisibleChange)="setOpen('demo-open', $event)">
            <div class="p-4"><div class="bg-muted h-80 w-full"></div></div>
          </z-drawer>

          <button type="button" z-button zType="outline" (click)="show('demo-header')">Header</button>
          <z-drawer [zVisible]="isOpen('demo-header')" (zVisibleChange)="setOpen('demo-header', $event)">
            <z-drawer-header>
              <z-drawer-title>Edit profile</z-drawer-title>
              <z-drawer-description>
                Make changes to your profile here. Click save when you're done.
              </z-drawer-description>
            </z-drawer-header>
            <div class="p-4"><div class="bg-muted h-80 w-full"></div></div>
          </z-drawer>

          <button type="button" z-button zType="outline" (click)="show('demo-footer')">Footer</button>
          <z-drawer [zVisible]="isOpen('demo-footer')" (zVisibleChange)="setOpen('demo-footer', $event)">
            <div class="p-4"><div class="bg-muted h-80 w-full"></div></div>
            <z-drawer-footer>
              <button type="button" z-button>Submit</button>
              <button type="button" z-button zType="outline" z-drawer-close>Cancel</button>
            </z-drawer-footer>
          </z-drawer>

          <button type="button" z-button zType="outline" (click)="show('demo-both')">Header and Footer</button>
          <z-drawer [zVisible]="isOpen('demo-both')" (zVisibleChange)="setOpen('demo-both', $event)">
            <z-drawer-header>
              <z-drawer-title>Edit profile</z-drawer-title>
              <z-drawer-description>
                Make changes to your profile here. Click save when you're done.
              </z-drawer-description>
            </z-drawer-header>
            <div class="p-4"><div class="bg-muted h-80 w-full"></div></div>
            <z-drawer-footer>
              <button type="button" z-button>Submit</button>
              <button type="button" z-button zType="outline" z-drawer-close>Cancel</button>
            </z-drawer-footer>
          </z-drawer>

          <button type="button" z-button zType="outline" (click)="show('demo-edge')">Edge to Edge</button>
          <z-drawer [zVisible]="isOpen('demo-edge')" (zVisibleChange)="setOpen('demo-edge', $event)">
            <div class="h-80 w-full bg-blue-200"></div>
          </z-drawer>
        </div>
      </z-example>

      <z-example zTitle="Swipe Handle">
        <div class="flex flex-wrap gap-2">
          @for (side of sides; track side.label) {
            <button type="button" z-button zType="outline" class="capitalize" (click)="show('swipe-' + side.label)">
              {{ side.label }}
            </button>
            <z-drawer
              zHandle
              [zPlacement]="side.placement"
              [zVisible]="isOpen('swipe-' + side.label)"
              (zVisibleChange)="setOpen('swipe-' + side.label, $event)"
            >
              <z-drawer-header>
                <z-drawer-title class="capitalize">Drawer</z-drawer-title>
                <z-drawer-description>Drawer with a swipe handle.</z-drawer-description>
              </z-drawer-header>
              <div class="flex-1 p-4"><div [class]="block"></div></div>
            </z-drawer>
          }
        </div>
      </z-example>

      <z-example zTitle="Position">
        <div class="flex flex-wrap gap-2">
          @for (side of sides; track side.label) {
            <button type="button" z-button zType="outline" class="capitalize" (click)="show('position-' + side.label)">
              {{ side.label }}
            </button>
            <z-drawer
              [zPlacement]="side.placement"
              [zVisible]="isOpen('position-' + side.label)"
              (zVisibleChange)="setOpen('position-' + side.label, $event)"
            >
              <z-drawer-header>
                <z-drawer-title>Move Goal</z-drawer-title>
                <z-drawer-description>Set your daily activity goal.</z-drawer-description>
              </z-drawer-header>
              <div class="flex-1 p-4"><div [class]="block"></div></div>
              <z-drawer-footer>
                <button type="button" z-button>Submit</button>
                <button type="button" z-button zType="outline" z-drawer-close>Cancel</button>
              </z-drawer-footer>
            </z-drawer>
          }
        </div>
      </z-example>

      <z-example zTitle="Custom Width and Height">
        <div class="flex flex-wrap gap-2">
          @for (size of customSizes; track size.label) {
            <button type="button" z-button zType="outline" (click)="show('custom-' + size.label)">
              {{ size.label }}
            </button>
            <z-drawer
              [class]="size.class"
              [zPlacement]="size.placement"
              [zVisible]="isOpen('custom-' + size.label)"
              (zVisibleChange)="setOpen('custom-' + size.label, $event)"
            >
              <z-drawer-header>
                <z-drawer-title>{{ size.title }}</z-drawer-title>
                <z-drawer-description>{{ size.description }}</z-drawer-description>
              </z-drawer-header>
              <div class="scroll-fade flex-1 scrollbar-thin overflow-y-auto p-4">
                @for (paragraph of firstParagraphs; track $index) {
                  <p class="style-lyra:mb-2 style-lyra:leading-relaxed mb-4 leading-normal">{{ paragraph }}</p>
                }
              </div>
              <z-drawer-footer>
                <button type="button" z-button zType="outline" z-drawer-close>Close</button>
              </z-drawer-footer>
            </z-drawer>
          }
        </div>
      </z-example>

      <z-example zTitle="Scrollable Content">
        <div class="flex flex-wrap gap-2">
          @for (side of sides; track side.label) {
            <button type="button" z-button zType="outline" class="capitalize" (click)="show('scroll-' + side.label)">
              {{ side.label }}
            </button>
            <z-drawer
              [zPlacement]="side.placement"
              [zVisible]="isOpen('scroll-' + side.label)"
              (zVisibleChange)="setOpen('scroll-' + side.label, $event)"
            >
              <z-drawer-header>
                <z-drawer-title>Move Goal</z-drawer-title>
                <z-drawer-description>Set your daily activity goal.</z-drawer-description>
              </z-drawer-header>
              <div class="scroll-fade flex-1 overflow-y-auto p-4">
                @for (paragraph of allParagraphs; track $index) {
                  <p class="style-lyra:mb-2 style-lyra:leading-relaxed mb-4 leading-normal">{{ paragraph }}</p>
                }
              </div>
              <z-drawer-footer>
                <button type="button" z-button>Submit</button>
                <button type="button" z-button zType="outline" z-drawer-close>Cancel</button>
              </z-drawer-footer>
            </z-drawer>
          }
        </div>
      </z-example>

      <z-example zTitle="Snap Points">
        <button type="button" z-button zType="outline" (click)="show('snap')">Open Snap Drawer</button>
        <z-drawer
          zHandle
          class="max-h-[calc(100dvh-1rem)]"
          [zSnapPoints]="snapPoints"
          [zVisible]="isOpen('snap')"
          (zVisibleChange)="setOpen('snap', $event)"
        >
          <z-drawer-header>
            <z-drawer-title>Snap points</z-drawer-title>
            <z-drawer-description>
              Drag the drawer to snap between a compact peek and a near full-height view.
            </z-drawer-description>
          </z-drawer-header>
          <div class="scroll-fade grid flex-1 gap-3 overflow-y-auto p-4">
            @for (row of rows; track row) {
              <div class="bg-muted h-12"></div>
            }
          </div>
        </z-drawer>
      </z-example>

      <z-example zTitle="Nested">
        <div class="flex flex-wrap gap-2">
          @for (side of sides; track side.label) {
            <button type="button" z-button zType="outline" class="capitalize" (click)="show('nested-' + side.label)">
              {{ side.label }}
            </button>
            <z-drawer
              zHandle
              [zPlacement]="side.placement"
              [zVisible]="isOpen('nested-' + side.label)"
              (zVisibleChange)="setOpen('nested-' + side.label, $event)"
            >
              <z-drawer-header>
                <z-drawer-title class="capitalize">{{ side.label }} drawer</z-drawer-title>
                <z-drawer-description>Open another drawer from the same direction.</z-drawer-description>
              </z-drawer-header>
              <div class="flex-1 p-4"><div [class]="block"></div></div>
              <z-drawer-footer>
                <button type="button" z-button (click)="show('nested-2-' + side.label)">Open nested drawer</button>
                <button type="button" z-button zType="outline" z-drawer-close>Close</button>
              </z-drawer-footer>
            </z-drawer>
            <z-drawer
              [zPlacement]="side.placement"
              [zVisible]="isOpen('nested-2-' + side.label)"
              (zVisibleChange)="setOpen('nested-2-' + side.label, $event)"
            >
              <z-drawer-header>
                <z-drawer-title>Nested drawer</z-drawer-title>
                <z-drawer-description>The parent drawer stays mounted behind this one.</z-drawer-description>
              </z-drawer-header>
              <div class="flex-1 p-4"><div [class]="block"></div></div>
              <z-drawer-footer>
                <button type="button" z-button (click)="show('nested-3-' + side.label)">Open third drawer</button>
                <button type="button" z-button zType="outline" z-drawer-close>Close</button>
              </z-drawer-footer>
            </z-drawer>
            <z-drawer
              [zPlacement]="side.placement"
              [zVisible]="isOpen('nested-3-' + side.label)"
              (zVisibleChange)="setOpen('nested-3-' + side.label, $event)"
            >
              <z-drawer-header>
                <z-drawer-title>Third drawer</z-drawer-title>
                <z-drawer-description>This is the frontmost drawer in the stack.</z-drawer-description>
              </z-drawer-header>
              <div class="flex-1 p-4"><div [class]="block"></div></div>
              <z-drawer-footer>
                <button type="button" z-button zType="outline" z-drawer-close>Close</button>
              </z-drawer-footer>
            </z-drawer>
          }
        </div>
      </z-example>

      <z-example zTitle="Non Modal">
        <button type="button" z-button zType="outline" (click)="show('non-modal')">Non Modal</button>
        <z-drawer
          zPlacement="right"
          [zModal]="false"
          [zVisible]="isOpen('non-modal')"
          (zVisibleChange)="setOpen('non-modal', $event)"
        >
          <z-drawer-header>
            <z-drawer-title>Non Modal Drawer</z-drawer-title>
          </z-drawer-header>
          <div class="flex-1 p-4"><div [class]="block"></div></div>
          <z-drawer-footer>
            <button type="button" z-button zType="outline" z-drawer-close>Close</button>
          </z-drawer-footer>
        </z-drawer>
      </z-example>
    </z-example-wrapper>
  `,
})
export class DrawerExampleComponent {
  protected readonly sides = DRAWER_SIDES;
  protected readonly customSizes = CUSTOM_SIZES;
  protected readonly snapPoints = SNAP_POINTS;
  protected readonly block = BLOCK_CLASS;
  protected readonly firstParagraphs = PARAGRAPHS.slice(0, 10);
  protected readonly allParagraphs = Array.from({ length: 20 }, (_, index) => PARAGRAPHS[index % PARAGRAPHS.length]);
  protected readonly rows = Array.from({ length: 16 }, (_, index) => index);
  /** Several can be open at once: a nested drawer stays mounted behind the next one. */
  private readonly openKeys = signal<ReadonlySet<string>>(new Set());

  protected isOpen(key: string): boolean {
    return this.openKeys().has(key);
  }

  protected show(key: string): void {
    this.setOpen(key, true);
  }

  protected setOpen(key: string, open: boolean): void {
    this.openKeys.update(keys => {
      const next = new Set(keys);
      if (open) {
        next.add(key);
      } else {
        next.delete(key);
      }
      return next;
    });
  }
}
