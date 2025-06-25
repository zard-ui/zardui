import { ClassValue } from 'class-variance-authority/dist/types';

import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import { mergeClasses } from '../../shared/utils/utils';
import { containerProgressBarVariants, progressBarVariants, ZardContainerProgressBarVariants, ZardProgressBarVariants } from './progress-bar.variants';

@Component({
  selector: 'z-progress-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styles: `
    @keyframes indeterminate {
      0% {
        left: -0%;
        width: 30%;
      }
      50% {
        left: 50%;
        width: 30%;
      }
      100% {
        left: 100%;
        width: 0;
      }
    }
  `,
  template: `
    @if (zIndeterminate()) {
      <div [class]="classes()">
        <div [class]="barClasses()"></div>
      </div>
    } @else {
      <div [class]="classes()">
        <div [style.width.%]="correctedProgress()" [class]="barClasses()" id="bar"></div>
      </div>
    }
  `,
  host: {
    class: 'w-full',
  },
})
export class ZardProgressBarComponent {
  readonly zType = input<ZardProgressBarVariants['zType']>('default');
  readonly zSize = input<ZardContainerProgressBarVariants['zSize']>('default');
  readonly zShape = input<ZardProgressBarVariants['zShape']>('default');
  readonly zIndeterminate = input<ZardProgressBarVariants['zIndeterminate']>(undefined);
  readonly class = input<ClassValue>('');
  readonly barClass = input<ClassValue>('');
  readonly progress = input(0);

  readonly correctedProgress = computed(() => {
    if (this.progress() > 100) return 100;
    if (this.progress() < 0) return 0;
    return this.progress();
  });

  protected readonly classes = computed(() =>
    mergeClasses(containerProgressBarVariants({ zIndeterminate: this.zIndeterminate(), zType: this.zType(), zSize: this.zSize(), zShape: this.zShape() }), this.class()),
  );

  protected readonly barClasses = computed(() =>
    mergeClasses(progressBarVariants({ zIndeterminate: this.zIndeterminate(), zType: this.zType(), zShape: this.zShape() }), this.barClass()),
  );
}
