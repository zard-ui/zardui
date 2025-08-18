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
    name: 'button',
    dependencies: ['class-variance-authority'],
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
    name: 'card',
    dependencies: ['class-variance-authority'],
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
    name: 'badge',
    dependencies: ['class-variance-authority'],
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
    name: 'alert',
    dependencies: ['class-variance-authority'],
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
    name: 'avatar',
    dependencies: ['class-variance-authority'],
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
    dependencies: ['class-variance-authority', '@angular/forms'],
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
    dependencies: ['class-variance-authority', '@angular/cdk'],
    registryDependencies: ['button'],
    files: [
      {
        name: 'dialog.component.ts',
        content: '',
      },
      {
        name: 'dialog.component.html',
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
    dependencies: ['class-variance-authority', '@angular/cdk'],
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
        name: 'dropdown.variants.ts',
        content: '',
      },
    ],
  },
  {
    name: 'input',
    dependencies: ['class-variance-authority', '@angular/forms'],
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
    name: 'select',
    dependencies: ['class-variance-authority', '@angular/forms', '@angular/cdk'],
    files: [
      {
        name: 'select.component.ts',
        content: '',
      },
      {
        name: 'select-option/select-option.component.ts',
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
    dependencies: ['class-variance-authority', '@angular/forms'],
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
    dependencies: ['class-variance-authority'],
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
    dependencies: ['class-variance-authority'],
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
    dependencies: ['class-variance-authority', '@angular/cdk'],
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
    name: 'accordion',
    dependencies: ['class-variance-authority', '@angular/cdk'],
    files: [
      {
        name: 'accordion.component.ts',
        content: '',
      },
      {
        name: 'accordion-item.component.ts',
        content: '',
      },
    ],
  },
  {
    name: 'breadcrumb',
    dependencies: ['class-variance-authority', '@angular/router'],
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
    dependencies: ['class-variance-authority'],
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
    dependencies: ['class-variance-authority'],
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
    dependencies: ['class-variance-authority'],
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
    dependencies: ['class-variance-authority', '@angular/forms'],
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
    dependencies: ['class-variance-authority', '@angular/forms'],
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
];

export function getRegistryComponent(name: string): ComponentRegistry | undefined {
  return registry.find(component => component.name === name);
}

export function getAllComponentNames(): string[] {
  return registry.map(component => component.name);
}
