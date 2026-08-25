import { ComponentType } from '@angular/cdk/overlay';

import type { CodeBlockData, CodeTabData, ComponentUsageData } from '@highlight/types';

import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export interface ComponentInstallData {
  cliAdd?: CodeTabData;
  manualCode?: CodeBlockData[];
  manualDeps?: CodeTabData;
  register?: CodeBlockData;
}

export interface AboutData {
  title?: string;
  description: string;
  link?: { label: string; href: string };
}

export interface ComponentData {
  componentName: string;
  description: string;
  about?: AboutData;
  preview?: ExampleData;
  examples: ExampleData[];
  installData?: ComponentInstallData;
  usage?: ComponentUsageData;
  composition?: CodeBlockData;
  fullWidth?: boolean;
  api?: ApiSection[];
}

/** A standalone code block with an optional heading/description, shown around (or instead of) a demo. */
export interface CodeSnippet {
  title?: string;
  description?: string;
  codeData: CodeBlockData;
}

export interface ExampleData {
  name: string;
  description?: string;
  type?: string;
  column?: boolean;
  /** Optional: when omitted, the example renders as a code-only block (no live preview). */
  component?: ComponentType<unknown>;
  codeData?: CodeBlockData;
  /** Extra code block(s) rendered above the demo (below the example description). */
  codeBefore?: CodeSnippet | CodeSnippet[];
  /** Extra code block(s) rendered below the demo. */
  codeAfter?: CodeSnippet | CodeSnippet[];
  /** Optional CSS max-height (e.g. '28rem') overriding the default code block height. */
  codeHeight?: string;
  /** Optional CSS min-height (e.g. '32rem') overriding the default preview (component) area height. */
  previewHeight?: string;
  onlyDemo?: boolean;
  fullScreen?: boolean;
  fullWidth?: boolean;
  flexAlign?: 'start' | 'center' | 'end';
}

/** The groups the components are listed under, in `llms.txt` and anywhere else that needs them. */
export type ComponentCategory =
  | 'Form & Input'
  | 'Layout & Navigation'
  | 'Overlays & Dialogs'
  | 'Feedback & Status'
  | 'Display & Media'
  | 'Misc';

export interface ComponentRegistryEntry {
  componentName: string;
  description: string;
  category: ComponentCategory;
  fullWidth?: boolean;
  loadData: () => Promise<ComponentData>;
}

