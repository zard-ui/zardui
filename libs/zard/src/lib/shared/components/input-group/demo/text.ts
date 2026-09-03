import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZardInputGroupImports } from '@/shared/components/input-group/input-group.imports';
import { ZardTextareaComponent } from '@/shared/components/textarea/textarea.component';

@Component({
  selector: 'z-demo-input-group-text',
  imports: [ZardInputComponent, ZardTextareaComponent, ...ZardInputGroupImports],
  template: `
    <div class="grid w-full min-w-sm gap-6">
      <z-input-group>
        <z-input-group-addon><span z-input-group-text>$</span></z-input-group-addon>
        <input z-input id="input-group-text-amount" placeholder="0.00" />
        <z-input-group-addon zAlign="inline-end"><span z-input-group-text>USD</span></z-input-group-addon>
      </z-input-group>
      <z-input-group>
        <z-input-group-addon><span z-input-group-text>https://</span></z-input-group-addon>
        <input z-input id="input-group-text-domain" placeholder="example.com" class="pl-0.5!" />
        <z-input-group-addon zAlign="inline-end"><span z-input-group-text>.com</span></z-input-group-addon>
      </z-input-group>
      <z-input-group>
        <input z-input id="input-group-text-username" placeholder="Enter your username" />
        <z-input-group-addon zAlign="inline-end">
          <span z-input-group-text>&#64;company.com</span>
        </z-input-group-addon>
      </z-input-group>
      <z-input-group>
        <textarea z-textarea id="input-group-text-message" placeholder="Enter your message"></textarea>
        <z-input-group-addon zAlign="block-end">
          <span z-input-group-text class="text-muted-foreground text-xs">120 characters left</span>
        </z-input-group-addon>
      </z-input-group>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoInputGroupTextComponent {}
