import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ZardSelectItemComponent } from '../select-item.component';
import { ZardSelectComponent } from '../select.component';

@Component({
  standalone: true,
  imports: [ZardSelectComponent, ZardSelectItemComponent, FormsModule, ReactiveFormsModule, JsonPipe],
  template: `
    <div class="flex flex-col gap-6">
      <div class="space-y-2">
        <label class="text-sm font-medium">Select com ngModel</label>
        <z-select placeholder="Escolha uma linguagem" [(ngModel)]="selectedLanguage">
          <z-select-item value="typescript">TypeScript</z-select-item>
          <z-select-item value="javascript">JavaScript</z-select-item>
          <z-select-item value="python">Python</z-select-item>
          <z-select-item value="java">Java</z-select-item>
          <z-select-item value="csharp">C#</z-select-item>
        </z-select>
        <p class="text-sm text-muted-foreground">Selecionado: {{ selectedLanguage() }}</p>
      </div>

      <div class="space-y-2">
        <label class="text-sm font-medium">Select com Reactive Forms</label>
        <form [formGroup]="userForm" class="space-y-4">
          <z-select placeholder="Escolha seu país" formControlName="country">
            <z-select-item value="br">Brasil</z-select-item>
            <z-select-item value="us">Estados Unidos</z-select-item>
            <z-select-item value="uk">Reino Unido</z-select-item>
            <z-select-item value="ca">Canadá</z-select-item>
            <z-select-item value="au">Austrália</z-select-item>
          </z-select>

          <z-select placeholder="Escolha sua experiência" formControlName="experience">
            <z-select-item value="junior">Júnior (0-2 anos)</z-select-item>
            <z-select-item value="mid">Pleno (2-5 anos)</z-select-item>
            <z-select-item value="senior">Sênior (5+ anos)</z-select-item>
            <z-select-item value="lead">Tech Lead</z-select-item>
          </z-select>
        </form>
        <p class="text-sm text-muted-foreground">Form Value: {{ userForm.value | json }}</p>
      </div>
    </div>
  `,
})
export class ZardDemoSelectFormsComponent {
  selectedLanguage = signal('');

  userForm = new FormGroup({
    country: new FormControl(''),
    experience: new FormControl(''),
  });
}
