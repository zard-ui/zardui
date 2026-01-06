import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';

import { take } from 'rxjs';

@Component({
  selector: 'z-llms',
  template: `
    <pre class="m-5 font-mono text-sm whitespace-pre-wrap">{{ content() }}</pre>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LlmsPage implements OnInit {
  private readonly http = inject(HttpClient);
  protected readonly content = signal('');

  ngOnInit(): void {
    // Fetch and display the llms.txt content as plain text
    this.http
      .get('/llms.txt', { responseType: 'text' })
      .pipe(take(1))
      .subscribe(content => this.content.set(content));
  }
}
