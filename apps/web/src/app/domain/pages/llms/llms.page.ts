import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';

@Component({
  selector: 'z-llms',
  standalone: true,
  template: '',
})
export class LlmsPage implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly document = inject(DOCUMENT);

  ngOnInit(): void {
    // Fetch and display the llms.txt content as plain text
    this.http.get('/llms.txt', { responseType: 'text' }).subscribe(content => {
      // Clear the body and display as plain text
      const body = this.document.body;
      body.innerHTML = '';
      const pre = this.document.createElement('pre');
      pre.style.fontFamily = 'monospace';
      pre.style.whiteSpace = 'pre-wrap';
      pre.style.margin = '20px';
      pre.textContent = content;
      body.appendChild(pre);
    });
  }
}
