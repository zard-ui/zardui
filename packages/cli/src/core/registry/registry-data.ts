export type ComponentRegistry = {
  name: string;
  dependencies?: string[];
  devDependencies?: string[];
  registryDependencies?: string[];
  files: {
    name: string;
    content: string;
  }[];
};

export const registry: ComponentRegistry[] = [
  {
    name: 'core',
    files: [
      {
        name: 'directives/string-template-outlet/string-template-outlet.directive.ts',
        content: '',
      },
      {
        name: 'provider/event-manager-plugins/zard-debounce-event-manager-plugin.ts',
        content: '',
      },
      {
        name: 'provider/event-manager-plugins/zard-event-manager-plugin.ts',
        content: '',
      },
      {
        name: 'provider/services/dark-mode.ts',
        content: '',
      },
      {
        name: 'provider/providezard.ts',
        content: '',
      },
    ],
  },
  {
    name: 'layout',
    registryDependencies: ['core', 'icon'],
    files: [
      {
        name: 'layout.component.ts',
        content: '',
      },
      {
        name: 'layout.variants.ts',
        content: '',
      },
      {
        name: 'content.component.ts',
        content: '',
      },
      {
        name: 'footer.component.ts',
        content: '',
      },
      {
        name: 'header.component.ts',
        content: '',
      },
      {
        name: 'layout.module.ts',
        content: '',
      },
      {
        name: 'sidebar.component.ts',
        content: '',
      },
    ],
  },
  {
    name: 'button',
    registryDependencies: ['core', 'icon'],
    files: [
      {
        name: 'button.component.ts',
        content: '',
      },
      {
        name: 'button.variants.ts',
        content: '',
      },
    ],
  },
  {
    name: 'sheet',
    registryDependencies: ['button', 'core', 'icon'],
    files: [
      {
        name: 'sheet.component.ts',
        content: '',
      },
      {
        name: 'sheet.variants.ts',
        content: '',
      },
      {
        name: 'sheet-ref.ts',
        content: '',
      },
      {
        name: 'sheet.module.ts',
        content: '',
      },
      {
        name: 'sheet.service.ts',
        content: '',
      },
    ],
  },
  {
    name: 'card',
    registryDependencies: ['core'],
    files: [
      {
        name: 'card.component.ts',
        content: '',
      },
      {
        name: 'card.variants.ts',
        content: '',
      },
    ],
  },
  {
    name: 'empty',
    registryDependencies: ['core', 'icon'],
    files: [
      {
        name: 'empty.component.ts',
        content: '',
      },
      {
        name: 'empty.variants.ts',
        content: '',
      },
    ],
  },
  {
    name: 'badge',
    registryDependencies: ['core'],
    files: [
      {
        name: 'badge.component.ts',
        content: '',
      },
      {
        name: 'badge.variants.ts',
        content: '',
      },
    ],
  },
  {
    name: 'accordion',
    registryDependencies: ['core', 'icon'],
    files: [
      {
        name: 'accordion.component.ts',
        content: '',
      },
      {
        name: 'accordion-item.component.ts',
        content: '',
      },
      {
        name: 'accordion.variants.ts',
        content: '',
      },
    ],
  },
  {
    name: 'alert',
    registryDependencies: ['core', 'icon'],
    files: [
      {
        name: 'alert.component.ts',
        content: '',
      },
      {
        name: 'alert.variants.ts',
        content: '',
      },
    ],
  },
  {
    name: 'alert-dialog',
    registryDependencies: ['button', 'core'],
    files: [
      {
        name: 'alert-dialog.component.ts',
        content: '',
      },
      {
        name: 'alert-dialog.component.html',
        content: '',
      },
      {
        name: 'alert-dialog.service.ts',
        content: '',
      },
      {
        name: 'alert-dialog-ref.ts',
        content: '',
      },
      {
        name: 'alert-dialog.variants.ts',
        content: '',
      },
    ],
  },
  {
    name: 'avatar',
    registryDependencies: ['core', 'icon'],
    files: [
      {
        name: 'avatar.component.ts',
        content: '',
      },
      {
        name: 'avatar.variants.ts',
        content: '',
      },
    ],
  },
  {
    name: 'checkbox',
    registryDependencies: ['core', 'icon'],
    files: [
      {
        name: 'checkbox.component.ts',
        content: '',
      },
      {
        name: 'checkbox.variants.ts',
        content: '',
      },
    ],
  },
  {
    name: 'dialog',
    registryDependencies: ['button', 'core', 'icon'],
    files: [
      {
        name: 'dialog.component.ts',
        content: '',
      },
      {
        name: 'dialog.service.ts',
        content: '',
      },
      {
        name: 'dialog-ref.ts',
        content: '',
      },
      {
        name: 'dialog.variants.ts',
        content: '',
      },
    ],
  },
  {
    name: 'dropdown',
    registryDependencies: ['core'],
    files: [
      {
        name: 'dropdown.component.ts',
        content: '',
      },
      {
        name: 'dropdown-item.component.ts',
        content: '',
      },
      {
        name: 'dropdown-label.component.ts',
        content: '',
      },
      {
        name: 'dropdown-menu-content.component.ts',
        content: '',
      },
      {
        name: 'dropdown-shortcut.component.ts',
        content: '',
      },
      {
        name: 'dropdown-trigger.directive.ts',
        content: '',
      },
      {
        name: 'dropdown.module.ts',
        content: '',
      },
      {
        name: 'dropdown.service.ts',
        content: '',
      },
      {
        name: 'dropdown.variants.ts',
        content: '',
      },
    ],
  },
  {
    name: 'icon',
    registryDependencies: ['core'],
    files: [
      {
        name: 'icon.component.ts',
        content: '',
      },
      {
        name: 'icon.variants.ts',
        content: '',
      },
      {
        name: 'icons.ts',
        content: '',
      },
    ],
  },
  {
    name: 'input',
    registryDependencies: ['core'],
    files: [
      {
        name: 'input.directive.ts',
        content: '',
      },
      {
        name: 'input.variants.ts',
        content: '',
      },
    ],
  },
  {
    name: 'input-group',
    registryDependencies: ['core'],
    files: [
      {
        name: 'input-group.component.ts',
        content: '',
      },
      {
        name: 'input-group.variants.ts',
        content: '',
      },
    ],
  },
  {
    name: 'select',
    registryDependencies: ['badge', 'core', 'icon'],
    files: [
      {
        name: 'select.component.ts',
        content: '',
      },
      {
        name: 'select-item.component.ts',
        content: '',
      },
      {
        name: 'select.variants.ts',
        content: '',
      },
    ],
  },
  {
    name: 'switch',
    registryDependencies: ['core'],
    files: [
      {
        name: 'switch.component.ts',
        content: '',
      },
      {
        name: 'switch.variants.ts',
        content: '',
      },
    ],
  },
  {
    name: 'tabs',
    registryDependencies: ['button', 'core', 'icon'],
    files: [
      {
        name: 'tabs.component.ts',
        content: '',
      },
      {
        name: 'tabs.variants.ts',
        content: '',
      },
    ],
  },
  {
    name: 'toggle',
    registryDependencies: ['core'],
    files: [
      {
        name: 'toggle.component.ts',
        content: '',
      },
      {
        name: 'toggle.variants.ts',
        content: '',
      },
    ],
  },
  {
    name: 'tooltip',
    registryDependencies: ['core'],
    files: [
      {
        name: 'tooltip.ts',
        content: '',
      },
      {
        name: 'tooltip-positions.ts',
        content: '',
      },
      {
        name: 'tooltip.variants.ts',
        content: '',
      },
    ],
  },
  {
    name: 'breadcrumb',
    registryDependencies: ['core', 'icon'],
    files: [
      {
        name: 'breadcrumb.component.ts',
        content: '',
      },
      {
        name: 'breadcrumb.module.ts',
        content: '',
      },
      {
        name: 'breadcrumb.variants.ts',
        content: '',
      },
    ],
  },
  {
    name: 'divider',
    registryDependencies: ['core'],
    files: [
      {
        name: 'divider.component.ts',
        content: '',
      },
      {
        name: 'divider.variants.ts',
        content: '',
      },
    ],
  },
  {
    name: 'loader',
    registryDependencies: ['core'],
    files: [
      {
        name: 'loader.component.ts',
        content: '',
      },
      {
        name: 'loader.variants.ts',
        content: '',
      },
    ],
  },
  {
    name: 'progress-bar',
    registryDependencies: ['core'],
    files: [
      {
        name: 'progress-bar.component.ts',
        content: '',
      },
      {
        name: 'progress-bar.variants.ts',
        content: '',
      },
    ],
  },
  {
    name: 'radio',
    registryDependencies: ['core'],
    files: [
      {
        name: 'radio.component.ts',
        content: '',
      },
      {
        name: 'radio.variants.ts',
        content: '',
      },
    ],
  },
  {
    name: 'slider',
    registryDependencies: ['core'],
    files: [
      {
        name: 'slider.component.ts',
        content: '',
      },
      {
        name: 'slider.variants.ts',
        content: '',
      },
    ],
  },
  {
    name: 'calendar',
    registryDependencies: ['core', 'icon'],
    files: [
      {
        name: 'calendar.component.ts',
        content: '',
      },
      {
        name: 'calendar-grid.component.ts',
        content: '',
      },
      {
        name: 'calendar-navigation.component.ts',
        content: '',
      },
      {
        name: 'calendar.types.ts',
        content: '',
      },
      {
        name: 'calendar.utils.ts',
        content: '',
      },
      {
        name: 'calendar.variants.ts',
        content: '',
      },
    ],
  },
  {
    name: 'combobox',
    registryDependencies: ['button', 'command', 'core', 'popover', 'empty', 'input', 'icon'],
    files: [
      {
        name: 'combobox.component.ts',
        content: '',
      },
      {
        name: 'combobox.variants.ts',
        content: '',
      },
    ],
  },
  {
    name: 'command',
    registryDependencies: ['core', 'icon'],
    files: [
      {
        name: 'command.component.ts',
        content: '',
      },
      {
        name: 'command-input.component.ts',
        content: '',
      },
      {
        name: 'command-list.component.ts',
        content: '',
      },
      {
        name: 'command-empty.component.ts',
        content: '',
      },
      {
        name: 'command-option.component.ts',
        content: '',
      },
      {
        name: 'command-option-group.component.ts',
        content: '',
      },
      {
        name: 'command-divider.component.ts',
        content: '',
      },
      {
        name: 'command.module.ts',
        content: '',
      },
      {
        name: 'command.variants.ts',
        content: '',
      },
    ],
  },
  {
    name: 'date-picker',
    registryDependencies: ['button', 'calendar', 'core', 'popover', 'input', 'icon'],
    files: [
      {
        name: 'date-picker.component.ts',
        content: '',
      },
      {
        name: 'date-picker.variants.ts',
        content: '',
      },
    ],
  },
  {
    name: 'form',
    registryDependencies: ['core'],
    files: [
      {
        name: 'form.component.ts',
        content: '',
      },
      {
        name: 'form.module.ts',
        content: '',
      },
      {
        name: 'form.variants.ts',
        content: '',
      },
    ],
  },
  {
    name: 'pagination',
    registryDependencies: ['button', 'core', 'icon'],
    files: [
      {
        name: 'pagination.component.ts',
        content: '',
      },
      {
        name: 'pagination.module.ts',
        content: '',
      },
      {
        name: 'pagination.variants.ts',
        content: '',
      },
    ],
  },
  {
    name: 'popover',
    registryDependencies: ['core'],
    files: [
      {
        name: 'popover.component.ts',
        content: '',
      },
      {
        name: 'popover.variants.ts',
        content: '',
      },
    ],
  },
  {
    name: 'resizable',
    registryDependencies: ['core'],
    files: [
      {
        name: 'resizable.component.ts',
        content: '',
      },
      {
        name: 'resizable-panel.component.ts',
        content: '',
      },
      {
        name: 'resizable-handle.component.ts',
        content: '',
      },
      {
        name: 'resizable.variants.ts',
        content: '',
      },
    ],
  },
  {
    name: 'segmented',
    registryDependencies: ['core'],
    files: [
      {
        name: 'segmented.component.ts',
        content: '',
      },
      {
        name: 'segmented.variants.ts',
        content: '',
      },
    ],
  },
  {
    name: 'skeleton',
    registryDependencies: ['core'],
    files: [
      {
        name: 'skeleton.component.ts',
        content: '',
      },
      {
        name: 'skeleton.variants.ts',
        content: '',
      },
    ],
  },
  {
    name: 'table',
    registryDependencies: ['core'],
    files: [
      {
        name: 'table.component.ts',
        content: '',
      },
      {
        name: 'table.module.ts',
        content: '',
      },
      {
        name: 'table.variants.ts',
        content: '',
      },
    ],
  },
  {
    name: 'toast',
    dependencies: ['ngx-sonner'],
    registryDependencies: ['core'],
    files: [
      {
        name: 'toast.component.ts',
        content: '',
      },
      {
        name: 'toast.variants.ts',
        content: '',
      },
    ],
  },
  {
    name: 'toggle-group',
    registryDependencies: ['core', 'toggle', 'icon'],
    files: [
      {
        name: 'toggle-group.component.ts',
        content: '',
      },
      {
        name: 'toggle-group.variants.ts',
        content: '',
      },
    ],
  },
  {
    name: 'menu',
    registryDependencies: ['core'],
    files: [
      {
        name: 'menu.directive.ts',
        content: '',
      },
      {
        name: 'menu.variants.ts',
        content: '',
      },
      {
        name: 'menu-content.directive.ts',
        content: '',
      },
      {
        name: 'menu-item.directive.ts',
        content: '',
      },
      {
        name: 'menu-manager.service.ts',
        content: '',
      },
      {
        name: 'menu.module.ts',
        content: '',
      },
      {
        name: 'menu-positions.ts',
        content: '',
      },
    ],
  },
  {
    name: 'button-group',
    registryDependencies: ['core', 'divider'],
    files: [
      {
        name: 'button-group.component.ts',
        content: '',
      },
      {
        name: 'button-group.variants.ts',
        content: '',
      },
    ],
  },
  {
    name: 'kbd',
    registryDependencies: ['core'],
    files: [
      {
        name: 'kbd.component.ts',
        content: '',
      },
      {
        name: 'kbd-group.component.ts',
        content: '',
      },
      {
        name: 'kbd.variants.ts',
        content: '',
      },
    ],
  },
  {
    name: 'carousel',
    dependencies: [
      'embla-carousel-angular',
      'embla-carousel-autoplay',
      'embla-carousel-class-names',
      'embla-carousel-wheel-gestures',
    ],
    registryDependencies: ['button', 'core', 'icon'],
    files: [
      {
        name: 'carousel.component.ts',
        content: '',
      },
      {
        name: 'carousel.variants.ts',
        content: '',
      },
      {
        name: 'carousel-content.component.ts',
        content: '',
      },
      {
        name: 'carousel-item.component.ts',
        content: '',
      },
      {
        name: 'carousel-plugins.service.ts',
        content: '',
      },
      {
        name: 'carousel.module.ts',
        content: '',
      },
    ],
  },
];
