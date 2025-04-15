import { Component } from '@angular/core';

import { ZardSelectModule } from '../select.module';

@Component({
  standalone: true,
  imports: [ZardSelectModule],
  template: `
    <z-select zStatus="success" placeholder="Selecione uma opção">
      <z-select-option label="Opção 1" value="1" />
      <z-select-option label="Opção 2" value="2" />
      <z-select-option label="Opção 3" value="3" />
    </z-select>
  `,
})
export class ZardDemoSelectBasicComponent {}
