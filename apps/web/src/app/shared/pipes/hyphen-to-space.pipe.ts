import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hyphenToSpace',
  standalone: true,
})
export class HyphenToSpacePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return value;

    return value.replace(/-/g, ' ');
  }
}
