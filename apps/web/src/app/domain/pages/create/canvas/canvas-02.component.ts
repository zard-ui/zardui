import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgIcon } from '@ng-icons/core';

import { ZardBadgeComponent } from '@zard/components/badge';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardCheckboxComponent } from '@zard/components/checkbox/checkbox.component';
import { ZardInputComponent } from '@zard/components/input/input.component';
import { ZardKbdComponent } from '@zard/components/kbd/kbd.component';
import { ZardProgressComponent } from '@zard/components/progress/progress.component';
import { ZardSkeletonComponent } from '@zard/components/skeleton/skeleton.component';
import { ZardTextareaComponent } from '@zard/components/textarea/textarea.component';

import { canvasIcons, ICON_GRID } from './canvas-icons';
import { CardAnalyticsComponent, CardNewChatComponent, CardUiElementsComponent } from '../../home/components/cards';
import { PreviewDesignContext } from '../lib/preview-design.context';

const SWATCHES = ['background', 'foreground', 'primary', 'secondary', 'muted', 'accent'] as const;
const SWATCHES_2 = ['border', 'chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5'] as const;

/**
 * Canvas "02": the UI specimen. A style overview, the typography, every kind of control and the icon grid, so each
 * option of the customizer has something to act on.
 */
@Component({
  selector: 'z-create-canvas-02',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ZardCardImports,
    ZardButtonComponent,
    ZardBadgeComponent,
    ZardCheckboxComponent,
    ZardInputComponent,
    ZardKbdComponent,
    ZardProgressComponent,
    ZardSkeletonComponent,
    ZardTextareaComponent,
    NgIcon,
    CardAnalyticsComponent,
    CardNewChatComponent,
    CardUiElementsComponent,
  ],
  viewProviders: [canvasIcons()],
  host: { class: 'block' },
  template: `
    <div class="grid w-[2960px] grid-cols-7 items-start gap-11 p-11" data-canvas="preview-02">
      <div class="flex flex-col gap-11">
        <z-card>
          <z-card-header>
            <z-card-title [zTitle]="styleOverviewTitle()" />
            <p
              z-card-description
              zDescription="Designers love packing quirky glyphs into test phrases. This is a preview of the typography."
            ></p>
          </z-card-header>
          <z-card-content class="grid gap-2">
            <div class="grid grid-cols-6 gap-2">
              @for (token of swatches; track token) {
                <div class="grid gap-1">
                  <span
                    class="ring-foreground/10 aspect-square rounded-md ring-1"
                    [style.background]="'var(--' + token + ')'"
                  ></span>
                  <span class="text-muted-foreground truncate font-mono text-[9px]">--{{ token }}</span>
                </div>
              }
            </div>
            <div class="grid grid-cols-6 gap-2">
              @for (token of swatches2; track token) {
                <div class="grid gap-1">
                  <span
                    class="ring-foreground/10 aspect-square rounded-md ring-1"
                    [style.background]="'var(--' + token + ')'"
                  ></span>
                  <span class="text-muted-foreground truncate font-mono text-[9px]">--{{ token }}</span>
                </div>
              }
            </div>
          </z-card-content>
        </z-card>
        <z-card>
          <z-card-content class="grid gap-3">
            <span class="text-muted-foreground text-[10px] tracking-wider uppercase">Inherit · {{ fontLabel() }}</span>
            <h3 class="text-xl leading-tight font-semibold">Designing with rhythm and hierarchy.</h3>
            <p class="text-muted-foreground text-sm leading-relaxed">
              A strong body style keeps long-form content readable and balances the visual weight of headings.
            </p>
            <p class="text-muted-foreground text-sm leading-relaxed">
              Thoughtful spacing and cadence help paragraphs scan quickly without feeling dense.
            </p>
            <button type="button" z-button zType="outline" class="w-full">Share Feedback</button>
          </z-card-content>
        </z-card>
        <z-card>
          <z-card-content class="flex flex-col items-center gap-3 py-6 text-center">
            <ng-icon name="lucideFolder" class="text-muted-foreground size-5" />
            <p class="text-sm font-medium">No codespaces</p>
            <p class="text-muted-foreground text-sm">You don't have any codespaces with this repository checked out.</p>
            <button type="button" z-button zSize="sm">Create Codespace</button>
          </z-card-content>
        </z-card>
        <z-card>
          <z-card-header>
            <z-card-title zTitle="Invoice #INV-2847" />
            <p z-card-description zDescription="Due March 30, 2026"></p>
            <div z-card-action><z-badge zType="secondary">Pending</z-badge></div>
          </z-card-header>
          <z-card-content>
            <table class="w-full text-sm">
              <thead class="text-muted-foreground text-xs">
                <tr>
                  <th class="py-1 text-left font-medium">Item</th>
                  <th class="py-1 text-right font-medium">Qty</th>
                  <th class="py-1 text-right font-medium">Rate</th>
                </tr>
              </thead>
              <tbody>
                @for (row of invoice; track row.item) {
                  <tr class="border-t">
                    <td class="py-1.5">{{ row.item }}</td>
                    <td class="py-1.5 text-right tabular-nums">{{ row.qty }}</td>
                    <td class="py-1.5 text-right tabular-nums">{{ row.rate }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </z-card-content>
          <z-card-content class="flex justify-between">
            <button type="button" z-button zType="outline" zSize="sm">Download PDF</button>
            <button type="button" z-button zSize="sm">Pay Now</button>
          </z-card-content>
        </z-card>
      </div>

      <div class="flex flex-col gap-11">
        <z-card>
          <z-card-header>
            <z-card-title zTitle="Icon Preview Grid" />
            <p z-card-description zDescription="The icon library you picked, drawn by the components."></p>
          </z-card-header>
          <z-card-content>
            <div class="grid grid-cols-6 gap-3" data-icon-grid>
              @for (icon of icons; track icon) {
                <span class="bg-muted flex aspect-square items-center justify-center rounded-lg">
                  <ng-icon [name]="icon" class="size-5" />
                </span>
              }
            </div>
          </z-card-content>
        </z-card>
        <z-card-ui-elements />
        <z-card>
          <z-card-content class="grid gap-3">
            <div class="bg-muted flex h-32 items-center justify-center rounded-lg">
              <ng-icon name="lucideImage" class="text-muted-foreground size-6" />
            </div>
            <p class="text-sm font-medium">Observability Plus is replacing Monitoring</p>
            <p class="text-muted-foreground text-sm">
              Switch to the improved way to explore your data, with natural language.
            </p>
            <div class="flex items-center justify-between">
              <button type="button" z-button zSize="sm">
                Create Query
                <ng-icon name="lucidePlus" data-icon="inline-end" />
              </button>
              <z-badge zType="outline">Warning</z-badge>
            </div>
          </z-card-content>
        </z-card>
        <z-card>
          <z-card-header>
            <z-card-title zTitle="Shipping Address" />
            <p z-card-description zDescription="Where should we deliver?"></p>
          </z-card-header>
          <z-card-content class="grid gap-3">
            <label class="grid gap-1.5 text-sm font-medium">
              Street address
              <input z-input placeholder="123 Main Street" />
            </label>
            <label class="grid gap-1.5 text-sm font-medium">
              Apt / Suite
              <input z-input placeholder="Apt 4B" />
            </label>
            <div class="grid grid-cols-2 gap-3">
              <label class="grid gap-1.5 text-sm font-medium">
                City
                <input z-input placeholder="San Francisco" />
              </label>
              <label class="grid gap-1.5 text-sm font-medium">
                ZIP Code
                <input z-input placeholder="94102" />
              </label>
            </div>
            <z-checkbox [ngModel]="true">Save as default address</z-checkbox>
          </z-card-content>
          <z-card-content class="flex justify-between">
            <button type="button" z-button zType="outline" zSize="sm">Cancel</button>
            <button type="button" z-button zSize="sm">Save Address</button>
          </z-card-content>
        </z-card>
      </div>

      <div class="flex flex-col gap-11">
        <z-card>
          <z-card-header>
            <z-card-title zTitle="Environment Variables" />
            <p z-card-description zDescription="Production · 8 variables"></p>
          </z-card-header>
          <z-card-content class="grid gap-2 font-mono text-xs">
            @for (variable of variables; track variable.name) {
              <div class="bg-muted/50 flex justify-between rounded-md px-2.5 py-2">
                <span>{{ variable.name }}</span>
                <span class="text-muted-foreground">{{ variable.value }}</span>
              </div>
            }
          </z-card-content>
          <z-card-content class="flex justify-between">
            <button type="button" z-button zType="outline" zSize="sm">Edit</button>
            <button type="button" z-button zSize="sm">Deploy</button>
          </z-card-content>
        </z-card>
        <z-card>
          <z-card-header>
            <z-card-title zTitle="Traffic channels" />
            <p z-card-description zDescription="Monthly desktop and mobile traffic for the last six months."></p>
          </z-card-header>
          <z-card-content>
            <div class="flex h-32 items-end gap-3" role="img" aria-label="Traffic by month">
              @for (month of traffic; track month.label) {
                <div class="flex flex-1 flex-col items-center gap-1">
                  <div class="flex h-24 w-full items-end gap-0.5">
                    <div class="bg-chart-1 flex-1 rounded-sm" [style.height.%]="month.a"></div>
                    <div class="bg-chart-3 flex-1 rounded-sm" [style.height.%]="month.b"></div>
                  </div>
                  <span class="text-muted-foreground text-[10px]">{{ month.label }}</span>
                </div>
              }
            </div>
          </z-card-content>
          <z-card-content><button type="button" z-button class="w-full">View report</button></z-card-content>
        </z-card>
        <z-card>
          <z-card-header>
            <z-card-title zTitle="Invite Team" />
            <p z-card-description zDescription="Add members to your workspace"></p>
          </z-card-header>
          <z-card-content class="grid gap-3">
            <input z-input value="alex@example.com" aria-label="Email" />
            <input z-input value="sam@example.com" aria-label="Email" />
            <button type="button" z-button zType="outline" class="w-full">
              <ng-icon name="lucidePlus" />
              Add another
            </button>
            <div class="flex gap-2">
              <input z-input value="https://app.co/invite/x8f2k" aria-label="Invite link" readonly />
              <button type="button" z-button zType="outline" zSize="icon" aria-label="Copy link">
                <ng-icon name="lucideCopy" />
              </button>
            </div>
          </z-card-content>
          <z-card-content><button type="button" z-button class="w-full">Send Invites</button></z-card-content>
        </z-card>
        <z-card>
          <z-card-header>
            <z-card-title zTitle="Ship faster &amp; safer with Vercel Agent" />
            <p z-card-description zDescription="Your use is subject to Vercel's Public Beta Agreement."></p>
          </z-card-header>
          <z-card-content class="grid gap-3 text-sm">
            @for (point of agentPoints; track point) {
              <div class="flex gap-2">
                <ng-icon name="lucideCheck" class="mt-0.5 size-4 shrink-0" />
                <span>{{ point }}</span>
              </div>
            }
          </z-card-content>
          <z-card-content class="flex justify-end gap-2">
            <button type="button" z-button zType="outline" zSize="sm">Cancel</button>
            <button type="button" z-button zSize="sm">Enable with $100 credits</button>
          </z-card-content>
        </z-card>
      </div>

      <div class="flex flex-col gap-11">
        <z-card>
          <z-card-content class="flex items-center gap-3">
            <z-skeleton class="size-10 rounded-full" />
            <div class="grid flex-1 gap-2">
              <z-skeleton class="h-3 w-3/4" />
              <z-skeleton class="h-3 w-1/2" />
            </div>
          </z-card-content>
        </z-card>
        <z-card>
          <z-card-header>
            <z-card-title zTitle="Browser Share" />
            <p z-card-description zDescription="January - June 2026"></p>
            <div z-card-action><z-badge zType="outline">Firefox</z-badge></div>
          </z-card-header>
          <z-card-content class="flex flex-col items-center gap-3">
            <div
              class="border-muted flex size-32 items-center justify-center rounded-full border-[12px] border-t-(--chart-2) border-r-(--chart-1)"
              role="img"
              aria-label="935 visitors"
            >
              <div class="text-center">
                <div class="text-xl font-semibold">935</div>
                <div class="text-muted-foreground text-xs">Visitors</div>
              </div>
            </div>
            <div class="flex gap-3 text-xs">
              <span class="text-chart-1">Chrome</span>
              <span class="text-chart-2">Edge</span>
              <span class="text-chart-3">Firefox</span>
              <span class="text-chart-4">Safari</span>
            </div>
          </z-card-content>
          <z-card-content class="grid gap-1">
            <div class="flex justify-between text-xs">
              <span>Firefox</span>
              <span class="text-muted-foreground">31%</span>
            </div>
            <z-progress [value]="31" aria-label="Firefox share" />
          </z-card-content>
        </z-card>
        <z-card>
          <z-card-content class="flex flex-col items-center gap-3 py-6 text-center">
            <ng-icon name="lucideUser" class="text-muted-foreground size-5" />
            <p class="text-sm font-medium">No Team Members</p>
            <p class="text-muted-foreground text-sm">Invite your team to collaborate on this project.</p>
            <button type="button" z-button zSize="sm">Invite Members</button>
          </z-card-content>
        </z-card>
        <z-card>
          <z-card-header>
            <z-card-title zTitle="Report Bug" />
            <p z-card-description zDescription="Help us fix issues faster."></p>
          </z-card-header>
          <z-card-content class="grid gap-3">
            <label class="grid gap-1.5 text-sm font-medium">
              Title
              <input z-input placeholder="Brief description of the issue" />
            </label>
            <label class="grid gap-1.5 text-sm font-medium">
              Steps to reproduce
              <textarea z-textarea class="resize-none" placeholder="1. Go to 2. Click on 3. Observe"></textarea>
            </label>
          </z-card-content>
          <z-card-content class="flex justify-end gap-2">
            <button type="button" z-button zType="outline" zSize="sm">Attach File</button>
            <button type="button" z-button zSize="sm">Submit Bug</button>
          </z-card-content>
        </z-card>
        <z-card>
          <z-card-header>
            <z-card-title zTitle="Contributors" />
            <div z-card-action><z-badge zType="secondary">312</z-badge></div>
          </z-card-header>
          <z-card-content class="grid grid-cols-6 gap-2">
            @for (index of contributors; track index) {
              <span class="bg-muted size-8 rounded-full"></span>
            }
          </z-card-content>
          <z-card-content>
            <a class="text-muted-foreground text-xs underline" href="#" (click)="$event.preventDefault()">
              + 810 contributors
            </a>
          </z-card-content>
        </z-card>
      </div>

      <div class="flex flex-col gap-11">
        <z-card>
          <z-card-content class="grid gap-3">
            <label class="grid gap-1.5 text-sm font-medium">
              Topic
              <input z-input placeholder="Select a topic" />
            </label>
            <label class="grid gap-1.5 text-sm font-medium">
              Feedback
              <textarea z-textarea class="resize-none" placeholder="Your feedback helps us improve..."></textarea>
            </label>
            <button type="button" z-button zSize="sm" class="w-fit">Submit</button>
          </z-card-content>
        </z-card>
        <z-card>
          <z-card-header>
            <z-card-title zTitle="Book Appointment" />
            <p z-card-description zDescription="Dr. Sarah Chen · Cardiology"></p>
          </z-card-header>
          <z-card-content class="grid gap-3">
            <div class="grid grid-cols-4 gap-1.5 text-xs">
              @for (slot of slots; track slot) {
                <span
                  class="ring-foreground/10 rounded-md py-1.5 text-center ring-1"
                  [class.bg-muted]="slot === '9:00 AM'"
                >
                  {{ slot }}
                </span>
              }
            </div>
            <div class="bg-muted/50 rounded-lg p-3 text-sm">
              <div class="font-medium">New patient?</div>
              <div class="text-muted-foreground text-xs">Please arrive 15 minutes early.</div>
            </div>
          </z-card-content>
          <z-card-content><button type="button" z-button class="w-full">Book Appointment</button></z-card-content>
        </z-card>
        <z-card>
          <z-card-header>
            <z-card-title zTitle="Sleep Report" />
            <p z-card-description zDescription="Last night · 7h 24m"></p>
          </z-card-header>
          <z-card-content>
            <div class="flex h-24 items-end gap-3" role="img" aria-label="Sleep stages">
              @for (stage of sleep; track stage.label) {
                <div class="flex flex-1 flex-col items-center gap-1">
                  <div class="bg-chart-2 w-full rounded-sm" [style.height.%]="stage.value"></div>
                  <span class="text-[10px] font-medium">{{ stage.label }}</span>
                </div>
              }
            </div>
          </z-card-content>
        </z-card>
        <z-card>
          <z-card-header>
            <z-card-title zTitle="Profile" />
            <p z-card-description zDescription="Manage your profile information."></p>
          </z-card-header>
          <z-card-content class="grid gap-3">
            <label class="grid gap-1.5 text-sm font-medium">
              Name
              <input z-input value="shadcn" />
            </label>
            <label class="grid gap-1.5 text-sm font-medium">
              Public Email
              <input z-input value="m@zardui.com" />
            </label>
            <label class="grid gap-1.5 text-sm font-medium">
              Bio
              <textarea z-textarea class="resize-none" placeholder="Tell us a little bit about yourself"></textarea>
            </label>
          </z-card-content>
          <z-card-content><button type="button" z-button zSize="sm">Save Profile</button></z-card-content>
        </z-card>
      </div>

      <div class="flex flex-col gap-11">
        <z-card>
          <z-card-header>
            <z-card-title zTitle="Weekly Fitness Summary" />
            <p z-card-description zDescription="Calories and workout load by day"></p>
          </z-card-header>
          <z-card-content>
            <div class="flex h-20 items-end gap-2" role="img" aria-label="Workout load by day">
              @for (day of week; track $index) {
                <div class="flex flex-1 flex-col items-center gap-1">
                  <div class="bg-chart-3 w-full rounded-md" [style.height.%]="day.value"></div>
                  <span class="text-muted-foreground text-[10px]">{{ day.label }}</span>
                </div>
              }
            </div>
          </z-card-content>
          <z-card-content><button type="button" z-button class="w-full">View details</button></z-card-content>
        </z-card>
        <z-card>
          <z-card-header>
            <z-card-title zTitle="File Upload" />
            <p z-card-description zDescription="Drag and drop or browse"></p>
          </z-card-header>
          <z-card-content
            class="ring-foreground/10 mx-6 flex flex-col items-center gap-2 rounded-lg py-6 text-center ring-1"
          >
            <ng-icon name="lucideDownload" class="text-muted-foreground size-5" />
            <p class="text-sm font-medium">Upload files</p>
            <p class="text-muted-foreground text-xs">PNG, JPG, PDF up to 10MB</p>
            <button type="button" z-button zSize="sm">Browse Files</button>
          </z-card-content>
        </z-card>
        <z-card-analytics />
        <z-card>
          <z-card-content class="grid gap-3 text-sm">
            <div class="font-medium">5 days remaining in cycle</div>
            @for (usage of usages; track usage.name) {
              <div class="flex justify-between">
                <span>{{ usage.name }}</span>
                <span class="text-muted-foreground font-mono text-xs">{{ usage.value }}</span>
              </div>
            }
          </z-card-content>
        </z-card>
      </div>

      <div class="flex flex-col gap-11">
        <z-card>
          <z-card-content class="flex flex-col items-center gap-3 py-6 text-center">
            <p class="text-sm font-medium">Get alerted of anomalies</p>
            <p class="text-muted-foreground text-sm">
              Automatically monitor your projects for anomalies and get notified.
            </p>
            <button type="button" z-button zSize="sm">Upgrade to Observability Plus</button>
          </z-card-content>
        </z-card>
        <z-card>
          <z-card-header>
            <z-card-title zTitle="Live Audio Waveform" />
            <p z-card-description zDescription="Real-time microphone input visualization."></p>
          </z-card-header>
          <z-card-content>
            <div class="flex h-10 items-center gap-0.5" role="img" aria-label="Audio waveform">
              @for (bar of wave; track $index) {
                <span class="bg-foreground/60 w-1 rounded-full" [style.height.%]="bar"></span>
              }
            </div>
          </z-card-content>
          <z-card-content class="flex gap-2">
            <button type="button" z-button zType="outline" zSize="sm">Start Listening</button>
            <button type="button" z-button zSize="sm">Stop Processing</button>
          </z-card-content>
        </z-card>
        <z-card>
          <z-card-header>
            <z-card-title zTitle="Visitors" />
            <p z-card-description zDescription="Last 6 months"></p>
            <div z-card-action><z-badge zType="outline">+2% vs last month</z-badge></div>
          </z-card-header>
          <z-card-content>
            <svg
              viewBox="0 0 200 70"
              class="text-chart-2 h-28 w-full"
              role="img"
              aria-label="Visitors trend"
              fill="none"
            >
              <path d="M0 50 C25 10 50 10 75 40 S125 70 150 35 S190 20 200 30" stroke="currentColor" stroke-width="2" />
            </svg>
          </z-card-content>
        </z-card>
        <z-card>
          <z-card-header>
            <z-card-title zTitle="Contributions &amp; Activity" />
            <p z-card-description zDescription="Manage your contributions and activity visibility."></p>
          </z-card-header>
          <z-card-content class="flex gap-3 text-sm">
            <z-checkbox><span class="sr-only">Make profile private</span></z-checkbox>
            <div>
              <div class="font-medium">Make profile private and hide activity</div>
              <div class="text-muted-foreground text-xs">Hide your contributions from the community.</div>
            </div>
          </z-card-content>
          <z-card-content><button type="button" z-button zSize="sm">Save Changes</button></z-card-content>
        </z-card>
        <z-card>
          <z-card-header><z-card-title zTitle="Shortcuts" /></z-card-header>
          <z-card-content class="grid gap-3 text-sm">
            @for (shortcut of shortcuts; track shortcut.name) {
              <div class="flex items-center justify-between">
                <span class="text-muted-foreground">{{ shortcut.name }}</span>
                <z-kbd>{{ shortcut.keys }}</z-kbd>
              </div>
            }
          </z-card-content>
        </z-card>
        <z-card>
          <z-card-content class="flex flex-col items-center gap-3 py-6 text-center">
            <p class="text-sm font-medium">404 - Not Found</p>
            <p class="text-muted-foreground text-sm">The page you're looking for doesn't exist.</p>
            <button type="button" z-button zType="link" zSize="sm">Go to homepage</button>
          </z-card-content>
        </z-card>
        <z-card-new-chat />
      </div>
    </div>
  `,
})
export class CanvasTwoComponent {
  private readonly context = inject(PreviewDesignContext);

