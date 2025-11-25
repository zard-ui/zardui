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
    const { event, keyword, keys } = this.#provideEventFrom(eventName, this.#keywords);
    return this.manager.addEventListener(
      element,
      event,
      (event: Event) => {
        let isEventMatches = false;
        if (event instanceof KeyboardEvent) {
          isEventMatches = keys.includes(event.key.toLowerCase());
        }
        if (isEventMatches) {
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
        }
        handler(event);
      },
      options,
    );
  }

  #provideEventFrom(eventName: string, keywords: string[]): { event: string; keyword: string; keys: string[] } {
    const eventNameSubstrings = eventName.split('.');
    let event = '';
    let keys: string[] = [];
    let keyword = '';

    for (const substring of eventNameSubstrings) {
      if (substring.startsWith('{')) {
        keys = this.#extarctKeys(substring);
        continue;
      } else if (keywords.includes(substring)) {
        keyword = substring;
        break;
      } else if (!event) {
        event = substring;
      } else {
        event += `.${substring}`;
      }
    }

    return { event, keyword, keys };
  }

  #extarctKeys(substring: string): string[] {
    const stringList = substring.substring(1, substring.length - 1);
    return stringList.split(',').map(s => (s === 'space' ? ' ' : s.trim()));
  }
}
