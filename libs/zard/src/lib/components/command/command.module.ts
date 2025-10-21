import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { ZardCommandOptionGroupComponent } from './command-option-group.component';
import { ZardCommandDividerComponent } from './command-divider.component';
import { ZardCommandOptionComponent } from './command-option.component';
import { ZardCommandInputComponent } from './command-input.component';
import { ZardCommandEmptyComponent } from './command-empty.component';
import { ZardCommandListComponent } from './command-list.component';
import { ZardCommandComponent } from './command.component';

const COMMAND_COMPONENTS = [
  ZardCommandComponent,
  ZardCommandInputComponent,
  ZardCommandListComponent,
  ZardCommandEmptyComponent,
  ZardCommandOptionComponent,
  ZardCommandOptionGroupComponent,
  ZardCommandDividerComponent,
];

@NgModule({
  imports: [FormsModule, ...COMMAND_COMPONENTS],
  exports: [...COMMAND_COMPONENTS],
})
export class ZardCommandModule {}
