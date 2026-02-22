import { ComponentType } from '@angular/cdk/overlay';

export interface ComponentData {
  componentName: string;
  description: string;
  examples: ExampleData[];
  fullWidth?: boolean;
}

export interface ExampleData {
  name: string;
  description?: string;
  type?: string;
  column?: boolean;
  component: ComponentType<unknown>;
  onlyDemo?: boolean;
  fullScreen?: boolean;
  fullWidth?: boolean;
  flexAlign?: 'start' | 'center' | 'end';
}

export interface ComponentRegistryEntry {
  componentName: string;
  description: string;
  fullWidth?: boolean;
  loadData: () => Promise<ComponentData>;
}

export const COMPONENTS_REGISTRY: ComponentRegistryEntry[] = [
  {
    componentName: 'alert',
    description: 'Displays a callout for user attention.',
    loadData: () => import('@zard/components/alert/demo/alert').then(m => m.ALERT),
  },
  {
    componentName: 'alert-dialog',
    description: 'A modal dialog that interrupts the user with important content and expects a response.',
    loadData: () => import('@zard/components/alert-dialog/demo/alert-dialog').then(m => m.ALERT_DIALOG),
  },
  {
    componentName: 'accordion',
    description: 'A vertically stacked set of interactive headings that each reveal a section of content.',
    loadData: () => import('@zard/components/accordion/demo/accordion').then(m => m.ACCORDION),
  },
  {
    componentName: 'avatar',
    description: 'An image element with a fallback for representing the user.',
    loadData: () => import('@zard/components/avatar/demo/avatar').then(m => m.AVATAR),
  },
  {
    componentName: 'badge',
    description: 'Displays a badge or a component that looks like a badge.',
    loadData: () => import('@zard/components/badge/demo/badge').then(m => m.BADGE),
  },
  {
    componentName: 'button',
    description: 'Displays a button or a component that looks like a button.',
    loadData: () => import('@zard/components/button/demo/button').then(m => m.BUTTON),
  },
  {
    componentName: 'button-group',
    description: 'Groups buttons together.',
    loadData: () => import('@zard/components/button-group/demo/button-group').then(m => m.BUTTON_GROUP),
  },
  {
    componentName: 'breadcrumb',
    description: 'Displays the path to the current resource using a hierarchy of links.',
    loadData: () => import('@zard/components/breadcrumb/demo/breadcrumb').then(m => m.BREADCRUMB),
  },
  {
    componentName: 'calendar',
    description: 'A date field component that allows users to enter and edit date.',
    loadData: () => import('@zard/components/calendar/demo/calendar').then(m => m.CALENDAR),
  },
  {
    componentName: 'card',
    description: 'Displays a card with header, content, and footer.',
    loadData: () => import('@zard/components/card/demo/card').then(m => m.CARD),
  },
  {
    componentName: 'carousel',
    description: 'A carousel with motion and swipe built using Embla.',
    loadData: () => import('@zard/components/carousel/demo/carousel').then(m => m.CAROUSEL),
  },
  {
    componentName: 'checkbox',
    description: 'A control that allows the user to toggle between checked and not checked.',
    loadData: () => import('@zard/components/checkbox/demo/checkbox').then(m => m.CHECKBOX),
  },
  {
    componentName: 'combobox',
    description: 'Autocomplete input and command palette with a list of suggestions.',
    loadData: () => import('@zard/components/combobox/demo/combobox').then(m => m.COMBOBOX),
  },
  {
    componentName: 'command',
    description: 'Fast, composable, unstyled command menu.',
    loadData: () => import('@zard/components/command/demo/command').then(m => m.COMMAND),
  },
  {
    componentName: 'date-picker',
    description: 'A date picker component with range and presets.',
    loadData: () => import('@zard/components/date-picker/demo/date-picker').then(m => m.DATE_PICKER),
  },
  {
    componentName: 'dialog',
    description:
      'A window overlaid on either the primary window or another dialog window, rendering the content underneath inert.',
    loadData: () => import('@zard/components/dialog/demo/dialog').then(m => m.DIALOG),
  },
  {
    componentName: 'divider',
    description: 'Visually or semantically separates content.',
    loadData: () => import('@zard/components/divider/demo/divider').then(m => m.DIVIDER),
  },
  {
    componentName: 'dropdown',
    description: 'Displays a menu to the user — such as a set of actions or functions — triggered by a button.',
    loadData: () => import('@zard/components/dropdown/demo/dropdown').then(m => m.DROPDOWN),
  },
  {
    componentName: 'empty',
    description: 'Empty state placeholder when there is no data.',
    loadData: () => import('@zard/components/empty/demo/empty').then(m => m.EMPTY),
  },
  {
    componentName: 'form',
    description: 'Building forms with Angular reactive forms and Zard UI components.',
    loadData: () => import('@zard/components/form/demo/form').then(m => m.FORM),
  },
  {
    componentName: 'icon',
    description: 'A set of icons from Lucide.',
    loadData: () => import('@zard/components/icon/demo/icon').then(m => m.ICON),
  },
  {
    componentName: 'input',
    description: 'Displays a form input field or a component that looks like an input field.',
    loadData: () => import('@zard/components/input/demo/input').then(m => m.INPUT),
  },
  {
    componentName: 'input-group',
    description: 'Groups input elements together with addons.',
    loadData: () => import('@zard/components/input-group/demo/input-group').then(m => m.INPUT_GROUP),
  },
  {
    componentName: 'kbd',
    description: 'Displays a keyboard key or shortcut.',
    loadData: () => import('@zard/components/kbd/demo/kbd').then(m => m.KBD),
  },
  {
    componentName: 'layout',
    description: 'Layout components for building page structures.',
    loadData: () => import('@zard/components/layout/demo/layout').then(m => m.LAYOUT),
  },
  {
    componentName: 'loader',
    description: 'Displays a loading spinner.',
    loadData: () => import('@zard/components/loader/demo/loader').then(m => m.LOADER),
  },
  {
    componentName: 'menu',
    description: 'Displays a menu with a list of actions.',
    loadData: () => import('@zard/components/menu/demo/menu').then(m => m.MENU),
  },
  {
    componentName: 'pagination',
    description: 'Pagination with page navigation, next and previous links.',
    loadData: () => import('@zard/components/pagination/demo/pagination').then(m => m.PAGINATION),
  },
  {
    componentName: 'popover',
    description: 'Displays rich content in a portal, triggered by a button.',
    loadData: () => import('@zard/components/popover/demo/popover').then(m => m.POPOVER),
  },
  {
    componentName: 'progress-bar',
    description: 'Displays an indicator showing the completion progress of a task.',
    loadData: () => import('@zard/components/progress-bar/demo/progress-bar').then(m => m.PROGRESS_BAR),
  },
  {
    componentName: 'radio',
    description: 'A set of checkable buttons where no more than one can be checked at a time.',
    loadData: () => import('@zard/components/radio/demo/radio').then(m => m.RADIO),
  },
  {
    componentName: 'resizable',
    description: 'Accessible resizable panel groups and layouts with keyboard support.',
    loadData: () => import('@zard/components/resizable/demo/resizable').then(m => m.RESIZABLE),
  },
  {
    componentName: 'segmented',
    description: 'A set of two or more buttons that functions as a single control.',
    loadData: () => import('@zard/components/segmented/demo/segmented').then(m => m.SEGMENTED),
  },
  {
    componentName: 'select',
    description: 'Displays a list of options for the user to pick from — triggered by a button.',
    loadData: () => import('@zard/components/select/demo/select').then(m => m.SELECT),
  },
  {
    componentName: 'sheet',
    description: 'Extends the Dialog component to display content that complements the main content of the screen.',
    loadData: () => import('@zard/components/sheet/demo/sheet').then(m => m.SHEET),
  },
  {
    componentName: 'slider',
    description: 'An input where the user selects a value from within a given range.',
    loadData: () => import('@zard/components/slider/demo/slider').then(m => m.SLIDER),
  },
  {
    componentName: 'skeleton',
    description: 'Use to show a placeholder while content is loading.',
    loadData: () => import('@zard/components/skeleton/demo/skeleton').then(m => m.SKELETON),
  },
  {
    componentName: 'switch',
    description: 'A control that allows the user to toggle between checked and not checked.',
    loadData: () => import('@zard/components/switch/demo/switch').then(m => m.SWITCH),
  },
  {
    componentName: 'table',
    description: 'A responsive table component.',
    loadData: () => import('@zard/components/table/demo/table').then(m => m.TABLE),
  },
  {
    componentName: 'tabs',
    description: 'A set of layered sections of content — known as tab panels — that are displayed one at a time.',
    loadData: () => import('@zard/components/tabs/demo/tabs').then(m => m.TABS),
  },
  {
    componentName: 'toast',
    description: 'A succinct message that is displayed temporarily.',
    loadData: () => import('@zard/components/toast/demo/toast').then(m => m.TOAST),
  },
  {
    componentName: 'toggle',
    description: 'A two-state button that can be either on or off.',
    loadData: () => import('@zard/components/toggle/demo/toggle').then(m => m.TOGGLE),
  },
  {
    componentName: 'toggle-group',
    description: 'A set of two-state buttons that can be toggled on or off.',
    loadData: () => import('@zard/components/toggle-group/demo/toggle-group').then(m => m.TOGGLE_GROUP),
  },
  {
    componentName: 'tooltip',
    description:
      'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
    loadData: () => import('@zard/components/tooltip/demo/tooltip').then(m => m.TOOLTIP),
  },
];
