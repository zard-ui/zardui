import { Component } from '@angular/core';

import { ZardComboboxComponent, ZardComboboxGroup, ZardComboboxOption } from '@ngzard/ui/combobox';

@Component({
  selector: 'zard-demo-combobox-grouped',
  imports: [ZardComboboxComponent],
  standalone: true,
  template: `
    <z-combobox
      [groups]="techGroups"
      placeholder="Select technology..."
      searchPlaceholder="Search technology..."
      emptyText="No technology found."
      (zOnSelect)="onSelect($event)"
    />
  `,
})
export class ZardDemoComboboxGroupedComponent {
  techGroups: ZardComboboxGroup[] = [
    {
      label: 'Frontend Frameworks',
      options: [
        { value: 'angular', label: 'Angular' },
        { value: 'react', label: 'React' },
        { value: 'vue', label: 'Vue.js' },
        { value: 'svelte', label: 'Svelte' },
      ],
    },
    {
      label: 'Backend Frameworks',
      options: [
        { value: 'nestjs', label: 'NestJS' },
        { value: 'express', label: 'Express' },
        { value: 'fastify', label: 'Fastify' },
        { value: 'koa', label: 'Koa' },
      ],
    },
    {
      label: 'Full-Stack Frameworks',
      options: [
        { value: 'nextjs', label: 'Next.js' },
        { value: 'nuxtjs', label: 'Nuxt.js' },
        { value: 'remix', label: 'Remix' },
        { value: 'sveltekit', label: 'SvelteKit' },
      ],
    },
  ];

  onSelect(option: ZardComboboxOption) {
    console.log('Selected:', option);
  }
}
