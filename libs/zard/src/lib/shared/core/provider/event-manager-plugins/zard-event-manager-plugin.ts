import type { ListenerOptions } from '@angular/core';
import { EventManagerPlugin } from '@angular/platform-browser';

/**
 * Angular EventManagerPlugin that provides event modifier syntax for templates.
 *
 * Supports modifiers: .prevent, .stop, .stop-immediate, .prevent-with-stop
 * Supports key filters: enter, escape, {enter,space}
 *
 * @example
 * Prevent default on any click
 * (click.prevent)="handler()"
 *
 * @example
 * Prevent default only on Enter key
 * (keydown.enter.prevent)="handler()"
 *
 * @example
 * Prevent default on more keys like Enter and Space key
 * (keydown.{enter,space}.prevent)="handler()"
 *
 * @example
 * Stop propagation
 * (click.stop)="handler()"
 */
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
        const isKeyboardEvent = event instanceof KeyboardEvent;
        const isElementDisabled = element.getAttribute('aria-disabled') === 'true';
        const shouldApplyModifier =
          (!keys.length || (isKeyboardEvent && keys.includes(event.key.toLowerCase()))) && !isElementDisabled;

        if (shouldApplyModifier) {
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
        keys = this.#extractKeys(substring);
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

  #extractKeys(substring: string): string[] {
    const stringList = substring.substring(1, substring.length - 1);
    return stringList
      .split(',')
      .map(raw => {
        const s = raw.toLowerCase().trim();
        return s === 'space' ? ' ' : s;
      })
      .filter(Boolean);
  }
}
