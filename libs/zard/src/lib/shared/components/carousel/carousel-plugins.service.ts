import { Injectable } from '@angular/core';

/**
 * Service to create and manage Embla Carousel plugins
 */
@Injectable({
  providedIn: 'root',
})
export class ZardCarouselPluginsService {
  /**
   * Creates an autoplay plugin for the carousel
   */
  async createAutoplayPlugin(
    options: {
      delay?: number; // ms
      jump?: boolean;
      stopOnInteraction?: boolean;
      stopOnMouseEnter?: boolean;
      playOnInit?: boolean;
      rootNode?: (emblaRoot: HTMLElement) => HTMLElement | null;
    } = {},
  ) {
    try {
      const AutoplayModule = await import('embla-carousel-autoplay');
      const Autoplay = AutoplayModule.default;
      return Autoplay(options);
    } catch (err) {
      console.error('Error loading Autoplay plugin:', err);
      throw new Error('Make sure embla-carousel-autoplay is installed.');
    }
  }

  /**
   * Helper method to create autoplay plugin with HTMLElement
   * Converts HTMLElement to the function format expected by Embla
   */
  async createAutoplayPluginWithElement(
    options: {
      delay?: number;
      jump?: boolean;
      stopOnInteraction?: boolean;
      stopOnMouseEnter?: boolean;
      playOnInit?: boolean;
      rootElement?: HTMLElement;
    } = {},
  ) {
    const { rootElement, ...restOptions } = options;
    const autoplayOptions = {
      ...restOptions,
      ...(rootElement && {
        rootNode: () => rootElement,
      }),
    };

    return this.createAutoplayPlugin(autoplayOptions);
  }

  /**
   * Creates a class names plugin for the carousel
   */
  async createClassNamesPlugin(
    options: {
      selected?: string;
      dragging?: string;
      draggable?: string;
    } = {},
  ) {
    try {
      const ClassNamesModule = await import('embla-carousel-class-names');
      const ClassNames = ClassNamesModule.default;
      return ClassNames(options);
    } catch (err) {
      console.error('Error loading ClassNames plugin:', err);
      throw new Error('Make sure embla-carousel-class-names is installed.');
    }
  }

  /**
   * Creates a wheel gestures plugin for the carousel
   */
  async createWheelGesturesPlugin(
    options: {
      wheelDraggingClass?: string;
      forceWheelAxis?: 'x' | 'y';
      target?: Element;
    } = {},
  ) {
    try {
      const { WheelGesturesPlugin } = await import('embla-carousel-wheel-gestures');
      return WheelGesturesPlugin(options);
    } catch (err) {
      console.error('Error loading WheelGestures plugin:', err);
      throw new Error('Make sure embla-carousel-wheel-gestures is installed.');
    }
  }
}
