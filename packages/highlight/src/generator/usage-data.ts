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
  <z-breadcrumb-item label="Home" url="/"></z-breadcrumb-item>
  <z-breadcrumb-item label="Components" url="/docs/components"></z-breadcrumb-item>
  <z-breadcrumb-item label="Breadcrumb"></z-breadcrumb-item>
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
    templateCode: `<z-calendar></z-calendar>`,
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
  checkbox: {
    importCode: `import { ZardCheckboxComponent } from '@/shared/components/checkbox/checkbox.component';`,
    templateCode: `<z-checkbox zLabel="Accept terms and conditions"></z-checkbox>`,
  },
  combobox: {
    importCode: `import { ZardComboboxComponent } from '@/shared/components/combobox/combobox.component';`,
    templateCode: `<z-combobox [options]="options" placeholder="Select framework..."></z-combobox>`,
  },
  command: {
    importCode: `import { ZardCommandImports } from '@/shared/components/command/command.imports';`,
    templateCode: `<z-command>
  <z-command-input placeholder="Type a command..." />
  <z-command-list>
    <z-command-empty>No results found.</z-command-empty>
    <z-command-option-group label="Suggestions">
      <z-command-option>Calendar</z-command-option>
    </z-command-option-group>
  </z-command-list>
</z-command>`,
  },
  'date-picker': {
    importCode: `import { ZardDatePickerComponent } from '@/shared/components/date-picker/date-picker.component';`,
    templateCode: `<z-date-picker placeholder="Pick a date"></z-date-picker>`,
  },
  dialog: {
    importCode: `import { ZardDialogImports } from '@/shared/components/dialog/dialog.imports';`,
    templateCode: `<z-dialog zTitle="Edit profile" zDescription="Make changes to your profile here.">
  <p>Dialog content goes here.</p>
</z-dialog>`,
  },
  divider: {
    importCode: `import { ZardDividerComponent } from '@/shared/components/divider/divider.component';`,
    templateCode: `<z-divider></z-divider>`,
  },
  dropdown: {
    importCode: `import { ZardDropdownImports } from '@/shared/components/dropdown/dropdown.imports';`,
    templateCode: `<z-dropdown-menu>
  <button z-button zType="outline" zardDropdownTrigger>Open</button>
  <z-dropdown-menu-content>
    <z-dropdown-menu-item label="Profile"></z-dropdown-menu-item>
    <z-dropdown-menu-item label="Settings"></z-dropdown-menu-item>
  </z-dropdown-menu-content>
</z-dropdown-menu>`,
  },
  empty: {
    importCode: `import { ZardEmptyComponent } from '@/shared/components/empty/empty.component';`,
    templateCode: `<z-empty zTitle="No data" zDescription="There is no data to display."></z-empty>`,
  },
  form: {
    importCode: `import { ZardFormImports } from '@/shared/components/form/form.imports';`,
    templateCode: `<z-form-field>
  <z-form-label>Email</z-form-label>
  <z-form-control>
    <input z-input placeholder="email@example.com" />
  </z-form-control>
  <z-form-message>Enter your email address.</z-form-message>
</z-form-field>`,
  },
  input: {
    importCode: `import { ZardInputDirective } from '@/shared/components/input/input.directive';`,
    templateCode: `<input z-input type="text" placeholder="Email" />`,
  },
  'input-group': {
    importCode: `import { ZardInputGroupComponent } from '@/shared/components/input-group/input-group.component';`,
    templateCode: `<z-input-group zAddonBefore="https://">
  <input z-input placeholder="example.com" />
</z-input-group>`,
  },
  kbd: {
    importCode: `import { ZardKbdComponent } from '@/shared/components/kbd/kbd.component';`,
    templateCode: `<z-kbd>⌘ K</z-kbd>`,
  },
  layout: {
    importCode: `import { LayoutImports } from '@/shared/components/layout/layout.imports';`,
    templateCode: `<z-layout>
  <z-header>Header</z-header>
  <z-content>Content</z-content>
  <z-footer>Footer</z-footer>
</z-layout>`,
  },
  loader: {
    importCode: `import { ZardLoaderComponent } from '@/shared/components/loader/loader.component';`,
    templateCode: `<z-loader></z-loader>`,
  },
  menu: {
    importCode: `import { ZardMenuImports } from '@/shared/components/menu/menu.imports';`,
    templateCode: `<div zardContextMenu [zMenuContent]="menuContent">
  Right click here
</div>
<ng-template #menuContent>
  <div zardMenuItem>Back</div>
  <div zardMenuItem>Forward</div>
  <div zardMenuItem>Reload</div>
</ng-template>`,
  },
  pagination: {
    importCode: `import { ZardPaginationImports } from '@/shared/components/pagination/pagination.imports';`,
    templateCode: `<z-pagination [zTotal]="100" [zPageSize]="10"></z-pagination>`,
  },
  popover: {
    importCode: `import { ZardPopoverDirective } from '@/shared/components/popover/popover.component';`,
    templateCode: `<button z-button [zPopover]="popoverContent">Open popover</button>
<ng-template #popoverContent>
  <p>Place content for the popover here.</p>
</ng-template>`,
  },
  'progress-bar': {
    importCode: `import { ZardProgressBarComponent } from '@/shared/components/progress-bar/progress-bar.component';`,
    templateCode: `<z-progress-bar [progress]="60"></z-progress-bar>`,
  },
  radio: {
    importCode: `import { ZardRadioComponent } from '@/shared/components/radio/radio.component';`,
    templateCode: `<z-radio name="option" [value]="'one'" zLabel="Option One"></z-radio>
<z-radio name="option" [value]="'two'" zLabel="Option Two"></z-radio>`,
  },
  resizable: {
    importCode: `import { ZardResizableImports } from '@/shared/components/resizable/resizable.imports';`,
    templateCode: `<z-resizable>
  <z-resizable-panel>Panel One</z-resizable-panel>
  <z-resizable-handle />
  <z-resizable-panel>Panel Two</z-resizable-panel>
</z-resizable>`,
  },
  segmented: {
    importCode: `import { ZardSegmentedComponent } from '@/shared/components/segmented/segmented.component';`,
    templateCode: `<z-segmented [zOptions]="[
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' }
]"></z-segmented>`,
  },
  select: {
    importCode: `import { ZardSelectImports } from '@/shared/components/select/select.imports';`,
    templateCode: `<z-select placeholder="Select a fruit">
  <z-select-item value="apple">Apple</z-select-item>
  <z-select-item value="banana">Banana</z-select-item>
  <z-select-item value="orange">Orange</z-select-item>
</z-select>`,
  },
  sheet: {
    importCode: `import { ZardSheetImports } from '@/shared/components/sheet/sheet.imports';`,
    templateCode: `<z-sheet
  zTitle="Edit profile"
  zDescription="Make changes to your profile here."
  zSide="right"
>
  <p>Sheet content goes here.</p>
</z-sheet>`,
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
  toast: {
    importCode: `import { ZardToastComponent } from '@/shared/components/toast/toast.component';`,
    templateCode: `<z-toaster />`,
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
  tree: {
    importCode: `import { ZardTreeImports } from '@/shared/components/tree/tree.imports';`,
    templateCode: `<z-tree [data]="treeData"></z-tree>`,
  },
};
