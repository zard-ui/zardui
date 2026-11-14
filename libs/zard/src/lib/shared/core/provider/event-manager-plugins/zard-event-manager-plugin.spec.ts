import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';

import { ZardEventManagerPlugin } from './zard-event-manager-plugin';

@Component({
  template: `
    <button type="button" (keydown.{enter,space}.prevent)="calls.push($event.key)">Toggle</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class KeyListHostComponent {
  readonly calls: string[] = [];
}

describe('ZardEventManagerPlugin', () => {
  function press(button: HTMLElement, key: string): KeyboardEvent {
    const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
    button.dispatchEvent(event);
    return event;
  }

  it('runs a key-list handler only for the listed keys', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: EVENT_MANAGER_PLUGINS, useClass: ZardEventManagerPlugin, multi: true }],
    });
    const fixture = TestBed.createComponent(KeyListHostComponent);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button') as HTMLElement;

    const escape = press(button, 'Escape');
    const tab = press(button, 'Tab');
    const enter = press(button, 'Enter');
    const space = press(button, ' ');

    expect(fixture.componentInstance.calls).toEqual(['Enter', ' ']);
    expect(escape.defaultPrevented).toBe(false);
    expect(tab.defaultPrevented).toBe(false);
    expect(enter.defaultPrevented).toBe(true);
    expect(space.defaultPrevented).toBe(true);
  });
});
