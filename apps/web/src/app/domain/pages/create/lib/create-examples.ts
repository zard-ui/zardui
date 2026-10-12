import type { Type } from '@angular/core';

/** One page of the preview's Components group: a port of a shadcn/ui `*-example`, loaded when it is opened. */
export interface CreateExample {
  /** The item id after `component:`; shadcn's example name without `-example`. */
  readonly name: string;
  readonly title: string;
  readonly load: () => Promise<Type<unknown>>;
}

/** shadcn/ui's examples for the components zard has, in the same order and with the same titles. */
export const CREATE_EXAMPLES: readonly CreateExample[] = [
  {
    name: 'accordion',
    title: 'Accordion',
    load: () =>
      import('@doc/domain/pages/create/examples/accordion-example.component').then(m => m.AccordionExampleComponent),
  },
  {
    name: 'alert',
    title: 'Alert',
    load: () => import('@doc/domain/pages/create/examples/alert-example.component').then(m => m.AlertExampleComponent),
  },
  {
    name: 'alert-dialog',
    title: 'Alert Dialog',
    load: () =>
      import('@doc/domain/pages/create/examples/alert-dialog-example.component').then(
        m => m.AlertDialogExampleComponent,
      ),
  },
  {
    name: 'aspect-ratio',
    title: 'Aspect Ratio',
    load: () =>
      import('@doc/domain/pages/create/examples/aspect-ratio-example.component').then(
        m => m.AspectRatioExampleComponent,
      ),
  },
  {
    name: 'attachment',
    title: 'Attachment',
    load: () =>
      import('@doc/domain/pages/create/examples/attachment-example.component').then(m => m.AttachmentExampleComponent),
  },
  {
    name: 'avatar',
    title: 'Avatar',
    load: () =>
      import('@doc/domain/pages/create/examples/avatar-example.component').then(m => m.AvatarExampleComponent),
  },
  {
    name: 'badge',
    title: 'Badge',
    load: () => import('@doc/domain/pages/create/examples/badge-example.component').then(m => m.BadgeExampleComponent),
  },
  {
    name: 'breadcrumb',
    title: 'Breadcrumb',
    load: () =>
      import('@doc/domain/pages/create/examples/breadcrumb-example.component').then(m => m.BreadcrumbExampleComponent),
  },
  {
    name: 'bubble',
    title: 'Bubble',
    load: () =>
      import('@doc/domain/pages/create/examples/bubble-example.component').then(m => m.BubbleExampleComponent),
  },
  {
    name: 'button',
    title: 'Button',
    load: () =>
      import('@doc/domain/pages/create/examples/button-example.component').then(m => m.ButtonExampleComponent),
  },
  {
    name: 'button-group',
    title: 'Button Group',
    load: () =>
      import('@doc/domain/pages/create/examples/button-group-example.component').then(
        m => m.ButtonGroupExampleComponent,
      ),
  },
  {
    name: 'calendar',
    title: 'Calendar',
    load: () =>
      import('@doc/domain/pages/create/examples/calendar-example.component').then(m => m.CalendarExampleComponent),
  },
  {
    name: 'card',
    title: 'Card',
    load: () => import('@doc/domain/pages/create/examples/card-example.component').then(m => m.CardExampleComponent),
  },
  {
    name: 'carousel',
    title: 'Carousel',
    load: () =>
      import('@doc/domain/pages/create/examples/carousel-example.component').then(m => m.CarouselExampleComponent),
  },
  {
    name: 'chart',
    title: 'Chart',
    load: () => import('@doc/domain/pages/create/examples/chart-example.component').then(m => m.ChartExampleComponent),
  },
  {
    name: 'checkbox',
    title: 'Checkbox',
    load: () =>
      import('@doc/domain/pages/create/examples/checkbox-example.component').then(m => m.CheckboxExampleComponent),
  },
  {
    name: 'collapsible',
    title: 'Collapsible',
    load: () =>
      import('@doc/domain/pages/create/examples/collapsible-example.component').then(
        m => m.CollapsibleExampleComponent,
      ),
  },
  {
    name: 'combobox',
    title: 'Combobox',
    load: () =>
      import('@doc/domain/pages/create/examples/combobox-example.component').then(m => m.ComboboxExampleComponent),
  },
  {
    name: 'command',
    title: 'Command',
    load: () =>
      import('@doc/domain/pages/create/examples/command-example.component').then(m => m.CommandExampleComponent),
  },
  {
    name: 'context-menu',
    title: 'Context Menu',
    load: () =>
      import('@doc/domain/pages/create/examples/context-menu-example.component').then(
        m => m.ContextMenuExampleComponent,
      ),
  },
  {
    name: 'dialog',
    title: 'Dialog',
    load: () =>
      import('@doc/domain/pages/create/examples/dialog-example.component').then(m => m.DialogExampleComponent),
  },
  {
    name: 'drawer',
    title: 'Drawer',
    load: () =>
      import('@doc/domain/pages/create/examples/drawer-example.component').then(m => m.DrawerExampleComponent),
  },
  {
    name: 'dropdown-menu',
    title: 'Dropdown Menu',
    load: () =>
      import('@doc/domain/pages/create/examples/dropdown-menu-example.component').then(
        m => m.DropdownMenuExampleComponent,
      ),
  },
  {
    name: 'empty',
    title: 'Empty',
    load: () => import('@doc/domain/pages/create/examples/empty-example.component').then(m => m.EmptyExampleComponent),
  },
  {
    name: 'field',
    title: 'Field',
    load: () => import('@doc/domain/pages/create/examples/field-example.component').then(m => m.FieldExampleComponent),
  },
  {
    name: 'hover-card',
    title: 'Hover Card',
    load: () =>
      import('@doc/domain/pages/create/examples/hover-card-example.component').then(m => m.HoverCardExampleComponent),
  },
  {
    name: 'input',
    title: 'Input',
    load: () => import('@doc/domain/pages/create/examples/input-example.component').then(m => m.InputExampleComponent),
  },
  {
    name: 'input-group',
    title: 'Input Group',
    load: () =>
      import('@doc/domain/pages/create/examples/input-group-example.component').then(m => m.InputGroupExampleComponent),
  },
  {
    name: 'input-otp',
    title: 'Input OTP',
    load: () =>
      import('@doc/domain/pages/create/examples/input-otp-example.component').then(m => m.InputOtpExampleComponent),
  },
  {
    name: 'item',
    title: 'Item',
    load: () => import('@doc/domain/pages/create/examples/item-example.component').then(m => m.ItemExampleComponent),
  },
  {
    name: 'kbd',
    title: 'Kbd',
    load: () => import('@doc/domain/pages/create/examples/kbd-example.component').then(m => m.KbdExampleComponent),
  },
  {
    name: 'marker',
    title: 'Marker',
    load: () =>
      import('@doc/domain/pages/create/examples/marker-example.component').then(m => m.MarkerExampleComponent),
  },
  {
    name: 'message',
    title: 'Message',
    load: () =>
      import('@doc/domain/pages/create/examples/message-example.component').then(m => m.MessageExampleComponent),
  },
  {
    name: 'navigation-menu',
    title: 'Navigation Menu',
    load: () =>
      import('@doc/domain/pages/create/examples/navigation-menu-example.component').then(
        m => m.NavigationMenuExampleComponent,
      ),
  },
  {
    name: 'pagination',
    title: 'Pagination',
    load: () =>
      import('@doc/domain/pages/create/examples/pagination-example.component').then(m => m.PaginationExampleComponent),
  },
  {
    name: 'popover',
    title: 'Popover',
    load: () =>
      import('@doc/domain/pages/create/examples/popover-example.component').then(m => m.PopoverExampleComponent),
  },
  {
    name: 'progress',
    title: 'Progress',
    load: () =>
      import('@doc/domain/pages/create/examples/progress-example.component').then(m => m.ProgressExampleComponent),
  },
  {
    name: 'radio-group',
    title: 'Radio Group',
    load: () =>
      import('@doc/domain/pages/create/examples/radio-group-example.component').then(m => m.RadioGroupExampleComponent),
  },
  {
    name: 'resizable',
    title: 'Resizable',
    load: () =>
      import('@doc/domain/pages/create/examples/resizable-example.component').then(m => m.ResizableExampleComponent),
  },
  {
    name: 'select',
    title: 'Select',
    load: () =>
      import('@doc/domain/pages/create/examples/select-example.component').then(m => m.SelectExampleComponent),
  },
  {
    name: 'separator',
    title: 'Separator',
    load: () =>
      import('@doc/domain/pages/create/examples/separator-example.component').then(m => m.SeparatorExampleComponent),
  },
  {
    name: 'sheet',
    title: 'Sheet',
    load: () => import('@doc/domain/pages/create/examples/sheet-example.component').then(m => m.SheetExampleComponent),
  },
  {
    name: 'sidebar',
    title: 'Sidebar',
    load: () =>
      import('@doc/domain/pages/create/examples/sidebar-example.component').then(m => m.SidebarExampleComponent),
  },
  {
    name: 'sidebar-icon',
    title: 'Sidebar (Icon)',
    load: () =>
      import('@doc/domain/pages/create/examples/sidebar-icon-example.component').then(
        m => m.SidebarIconExampleComponent,
      ),
  },
  {
    name: 'sidebar-inset',
    title: 'Sidebar (Inset)',
    load: () =>
      import('@doc/domain/pages/create/examples/sidebar-inset-example.component').then(
        m => m.SidebarInsetExampleComponent,
      ),
  },
  {
    name: 'sidebar-floating',
    title: 'Sidebar (Floating)',
    load: () =>
      import('@doc/domain/pages/create/examples/sidebar-floating-example.component').then(
        m => m.SidebarFloatingExampleComponent,
      ),
  },
  {
    name: 'skeleton',
    title: 'Skeleton',
    load: () =>
      import('@doc/domain/pages/create/examples/skeleton-example.component').then(m => m.SkeletonExampleComponent),
  },
  {
    name: 'slider',
    title: 'Slider',
    load: () =>
      import('@doc/domain/pages/create/examples/slider-example.component').then(m => m.SliderExampleComponent),
  },
  {
    name: 'sonner',
    title: 'Sonner',
    load: () =>
      import('@doc/domain/pages/create/examples/sonner-example.component').then(m => m.SonnerExampleComponent),
  },
  {
    name: 'spinner',
    title: 'Spinner',
    load: () =>
      import('@doc/domain/pages/create/examples/spinner-example.component').then(m => m.SpinnerExampleComponent),
  },
  {
    name: 'switch',
    title: 'Switch',
    load: () =>
      import('@doc/domain/pages/create/examples/switch-example.component').then(m => m.SwitchExampleComponent),
  },
  {
    name: 'table',
    title: 'Table',
    load: () => import('@doc/domain/pages/create/examples/table-example.component').then(m => m.TableExampleComponent),
  },
  {
    name: 'tabs',
    title: 'Tabs',
    load: () => import('@doc/domain/pages/create/examples/tabs-example.component').then(m => m.TabsExampleComponent),
  },
  {
    name: 'textarea',
    title: 'Textarea',
    load: () =>
      import('@doc/domain/pages/create/examples/textarea-example.component').then(m => m.TextareaExampleComponent),
  },
  {
    name: 'toggle',
    title: 'Toggle',
    load: () =>
      import('@doc/domain/pages/create/examples/toggle-example.component').then(m => m.ToggleExampleComponent),
  },
  {
    name: 'toggle-group',
    title: 'Toggle Group',
    load: () =>
      import('@doc/domain/pages/create/examples/toggle-group-example.component').then(
        m => m.ToggleGroupExampleComponent,
      ),
  },
  {
    name: 'tooltip',
    title: 'Tooltip',
    load: () =>
      import('@doc/domain/pages/create/examples/tooltip-example.component').then(m => m.TooltipExampleComponent),
  },
];