export const COMPONENTS_REGISTRY: ComponentRegistryEntry[] = [
  {
    componentName: 'accordion',
    description: 'A vertically stacked set of interactive headings that each reveal a section of content.',
    category: 'Layout & Navigation',
    loadData: () => import('@zard/components/accordion/demo/accordion').then(m => m.ACCORDION),
  },
  {
    componentName: 'alert',
    description: 'Displays a callout for user attention.',
    category: 'Feedback & Status',
    loadData: () => import('@zard/components/alert/demo/alert').then(m => m.ALERT),
  },
  {
    componentName: 'alert-dialog',
    description: 'A modal dialog that interrupts the user with important content and expects a response.',
    category: 'Overlays & Dialogs',
    loadData: () => import('@zard/components/alert-dialog/demo/alert-dialog').then(m => m.ALERT_DIALOG),
  },
  {
    componentName: 'avatar',
    description: 'An image element with a fallback for representing the user.',
    category: 'Display & Media',
    loadData: () => import('@zard/components/avatar/demo/avatar').then(m => m.AVATAR),
  },
  {
    componentName: 'badge',
    description: 'Displays a badge or a component that looks like a badge.',
    category: 'Feedback & Status',
    loadData: () => import('@zard/components/badge/demo/badge').then(m => m.BADGE),
  },
  {
    componentName: 'breadcrumb',
    description: 'Displays the path to the current resource using a hierarchy of links.',
    category: 'Layout & Navigation',
    loadData: () => import('@zard/components/breadcrumb/demo/breadcrumb').then(m => m.BREADCRUMB),
  },
  {
    componentName: 'bubble',
    description:
      'Displays conversational content in a message bubble. Supports variants, alignment, grouping, reactions, and collapsible content.',
    category: 'Display & Media',
    loadData: () => import('@zard/components/bubble/demo/bubble').then(m => m.BUBBLE),
  },
  {
    componentName: 'button',
    description: 'Displays a button or a component that looks like a button.',
    category: 'Form & Input',
    loadData: () => import('@zard/components/button/demo/button').then(m => m.BUTTON),
  },
  {
    componentName: 'button-group',
    description: 'Groups buttons together.',
    category: 'Form & Input',
    loadData: () => import('@zard/components/button-group/demo/button-group').then(m => m.BUTTON_GROUP),
  },
  {
    componentName: 'calendar',
    description: 'A calendar component that allows users to select a date or a range of dates.',
    category: 'Form & Input',
    loadData: () => import('@zard/components/calendar/demo/calendar').then(m => m.CALENDAR),
  },
  {
    componentName: 'card',
    description: 'Displays a card with header, content, and footer.',
    category: 'Display & Media',
    loadData: () => import('@zard/components/card/demo/card').then(m => m.CARD),
  },
  {
    componentName: 'carousel',
    description: 'A carousel with motion and swipe built using Embla.',
    category: 'Display & Media',
    loadData: () => import('@zard/components/carousel/demo/carousel').then(m => m.CAROUSEL),
  },
  {
    componentName: 'chart',
    description: 'Beautiful charts built with Apache ECharts. Copy and paste into your apps.',
    category: 'Display & Media',
    loadData: () => import('@zard/components/chart/demo/chart').then(m => m.CHART),
  },
  {
    componentName: 'checkbox',
    description: 'A control that allows the user to toggle between checked and not checked.',
    category: 'Form & Input',
    loadData: () => import('@zard/components/checkbox/demo/checkbox').then(m => m.CHECKBOX),
  },
  {
    componentName: 'collapsible',
    description: 'An interactive component which expands and collapses a panel.',
    category: 'Layout & Navigation',
    loadData: () => import('@zard/components/collapsible/demo/collapsible').then(m => m.COLLAPSIBLE),
  },
  {
    componentName: 'combobox',
    description: 'Autocomplete input and command palette with a list of suggestions.',
    category: 'Form & Input',
    loadData: () => import('@zard/components/combobox/demo/combobox').then(m => m.COMBOBOX),
  },
  {
    componentName: 'command',
    description: 'Fast, composable, unstyled command menu.',
    category: 'Overlays & Dialogs',
    loadData: () => import('@zard/components/command/demo/command').then(m => m.COMMAND),
  },
  {
    componentName: 'context-menu',
    description: 'Displays a menu of actions triggered by a right click.',
    category: 'Overlays & Dialogs',
    loadData: () => import('@zard/components/context-menu/demo/context-menu').then(m => m.CONTEXT_MENU),
  },
  {
    componentName: 'date-picker',
    description: 'A button that opens a calendar in a popover to pick one date, several dates, or a date range.',
    category: 'Form & Input',
    loadData: () => import('@zard/components/date-picker/demo/date-picker').then(m => m.DATE_PICKER),
  },
  {
    componentName: 'dialog',
    description:
      'A window overlaid on either the primary window or another dialog window, rendering the content underneath inert.',
    category: 'Overlays & Dialogs',
    loadData: () => import('@zard/components/dialog/demo/dialog').then(m => m.DIALOG),
  },
  {
    componentName: 'drawer',
    description: 'A draggable panel that slides in from an edge of the screen.',
    category: 'Overlays & Dialogs',
    loadData: () => import('@zard/components/drawer/demo/drawer').then(m => m.DRAWER),
  },
  {
    componentName: 'dropdown',
    description: 'Displays a menu to the user — such as a set of actions or functions — triggered by a button.',
    category: 'Overlays & Dialogs',
    loadData: () => import('@zard/components/dropdown/demo/dropdown').then(m => m.DROPDOWN),
  },
  {
    componentName: 'empty',
    description: 'Empty state placeholder when there is no data.',
    category: 'Feedback & Status',
    loadData: () => import('@zard/components/empty/demo/empty').then(m => m.EMPTY),
  },
  {
    componentName: 'field',
    description: 'Composable building blocks for accessible form layouts with labels, descriptions and errors.',
    category: 'Form & Input',
    loadData: () => import('@zard/components/field/demo/field').then(m => m.FIELD),
  },
  {
    componentName: 'input',
    description: 'Displays a form input field or a component that looks like an input field.',
    category: 'Form & Input',
    loadData: () => import('@zard/components/input/demo/input').then(m => m.INPUT),
  },
  {
    componentName: 'input-group',
    description: 'Groups input elements together with addons.',
    category: 'Form & Input',
    loadData: () => import('@zard/components/input-group/demo/input-group').then(m => m.INPUT_GROUP),
  },
  {
    componentName: 'input-otp',
    description: 'Accessible one-time password component with copy-paste functionality.',
    category: 'Form & Input',
    loadData: () => import('@zard/components/input-otp/demo/input-otp').then(m => m.INPUT_OTP),
  },
  {
    componentName: 'item',
    description: 'A versatile component for displaying content with media, title, description, and actions.',
    category: 'Misc',
    loadData: () => import('@zard/components/item/demo/item').then(m => m.ITEM),
  },
  {
    componentName: 'kbd',
    description: 'Displays a keyboard key or shortcut.',
    category: 'Misc',
    loadData: () => import('@zard/components/kbd/demo/kbd').then(m => m.KBD),
  },
  {
    componentName: 'marker',
    description: 'Displays an inline status, system note, bordered row, or labeled separator in a conversation.',
    category: 'Display & Media',
    loadData: () => import('@zard/components/marker/demo/marker').then(m => m.MARKER),
  },
  {
    componentName: 'message',
    description: 'Displays a message in a conversation, with optional avatar, header, footer, and alignment.',
    category: 'Display & Media',
    loadData: () => import('@zard/components/message/demo/message').then(m => m.MESSAGE),
  },
  {
    componentName: 'navigation-menu',
    description: 'A collection of links for navigating websites.',
    category: 'Layout & Navigation',
    loadData: () => import('@zard/components/navigation-menu/demo/navigation-menu').then(m => m.NAVIGATION_MENU),
  },
  {
    componentName: 'pagination',
    description: 'Pagination with page navigation, next and previous links.',
    category: 'Layout & Navigation',
    loadData: () => import('@zard/components/pagination/demo/pagination').then(m => m.PAGINATION),
  },
  {
    componentName: 'popover',
    description: 'Displays rich content in a portal, triggered by a button.',
    category: 'Overlays & Dialogs',
    loadData: () => import('@zard/components/popover/demo/popover').then(m => m.POPOVER),
  },
  {
    componentName: 'progress',
    description: 'Displays an indicator showing the completion progress of a task.',
    category: 'Feedback & Status',
    loadData: () => import('@zard/components/progress/demo/progress').then(m => m.PROGRESS),
  },
  {
    componentName: 'radio-group',
    description:
      'A set of checkable buttons—known as radio buttons—where no more than one of the buttons can be checked at a time.',
    category: 'Form & Input',
    loadData: () => import('@zard/components/radio-group/demo/radio-group').then(m => m.RADIO_GROUP),
  },
  {
    componentName: 'resizable',
    description: 'Accessible resizable panel groups and layouts with keyboard support.',
    category: 'Layout & Navigation',
    loadData: () => import('@zard/components/resizable/demo/resizable').then(m => m.RESIZABLE),
  },
  {
    componentName: 'select',
    description: 'Displays a list of options for the user to pick from — triggered by a button.',
    category: 'Form & Input',
    loadData: () => import('@zard/components/select/demo/select').then(m => m.SELECT),
  },
  {
    componentName: 'separator',
    description: 'Visually or semantically separates content.',
    category: 'Layout & Navigation',
    loadData: () => import('@zard/components/separator/demo/separator').then(m => m.SEPARATOR),
  },
  {
    componentName: 'sheet',
    description: 'Extends the Dialog component to display content that complements the main content of the screen.',
    category: 'Overlays & Dialogs',
    loadData: () => import('@zard/components/sheet/demo/sheet').then(m => m.SHEET),
  },
  {
    componentName: 'sidebar',
    description: 'A composable, themeable and customizable sidebar component.',
    category: 'Layout & Navigation',
    loadData: () => import('@zard/components/sidebar/demo/sidebar').then(m => m.SIDEBAR),
  },
  {
    componentName: 'skeleton',
    description: 'Use to show a placeholder while content is loading.',
    category: 'Feedback & Status',
    loadData: () => import('@zard/components/skeleton/demo/skeleton').then(m => m.SKELETON),
  },
  {
    componentName: 'slider',
    description: 'An input where the user selects a value from within a given range.',
    category: 'Form & Input',
    loadData: () => import('@zard/components/slider/demo/slider').then(m => m.SLIDER),
  },
  {
    componentName: 'sonner',
    description: 'An opinionated toast component for Angular.',
    category: 'Feedback & Status',
    loadData: () => import('@zard/components/sonner/demo/sonner').then(m => m.SONNER),
  },
  {
    componentName: 'spinner',
    description: 'Displays a loading spinner.',
    category: 'Feedback & Status',
    loadData: () => import('@zard/components/spinner/demo/spinner').then(m => m.SPINNER),
  },
  {
    componentName: 'switch',
    description: 'A control that allows the user to toggle between checked and not checked.',
    category: 'Form & Input',
    loadData: () => import('@zard/components/switch/demo/switch').then(m => m.SWITCH),
  },
  {
    componentName: 'table',
    description: 'A responsive table component.',
    category: 'Display & Media',
    loadData: () => import('@zard/components/table/demo/table').then(m => m.TABLE),
  },
  {
    componentName: 'tabs',
    description: 'A set of layered sections of content — known as tab panels — that are displayed one at a time.',
    category: 'Layout & Navigation',
    loadData: () => import('@zard/components/tabs/demo/tabs').then(m => m.TABS),
  },
  {
    componentName: 'textarea',
    description: 'Displays a multi-line text input field.',
    category: 'Form & Input',
    loadData: () => import('@zard/components/textarea/demo/textarea').then(m => m.TEXTAREA),
  },
  {
    componentName: 'toggle',
    description: 'A two-state button that can be either on or off.',
    category: 'Misc',
    loadData: () => import('@zard/components/toggle/demo/toggle').then(m => m.TOGGLE),
  },
  {
    componentName: 'toggle-group',
    description: 'A set of two-state buttons that can be toggled on or off.',
    category: 'Misc',
    loadData: () => import('@zard/components/toggle-group/demo/toggle-group').then(m => m.TOGGLE_GROUP),
  },
  {
    componentName: 'tooltip',
    description:
      'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
    category: 'Overlays & Dialogs',
    loadData: () => import('@zard/components/tooltip/demo/tooltip').then(m => m.TOOLTIP),
  },
  {
    componentName: 'hover-card',
    description: 'For sighted users to preview content available behind the link.',
    category: 'Overlays & Dialogs',
    loadData: () => import('@zard/components/hover-card/demo/hover-card').then(m => m.HOVER_CARD),
  },
];
