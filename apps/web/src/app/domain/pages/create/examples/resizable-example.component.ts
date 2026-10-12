import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardResizableImports } from '@zard/components/resizable';

import { ExampleImports } from './example.component';

/** shadcn/ui's `resizable-example`, in zard. */
@Component({
  selector: 'z-resizable-example',
  imports: [ExampleImports, ZardResizableImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <z-example-wrapper>
      <z-example zTitle="Horizontal">
        <z-resizable class="style-lyra:rounded-none style-sera:rounded-none min-h-[200px] rounded-lg border">
          <z-resizable-panel [zDefaultSize]="25">
            <div class="flex h-full items-center justify-center p-6">
              <span class="font-semibold">Sidebar</span>
            </div>
          </z-resizable-panel>
          <z-resizable-handle />
          <z-resizable-panel [zDefaultSize]="75">
            <div class="flex h-full items-center justify-center p-6">
              <span class="font-semibold">Content</span>
            </div>
          </z-resizable-panel>
        </z-resizable>
      </z-example>

      <z-example zTitle="Vertical">
        <z-resizable
          zLayout="vertical"
          class="style-lyra:rounded-none style-sera:rounded-none min-h-[200px] rounded-lg border"
        >
          <z-resizable-panel [zDefaultSize]="25">
            <div class="flex h-full items-center justify-center p-6">
              <span class="font-semibold">Header</span>
            </div>
          </z-resizable-panel>
          <z-resizable-handle />
          <z-resizable-panel [zDefaultSize]="75">
            <div class="flex h-full items-center justify-center p-6">
              <span class="font-semibold">Content</span>
            </div>
          </z-resizable-panel>
        </z-resizable>
      </z-example>

      <z-example zTitle="With Handle">
        <z-resizable class="style-lyra:rounded-none style-sera:rounded-none min-h-[200px] rounded-lg border">
          <z-resizable-panel [zDefaultSize]="25">
            <div class="flex h-full items-center justify-center p-6">
              <span class="font-semibold">Sidebar</span>
            </div>
          </z-resizable-panel>
          <z-resizable-handle zWithHandle />
          <z-resizable-panel [zDefaultSize]="75">
            <div class="flex h-full items-center justify-center p-6">
              <span class="font-semibold">Content</span>
            </div>
          </z-resizable-panel>
        </z-resizable>
      </z-example>

      <z-example zTitle="Nested">
        <z-resizable class="style-lyra:rounded-none style-sera:rounded-none rounded-lg border">
          <z-resizable-panel [zDefaultSize]="50">
            <div class="flex h-[200px] items-center justify-center p-6">
              <span class="font-semibold">One</span>
            </div>
          </z-resizable-panel>
          <z-resizable-handle />
          <z-resizable-panel [zDefaultSize]="50">
            <z-resizable zLayout="vertical">
              <z-resizable-panel [zDefaultSize]="25">
                <div class="flex h-full items-center justify-center p-6">
                  <span class="font-semibold">Two</span>
                </div>
              </z-resizable-panel>
              <z-resizable-handle />
              <z-resizable-panel [zDefaultSize]="75">
                <div class="flex h-full items-center justify-center p-6">
                  <span class="font-semibold">Three</span>
                </div>
              </z-resizable-panel>
            </z-resizable>
          </z-resizable-panel>
        </z-resizable>
      </z-example>

      <z-example zTitle="Controlled">
        <z-resizable
          class="style-lyra:rounded-none style-sera:rounded-none min-h-[200px] rounded-lg border"
          (zResize)="layout.set($event.sizes)"
          (zResizeEnd)="layout.set($event.sizes)"
        >
          <z-resizable-panel [zDefaultSize]="30" [zMin]="20">
            <div class="flex h-full flex-col items-center justify-center gap-2 p-6">
              <span class="font-semibold">{{ round(layout()[0]) }}%</span>
            </div>
          </z-resizable-panel>
          <z-resizable-handle />
          <z-resizable-panel [zDefaultSize]="70" [zMin]="30">
            <div class="flex h-full flex-col items-center justify-center gap-2 p-6">
              <span class="font-semibold">{{ round(layout()[1]) }}%</span>
            </div>
          </z-resizable-panel>
        </z-resizable>
      </z-example>
    </z-example-wrapper>
  `,
})
export class ResizableExampleComponent {
  protected readonly layout = signal<number[]>([30, 70]);
  protected readonly round = Math.round;
}
