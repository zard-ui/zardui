import { ZardCommandDividerComponent } from '@/shared/components/command/command-divider.component';
import { ZardCommandEmptyComponent } from '@/shared/components/command/command-empty.component';
import { ZardCommandInputComponent } from '@/shared/components/command/command-input.component';
import { ZardCommandListComponent } from '@/shared/components/command/command-list.component';
import { ZardCommandOptionGroupComponent } from '@/shared/components/command/command-option-group.component';
import { ZardCommandOptionComponent } from '@/shared/components/command/command-option.component';
import { ZardCommandComponent } from '@/shared/components/command/command.component';

export const ZardCommandImports = [
  ZardCommandComponent,
  ZardCommandInputComponent,
  ZardCommandListComponent,
  ZardCommandEmptyComponent,
  ZardCommandOptionComponent,
  ZardCommandOptionGroupComponent,
  ZardCommandDividerComponent,
] as const;
