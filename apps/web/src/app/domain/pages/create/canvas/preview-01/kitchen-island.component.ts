import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSun, lucideThermometer, lucideTimer, lucideVolume2 } from '@ng-icons/lucide';

import { ZardCardImports } from '@zard/components/card';
import { ZardItemImports } from '@zard/components/item';
import { ZardSliderComponent } from '@zard/components/slider';
import { ZardSwitchComponent } from '@zard/components/switch';
import { ZardToggleGroupComponent, type ZardToggleGroupItem } from '@zard/components/toggle-group';

type Scene = 'cooking' | 'dining' | 'nightlight' | 'focus';
type Control = 'brightness' | 'colorTemp' | 'volume' | 'fade';

const SCENES: Record<Scene, Record<Control, number>> = {
  cooking: { brightness: 90, colorTemp: 70, volume: 30, fade: 0 },
  dining: { brightness: 50, colorTemp: 40, volume: 20, fade: 60 },
  nightlight: { brightness: 15, colorTemp: 20, volume: 0, fade: 80 },
  focus: { brightness: 100, colorTemp: 85, volume: 0, fade: 0 },
};

const SCENE_ITEMS: readonly { value: Scene; label: string }[] = [
  { value: 'cooking', label: 'Cooking' },
  { value: 'dining', label: 'Dining' },
  { value: 'nightlight', label: 'Nightlight' },
  { value: 'focus', label: 'Focus' },
];

const CONTROLS: readonly { key: Control; title: string; icon: string }[] = [
  { key: 'brightness', title: 'Brightness', icon: 'lucideSun' },
  { key: 'colorTemp', title: 'Color Temp', icon: 'lucideThermometer' },
  { key: 'volume', title: 'Volume', icon: 'lucideVolume2' },
  { key: 'fade', title: 'Fade', icon: 'lucideTimer' },
];

@Component({
  selector: 'z-preview-01-kitchen-island',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ZardCardImports,
    ZardItemImports,
    ZardSliderComponent,
    ZardSwitchComponent,
    ZardToggleGroupComponent,
    NgIcon,
  ],
  viewProviders: [provideIcons({ lucideSun, lucideThermometer, lucideTimer, lucideVolume2 })],
  template: `
    <z-card>
      <z-card-header>
        <z-card-title zTitle="Kitchen Island" />
        <z-card-description zDescription="Hue Color Ambient" />
        <z-card-action>
          <z-switch [(zChecked)]="enabled" />
        </z-card-action>
      </z-card-header>
      <z-card-content class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <span class="sr-only">Scenes</span>
          <z-toggle-group
            zMode="single"
            zType="outline"
            [zSpacing]="1"
            class="flex-wrap"
            [zItems]="sceneItems()"
            [zValue]="scene()"
            (valueChange)="selectScene($event)"
          />
        </div>
        <z-item-group>
          @for (control of controls; track control.key) {
            <z-item zSize="sm" zVariant="outline">
              <z-item-media zVariant="icon">
                <ng-icon [name]="control.icon" />
              </z-item-media>
              <z-item-content class="flex-row items-center gap-3">
                <z-item-title class="shrink-0">{{ control.title }}</z-item-title>
              </z-item-content>
              <z-item-actions class="flex-1">
                <z-slider
                  class="w-full"
                  zMax="100"
                  [zValue]="[values()[control.key]]"
                  [zDisabled]="!enabled()"
                  (zSlideIndexChange)="setValue(control.key, $event[0])"
                />
              </z-item-actions>
            </z-item>
          }
        </z-item-group>
      </z-card-content>
    </z-card>
  `,
})
export class Preview01KitchenIslandComponent {
  protected readonly controls = CONTROLS;
  protected readonly enabled = signal(true);
  protected readonly scene = signal<Scene>('cooking');
  protected readonly values = signal<Record<Control, number>>({ ...SCENES.cooking });

  protected readonly sceneItems = computed<ZardToggleGroupItem[]>(() =>
    SCENE_ITEMS.map(item => ({ ...item, disabled: !this.enabled() })),
  );

  protected selectScene(value: string | string[]): void {
    if (!value || Array.isArray(value)) return;
    const scene = value as Scene;
    this.scene.set(scene);
    this.values.set({ ...SCENES[scene] });
  }

  protected setValue(control: Control, value: number): void {
    this.values.update(values => ({ ...values, [control]: value }));
  }
}
