import type { ListenerOptions } from '@angular/core';
import { EventManagerPlugin } from '@angular/platform-browser';

export class ZardDebounceEventManagerPlugin extends EventManagerPlugin {
  override supports(eventName: string): boolean {
    return /debounce/.test(eventName);
  }

  override addEventListener(
    element: HTMLElement,
    eventName: string,
    handler: (event: Event) => void,
    options?: ListenerOptions,
    // eslint-disable-next-line
  ): Function {
    const [event, , delay] = eventName.split('.');

    let timeoutId!: ReturnType<typeof setTimeout>;
    const listener = (event: Event) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => handler(event), Number.parseInt(delay) || 300);
    };
    return this.manager.addEventListener(element, event, listener, options);
  }
}
