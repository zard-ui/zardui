export interface RawUsageData {
  importCode: string;
  templateCode: string;
}

export const USAGE_DATA: Record<string, RawUsageData> = {
  accordion: {
    importCode: `import { ZardAccordionImports } from '@/shared/components/accordion/accordion.imports';`,
    templateCode: `<z-accordion zType="single" zCollapsible>
  <z-accordion-item zValue="item-1" zTitle="Is it accessible?">
    Yes. It adheres to the WAI-ARIA design pattern.
  </z-accordion-item>
</z-accordion>`,
  },
  alert: {
    importCode: `import { ZardAlertComponent } from '@/shared/components/alert/alert.component';`,
    templateCode: `<z-alert zTitle="Heads up!" zDescription="You can add components to your app using the cli."></z-alert>`,
  },
  'alert-dialog': {
    importCode: `import { ZardAlertDialogComponent } from '@/shared/components/alert-dialog/alert-dialog.component';`,
    templateCode: `<z-alert-dialog
  zTitle="Are you absolutely sure?"
  zDescription="This action cannot be undone."
></z-alert-dialog>`,
  },
  avatar: {
    importCode: `import { ZardAvatarComponent } from '@/shared/components/avatar/avatar.component';`,
    templateCode: `<z-avatar zSrc="https://github.com/shadcn.png" zAlt="@shadcn"></z-avatar>`,
  },
  badge: {
    importCode: `import { ZardBadgeComponent } from '@/shared/components/badge/badge.component';`,
    templateCode: `<z-badge>Badge</z-badge>`,
  },
  breadcrumb: {
    importCode: `import { ZardBreadcrumbImports } from '@/shared/components/breadcrumb/breadcrumb.imports';`,
    templateCode: `<z-breadcrumb>
  <z-breadcrumb-item>
    <a z-breadcrumb-link routerLink="/">Home</a>
  </z-breadcrumb-item>
  <z-breadcrumb-item>
    <a z-breadcrumb-link routerLink="/docs/components">Components</a>
  </z-breadcrumb-item>
  <z-breadcrumb-item>
    <span z-breadcrumb-page>Breadcrumb</span>
  </z-breadcrumb-item>
</z-breadcrumb>`,
  },
  button: {
    importCode: `import { ZardButtonComponent } from '@/shared/components/button/button.component';`,
    templateCode: `<button type="button" z-button>Button</button>`,
  },
  'button-group': {
    importCode: `import { ZardButtonGroupComponent } from '@/shared/components/button-group/button-group.component';`,
    templateCode: `<z-button-group>
  <button z-button zType="outline">Left</button>
  <button z-button zType="outline">Center</button>
  <button z-button zType="outline">Right</button>
</z-button-group>`,
  },
  calendar: {
    importCode: `import { ZardCalendarComponent } from '@/shared/components/calendar/calendar.component';`,
    templateCode: `<z-calendar zMode="single" class="rounded-lg border"></z-calendar>`,
  },
  card: {
    importCode: `import { ZardCardComponent } from '@/shared/components/card/card.component';`,
    templateCode: `<z-card zTitle="Card Title" zDescription="Card Description">
  <p>Card Content</p>
</z-card>`,
  },
  carousel: {
    importCode: `import { ZardCarouselImports } from '@/shared/components/carousel/carousel.imports';`,
    templateCode: `<z-carousel>
  <z-carousel-content>
    <z-carousel-item>Slide 1</z-carousel-item>
    <z-carousel-item>Slide 2</z-carousel-item>
    <z-carousel-item>Slide 3</z-carousel-item>
  </z-carousel-content>
</z-carousel>`,
  },
  chart: {
    importCode: `import { ZardChartImports } from '@/shared/components/chart/chart.imports';`,
    templateCode: `<z-chart
  [zConfig]="chartConfig"
  [zData]="chartData"
  zType="bar"
  [zSeries]="['desktop', 'mobile']"
  zXAxisKey="month"
  class="h-[250px] w-full"
>
  <z-chart-tooltip zIndicator="dot" />
  <z-chart-legend />
</z-chart>`,
  },
  checkbox: {
    importCode: `import { ZardCheckboxComponent } from '@/shared/components/checkbox/checkbox.component';`,
    templateCode: `<z-checkbox zLabel="Accept terms and conditions"></z-checkbox>`,
  },
  combobox: {
    importCode: `import { ZardComboboxImports } from '@/shared/components/combobox/combobox.imports';`,
    templateCode: `<z-combobox [(zValue)]="value">
  <z-combobox-input placeholder="Search framework..." />

  <z-combobox-content>
    <z-combobox-empty>No framework found.</z-combobox-empty>

    <z-combobox-list>
      @for (framework of frameworks; track framework.value) {
        <z-combobox-item [zValue]="framework.value">{{ framework.label }}</z-combobox-item>
      }
    </z-combobox-list>
  </z-combobox-content>
</z-combobox>`,
  },
  command: {
    importCode: `import { ZardCommandImports } from '@/shared/components/command/command.imports';`,
    templateCode: `<z-command #cmd="zCommand">
  <z-command-input placeholder="Type a command..." />
  <z-command-list>
    @if (cmd.isEmpty()) {
      <div class="py-6 text-center text-sm">No results found.</div>
    }
    <z-command-option-group zLabel="Suggestions">
      <z-command-option zLabel="Calendar" zValue="calendar" />
    </z-command-option-group>
  </z-command-list>
</z-command>`,
  },
  'date-picker': {
    importCode: `import { ZardDatePickerComponent } from '@/shared/components/date-picker/date-picker.component';`,
    templateCode: `<z-date-picker zPlaceholder="Pick a date"></z-date-picker>`,
  },
  dialog: {
    importCode: `import { ZardDialogImports } from '@/shared/components/dialog/dialog.imports';`,
    templateCode: `<z-dialog zTitle="Edit profile" zDescription="Make changes to your profile here.">
  <p>Dialog content goes here.</p>
</z-dialog>`,
  },
  separator: {
    importCode: `import { ZardSeparatorComponent } from '@/shared/components/separator/separator.component';`,
    templateCode: `<z-separator></z-separator>`,
  },
  dropdown: {
    importCode: `import { ZardDropdownImports } from '@/shared/components/dropdown/dropdown.imports';`,
    templateCode: `<button z-button zType="outline" z-dropdown [zDropdownMenu]="menu">Open</button>

<z-dropdown-menu-content #menu="zDropdownMenuContent" class="w-48">
  <z-dropdown-menu-item>Profile</z-dropdown-menu-item>
  <z-dropdown-menu-item>Settings</z-dropdown-menu-item>
  <z-dropdown-menu-item zDisabled>Subscription</z-dropdown-menu-item>
</z-dropdown-menu-content>`,
  },
  empty: {
    importCode: `import { ZardEmptyComponent } from '@/shared/components/empty/empty.component';`,
    templateCode: `<z-empty zTitle="No data" zDescription="There is no data to display."></z-empty>`,
  },
  field: {
    importCode: `import { ZardFieldImports } from '@/shared/components/field/field.imports';`,
    templateCode: `<div z-field-group>
  <div z-field>
    <label z-field-label for="email">Email</label>
    <input z-input id="email" placeholder="m@example.com" />
    <p z-field-description>We'll never share your email.</p>
  </div>
</div>`,
  },
  input: {
    importCode: `import { ZardInputComponent } from '@/shared/components/input/input.component';`,
    templateCode: `<input z-input type="email" placeholder="Email" />`,
  },
  textarea: {
    importCode: `import { ZardTextareaComponent } from '@/shared/components/textarea/textarea.component';`,
    templateCode: `<textarea z-textarea rows="6" placeholder="Type your message"></textarea>`,
  },
  'input-group': {
    importCode: `import { ZardInputGroupImports } from '@/shared/components/input-group/input-group.imports';`,
    templateCode: `<z-input-group>
  <z-input-group-addon>
    <span z-input-group-text>https://</span>
  </z-input-group-addon>
  <input z-input placeholder="example.com" />
</z-input-group>`,
  },
  'input-otp': {
    importCode: `import { ZardInputOtpImports } from '@/shared/components/input-otp/input-otp.imports';`,
    templateCode: `<z-input-otp [zMaxLength]="6">
  <z-input-otp-group>
    <z-input-otp-slot [zIndex]="0" />
    <z-input-otp-slot [zIndex]="1" />
    <z-input-otp-slot [zIndex]="2" />
  </z-input-otp-group>
  <z-input-otp-separator />
  <z-input-otp-group>
    <z-input-otp-slot [zIndex]="3" />
    <z-input-otp-slot [zIndex]="4" />
    <z-input-otp-slot [zIndex]="5" />
  </z-input-otp-group>
</z-input-otp>`,
  },
  item: {
    importCode: `import { ZardItemImports } from '@/shared/components/item/item.imports';`,
    templateCode: `<z-item zVariant="outline">
  <z-item-content>
    <z-item-title>Title</z-item-title>
    <z-item-description>Description</z-item-description>
  </z-item-content>
</z-item>`,
  },
  kbd: {
    importCode: `import { ZardKbdComponent } from '@/shared/components/kbd/kbd.component';`,
    templateCode: `<z-kbd>⌘ K</z-kbd>`,
  },
  spinner: {
    importCode: `import { ZardSpinnerComponent } from '@/shared/components/spinner/spinner.component';`,
    templateCode: `<z-spinner></z-spinner>`,
  },
  'navigation-menu': {
    importCode: `import { ZardNavigationMenuImports } from '@/shared/components/navigation-menu/navigation-menu.imports';`,
    templateCode: `<z-navigation-menu>
  <ul z-navigation-menu-list>
    <li z-navigation-menu-item>
      <button type="button" z-navigation-menu-trigger [zNavigationMenuTriggerFor]="gettingStarted">
        Getting started
      </button>

      <ng-template #gettingStarted>
        <div z-navigation-menu-content>
          <ul class="w-64">
            <li><a z-navigation-menu-link href="#">Introduction</a></li>
            <li><a z-navigation-menu-link href="#">Installation</a></li>
          </ul>
        </div>
      </ng-template>
    </li>
  </ul>
</z-navigation-menu>`,
  },
  pagination: {
    importCode: `import { ZardPaginationImports } from '@/shared/components/pagination/pagination.imports';`,
    templateCode: `<z-pagination [zTotal]="100" [zPageSize]="10"></z-pagination>`,
  },
  popover: {
    importCode: `import { ZardPopoverImports } from '@/shared/components/popover/popover.imports';`,
    templateCode: `<button z-button zType="outline" zPopover [zContent]="popoverContent">Open popover</button>
<ng-template #popoverContent>
  <z-popover>
    <div z-popover-header>
      <h4 z-popover-title>Title</h4>
      <p z-popover-description>Description text here.</p>
    </div>
  </z-popover>
</ng-template>`,
  },
  progress: {
    importCode: `import { ZardProgressComponent } from '@/shared/components/progress/progress.component';`,
    templateCode: `<z-progress [value]="60"></z-progress>`,
  },
  'radio-group': {
    importCode: `import { ZardRadioGroupImports } from '@/shared/components/radio-group/radio-group.imports';`,
    templateCode: `<z-radio-group [(value)]="selected">
  <z-radio value="one" />
  <z-radio value="two" />
</z-radio-group>`,
  },
  resizable: {
    importCode: `import { ZardResizableImports } from '@/shared/components/resizable/resizable.imports';`,
    templateCode: `<z-resizable>
  <z-resizable-panel>Panel One</z-resizable-panel>
  <z-resizable-handle />
  <z-resizable-panel>Panel Two</z-resizable-panel>
</z-resizable>`,
  },
  select: {
    importCode: `import { ZardSelectImports } from '@/shared/components/select/select.imports';`,
    templateCode: `<z-select zPlaceholder="Select a fruit">
  <z-select-item zValue="apple">Apple</z-select-item>
  <z-select-item zValue="banana">Banana</z-select-item>
  <z-select-item zValue="blueberry">Blueberry</z-select-item>
</z-select>`,
  },
  sheet: {
    importCode: `import { ZardSheetService } from '@/shared/components/sheet/sheet.service';`,
    templateCode: `<button type="button" z-button zType="outline" (click)="openSheet()">Open</button>`,
  },
  skeleton: {
    importCode: `import { ZardSkeletonComponent } from '@/shared/components/skeleton/skeleton.component';`,
    templateCode: `<z-skeleton class="h-4 w-[250px]"></z-skeleton>`,
  },
  slider: {
    importCode: `import { ZardSliderComponent } from '@/shared/components/slider/slider.component';`,
    templateCode: `<z-slider [zDefault]="50" [zMax]="100" [zStep]="1"></z-slider>`,
  },
  switch: {
    importCode: `import { ZardSwitchComponent } from '@/shared/components/switch/switch.component';`,
    templateCode: `<z-switch></z-switch>`,
  },
  table: {
    importCode: `import { ZardTableImports } from '@/shared/components/table/table.imports';`,
    templateCode: `<table z-table>
  <thead z-table-header>
    <tr z-table-row>
      <th z-table-head>Name</th>
      <th z-table-head>Status</th>
    </tr>
  </thead>
  <tbody z-table-body>
    <tr z-table-row>
      <td z-table-cell>Item 1</td>
      <td z-table-cell>Active</td>
    </tr>
  </tbody>
</table>`,
  },
  tabs: {
    importCode: `import { ZardTabComponent } from '@/shared/components/tabs/tab.component';
import { ZardTabGroupComponent } from '@/shared/components/tabs/tabs.component';`,
    templateCode: `<z-tab-group>
  <z-tab label="Account">Account content here.</z-tab>
  <z-tab label="Password">Password content here.</z-tab>
</z-tab-group>`,
  },
  sonner: {
    importCode: `import { ZardSonnerComponent } from '@/shared/components/sonner/sonner.component';`,
    templateCode: `<z-sonner />`,
  },
  toggle: {
    importCode: `import { ZardToggleComponent } from '@/shared/components/toggle/toggle.component';`,
    templateCode: `<z-toggle>Toggle</z-toggle>`,
  },
  'toggle-group': {
    importCode: `import { ZardToggleGroupComponent } from '@/shared/components/toggle-group/toggle-group.component';`,
    templateCode: `<z-toggle-group>
  <z-toggle value="bold">Bold</z-toggle>
  <z-toggle value="italic">Italic</z-toggle>
  <z-toggle value="underline">Underline</z-toggle>
</z-toggle-group>`,
  },
  tooltip: {
    importCode: `import { ZardTooltipImports } from '@/shared/components/tooltip/tooltip.imports';`,
    templateCode: `<button z-button zType="outline" zTooltip="Add to library">Hover</button>`,
  },
  collapsible: {
    importCode: `import { ZardCollapsibleImports } from '@/shared/components/collapsible/collapsible.imports';`,
    templateCode: `<z-collapsible>
  <button z-collapsible-trigger>Toggle</button>
  <z-collapsible-content>Content</z-collapsible-content>
</z-collapsible>`,
  },
  sidebar: {
    importCode: `import { ZardSidebarImports } from '@/shared/components/sidebar/sidebar.imports';`,
    templateCode: `<z-sidebar-provider>
  <z-sidebar>
    <div z-sidebar-header></div>
    <z-sidebar-content>
      <div z-sidebar-group></div>
    </z-sidebar-content>
    <div z-sidebar-footer></div>
  </z-sidebar>
  <main z-sidebar-inset>
    <button z-sidebar-trigger></button>
  </main>
</z-sidebar-provider>`,
  },
  drawer: {
    importCode: `import { ZardDrawerImports } from '@/shared/components/drawer/drawer.imports';`,
    templateCode: `<button type="button" z-button zType="outline" (click)="visible.set(true)">Open</button>

<z-drawer [(zVisible)]="visible">
  <z-drawer-header>
    <z-drawer-title>Are you absolutely sure?</z-drawer-title>
    <z-drawer-description>This action cannot be undone.</z-drawer-description>
  </z-drawer-header>

  <div class="p-4"><!-- Content here --></div>

  <z-drawer-footer>
    <button type="button" z-button>Submit</button>
    <button type="button" z-button zType="outline" z-drawer-close>Cancel</button>
  </z-drawer-footer>
</z-drawer>`,
  },
  bubble: {
    importCode: `import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';`,
    templateCode: `<z-bubble>
  <z-bubble-content>I checked the registry output and removed the stale route.</z-bubble-content>
  <z-bubble-reactions>
    <span>👍</span>
  </z-bubble-reactions>
</z-bubble>`,
  },
  'context-menu': {
    importCode: `import { ZardContextMenuImports } from '@/shared/components/context-menu/context-menu.imports';`,
    templateCode: `<div z-context-menu [zContextMenuTriggerFor]="menu">Right click here</div>

<z-dropdown-menu-content #menu="zDropdownMenuContent" class="w-48">
  <z-dropdown-menu-item>Back</z-dropdown-menu-item>
  <z-dropdown-menu-item>Reload</z-dropdown-menu-item>
  <z-dropdown-menu-separator />
  <z-dropdown-menu-item zType="destructive">Delete</z-dropdown-menu-item>
</z-dropdown-menu-content>`,
  },
  message: {
    importCode: `import { ZardMessageImports } from '@/shared/components/message/message.imports';`,
    templateCode: `<z-message zSrc="https://github.com/srizzon.png" zAlt="@srizzon" zVariant="muted">
  How can I help you today?
</z-message>`,
  },
};