  protected readonly swatches = SWATCHES;
  protected readonly swatches2 = SWATCHES_2;
  protected readonly icons = ICON_GRID;
  protected readonly contributors = Array.from({ length: 18 }, (_, index) => index);

  protected styleOverviewTitle(): string {
    return `${this.context.styleLabel()} - ${this.context.fontLabel()}`;
  }

  protected fontLabel(): string {
    return this.context.fontLabel();
  }

  protected readonly invoice = [
    { item: 'Design System License', qty: 1, rate: '$499.00' },
    { item: 'Priority Support', qty: 12, rate: '$99.00' },
    { item: 'Custom Components', qty: 3, rate: '$250.00' },
  ];

  protected readonly variables = [
    { name: 'DATABASE_URL', value: '••••••••' },
    { name: 'NEXT_PUBLIC_API', value: 'https://api.example.com' },
    { name: 'STRIPE_SECRET', value: '••••••••' },
  ];

  protected readonly traffic = [
    { label: 'Jan', a: 40, b: 25 },
    { label: 'Feb', a: 85, b: 55 },
    { label: 'Mar', a: 60, b: 70 },
    { label: 'Apr', a: 45, b: 35 },
    { label: 'May', a: 75, b: 50 },
    { label: 'Jun', a: 55, b: 65 },
  ];

