import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch } from '@ng-icons/lucide';

import { ZardEmptyComponent } from '@/shared/components/empty';
import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZardInputGroupImports } from '@/shared/components/input-group/input-group.imports';
import { ZardKbdComponent } from '@/shared/components/kbd/kbd.component';

@Component({
  selector: 'z-demo-empty-input-group',
  imports: [ZardEmptyComponent, ZardInputComponent, ZardKbdComponent, NgIcon, ...ZardInputGroupImports],
  template: `
    <z-empty
      class="[&_[data-slot=empty-content]]:flex-col"
      zTitle="404 - Not Found"
      zDescription="The page you're looking for doesn't exist. Try searching for what you need below."
      [zActions]="[searchInput, supportLink]"
    >
      <ng-template #searchInput>
        <z-input-group class="sm:w-3/4">
          <input z-input placeholder="Try searching for pages..." />
          <z-input-group-addon>
            <ng-icon name="lucideSearch" class="text-muted-foreground" />
          </z-input-group-addon>
          <z-input-group-addon zAlign="inline-end">
            <z-kbd>/</z-kbd>
          </z-input-group-addon>
        </z-input-group>
      </ng-template>

      <ng-template #supportLink>
        <p
          class="text-muted-foreground [&>a:hover]:text-primary text-sm/relaxed [&>a]:underline [&>a]:underline-offset-4"
        >
          Need help?
          <a href="#">Contact support</a>
        </p>
      </ng-template>
    </z-empty>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideSearch })],
})
export class ZardDemoEmptyInputGroupComponent {}
