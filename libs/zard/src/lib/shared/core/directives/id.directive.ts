import { Directive, inject, Injectable, input, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
class ZardIdInternalService {
  private counter = 0;
  generate(prefix: string) {
    return `${prefix}-${++this.counter}`;
  }
}

@Directive({
  selector: '[zardId]',
  exportAs: 'zardId',
})
export class ZardIdDirective {
  private idService = inject(ZardIdInternalService);

  readonly zardId = input('ssr');

  readonly id = computed(() => this.idService.generate(this.zardId()));
}
