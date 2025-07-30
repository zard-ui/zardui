import { Component } from '@angular/core';

import { ZardSelectItemComponent } from '../select-item.component';
import { ZardSelectComponent } from '../select.component';

@Component({
  standalone: true,
  imports: [ZardSelectComponent, ZardSelectItemComponent],
  template: `
    <div class="flex flex-col gap-4">
      <div class="space-y-2">
        <label class="text-sm font-medium">Select com itens desabilitados</label>
        <z-select placeholder="Escolha um plano">
          <z-select-item value="free">Plano Gratuito</z-select-item>
          <z-select-item value="pro">Plano Pro</z-select-item>
          <z-select-item value="enterprise" [disabled]="true">Plano Enterprise (Em breve)</z-select-item>
          <z-select-item value="custom" [disabled]="true">Plano Customizado (Indisponível)</z-select-item>
        </z-select>
      </div>

      <div class="space-y-2">
        <label class="text-sm font-medium">Select com mix de estados</label>
        <z-select placeholder="Status do projeto">
          <z-select-item value="planning">🗂️ Planejamento</z-select-item>
          <z-select-item value="development">⚡ Em Desenvolvimento</z-select-item>
          <z-select-item value="testing">🧪 Em Testes</z-select-item>
          <z-select-item value="review" [disabled]="true">👀 Em Revisão (Bloqueado)</z-select-item>
          <z-select-item value="deployed">🚀 Implantado</z-select-item>
          <z-select-item value="archived" [disabled]="true">📦 Arquivado</z-select-item>
        </z-select>
      </div>
    </div>
  `,
})
export class ZardDemoSelectDisabledComponent {}
