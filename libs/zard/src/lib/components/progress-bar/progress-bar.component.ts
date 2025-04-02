import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';
import { ClassValue } from 'class-variance-authority/dist/types';

import { mergeClasses } from '../../shared/utils/utils';
import { containerProgressBarVariants, progressBarVariants, ZardContainerProgressBarVariants, ZardProgressBarVariants } from './progress-bar.variants';

@Component({
  selector: 'z-progress-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div [class]="classes()">
      <div [style.width.%]="correctedProgress()" [class]="barClasses()"></div>
    </div>
  `,
})
export class ZardProgressBarComponent {
  readonly zType = input<ZardProgressBarVariants['zType']>('default');
  readonly zSize = input<ZardContainerProgressBarVariants['zSize']>('default');
  readonly zShape = input<ZardProgressBarVariants['zShape']>('default');

  readonly class = input<ClassValue>('');
  readonly barClass = input<ClassValue>('');
  readonly progress = input(0);

  readonly correctedProgress = computed(() => (this.progress() > 100 ? 100 : this.progress() < 0 ? 0 : this.progress()));

  protected readonly classes = computed(() => mergeClasses(containerProgressBarVariants({ zType: this.zType(), zSize: this.zSize(), zShape: this.zShape() }), this.class()));

  protected readonly barClasses = computed(() => mergeClasses(progressBarVariants({ zType: this.zType(), zShape: this.zShape() }), this.barClass()));
}
