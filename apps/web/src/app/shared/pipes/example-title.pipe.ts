import { Pipe, PipeTransform } from '@angular/core';

import { exampleTitle } from '../utils/example-title';

@Pipe({
  name: 'exampleTitle',
})
export class ExampleTitlePipe implements PipeTransform {
  transform(value: string): string {
    return value ? exampleTitle(value) : value;
  }
}
