import { ChangeDetectionStrategy, Component, computed, Input, OnInit, signal, ViewEncapsulation } from '@angular/core';

import { mergeClasses } from '../../shared/utils/utils';
import { dividerVariants, ZardDividerVariants } from './divider.variants';

@Component({
  selector: 'z-divider',
  standalone: true,
  exportAs: 'zDivider',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: '<div [class]="classes()" [attr.aria-orientation]="zOrientationSignal()" role="separator"></div>',
  host: {},
})
export class ZardDividerComponent implements OnInit {
  @Input() zOrientation: ZardDividerVariants['zOrientation'] = 'horizontal';
  @Input() class = '';

  readonly zOrientationSignal = signal<ZardDividerVariants['zOrientation']>('horizontal');
  private readonly classSignal = signal<string>('');

  protected readonly classes = computed(() => mergeClasses(dividerVariants({ zOrientation: this.zOrientationSignal() }), this.classSignal()));

  ngOnInit(): void {
    this.zOrientationSignal.set(this.zOrientation || 'horizontal');
    this.classSignal.set(this.class || '');
  }
}