  protected readonly agentPoints = [
    'Code reviews with full codebase context to catch hard-to-find bugs.',
    'Code suggestions validated in sandboxes before you merge.',
    'Root-cause analysis for production incidents with deployment context.',
  ];

  protected readonly slots = ['9:00 AM', '10:30 AM', '11:00 AM', '1:30 PM'];
  protected readonly sleep = [
    { label: 'Deep', value: 55 },
    { label: 'Light', value: 85 },
    { label: 'REM', value: 45 },
    { label: 'Score', value: 70 },
  ];

  protected readonly week = [
    { label: 'M', value: 80 },
    { label: 'T', value: 40 },
    { label: 'W', value: 70 },
    { label: 'T', value: 35 },
    { label: 'F', value: 90 },
    { label: 'S', value: 50 },
    { label: 'S', value: 30 },
  ];

  protected readonly usages = [
    { name: 'Edge Requests', value: '$1.83K' },
    { name: 'Fast Data Transfer', value: '$952.51' },
    { name: 'Monitoring data points', value: '$901.20' },
    { name: 'Web Analytics Events', value: '$603.71' },
  ];

  protected readonly wave = [20, 35, 55, 40, 70, 90, 60, 45, 80, 50, 30, 65, 85, 40, 25, 55, 75, 35, 20, 45];
  protected readonly shortcuts = [
    { name: 'Search', keys: '⌘K' },
    { name: 'Quick Actions', keys: '⌘J' },
    { name: 'New File', keys: '⌘N' },
    { name: 'Save', keys: '⌘S' },
  ];
}
