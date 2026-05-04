import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCopy, lucideCornerDownLeft, lucideFileCode2, lucideRefreshCw } from '@ng-icons/lucide';

import { ZardInputGroupImports } from '@/shared/components/input-group/input-group.imports';
import { ZardTextareaComponent } from '@/shared/components/textarea/textarea.component';

@Component({
  selector: 'z-demo-input-group-textarea',
  imports: [ZardTextareaComponent, NgIcon, ...ZardInputGroupImports],
  template: `
    <div class="grid w-full min-w-md gap-4">
      <z-input-group>
        <textarea
          z-textarea
          id="textarea-code-32"
          placeholder="console.log('Hello, world!');"
          class="min-h-[200px]"
        ></textarea>
        <z-input-group-addon zAlign="block-end" class="border-t">
          <span z-input-group-text>Line 1, Column 1</span>
          <button type="button" z-input-group-button zVariant="default" zSize="sm" class="ml-auto">
            Run
            <ng-icon name="lucideCornerDownLeft" />
          </button>
        </z-input-group-addon>
        <z-input-group-addon zAlign="block-start" class="border-b">
          <span z-input-group-text class="font-mono font-medium">
            <ng-icon name="lucideFileCode2" />
            script.js
          </span>
          <button type="button" z-input-group-button zSize="icon-xs" class="ml-auto">
            <ng-icon name="lucideRefreshCw" />
          </button>
          <button type="button" z-input-group-button zSize="icon-xs">
            <ng-icon name="lucideCopy" />
          </button>
        </z-input-group-addon>
      </z-input-group>
    </div>
  `,
  viewProviders: [provideIcons({ lucideFileCode2, lucideCopy, lucideCornerDownLeft, lucideRefreshCw })],
})
export class ZardDemoInputGroupTextareaComponent {}
