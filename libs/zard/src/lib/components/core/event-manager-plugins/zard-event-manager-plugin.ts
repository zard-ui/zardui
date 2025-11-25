import type { ListenerOptions } from '@angular/core';
import { EventManagerPlugin } from '@angular/platform-browser';

export class ZardEventManagerPlugin extends EventManagerPlugin {
  #keywords = ['prevent', 'stop', 'stop-immediate', 'prevent-with-stop'];

  override supports(eventName: string): boolean {
    return this.#keywords.some(keyword => eventName.endsWith(`.${keyword}`));
  }

  override addEventListener(
    element: HTMLElement,
    eventName: string,
    handler: (event: Event) => void,
    options?: ListenerOptions,
    // eslint-disable-next-line
  ): Function {
    const { event, keyword } = this.#provideEventFrom(eventName, this.#keywords);
    return this.manager.addEventListener(
      element,
      event,
      (event: Event) => {
        switch (keyword) {
          case 'stop':
            event.stopPropagation();
            break;
          case 'stop-immediate':
            event.stopImmediatePropagation();
            break;
          case 'prevent-with-stop':
            event.preventDefault();
            event.stopPropagation();
            break;
          default:
            event.preventDefault();
            break;
        }
        handler(event);
      },
      options,
    );
  }

  #provideEventFrom(eventName: string, keywords: string[]): { event: string; keyword: string } {
    const eventNameSubstrings = eventName.split('.');
    let event = '';
    let keyword = '';
    for (const substring of eventNameSubstrings) {
      if (keywords.includes(substring)) {
        keyword = substring;
        break;
      }

      if (!event) {
        event = substring;
      } else {
        event += `.${substring}`;
      }
    }

    return { event, keyword };
  }
}
