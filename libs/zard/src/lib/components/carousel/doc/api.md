# API

## [z-carousel] <span class="api-type-label component">Component</span>

> A carousel component with slide controls and swipe gesture support.

| Property          | Description                              | Type                             | Default      |
| ----------------- | ---------------------------------------- | -------------------------------- | ------------ |
| `[zOptions]`      | Embla Carousel configuration options     | `CarouselOptions`                | `{}`         |
| `[zPlugins]`      | Embla Carousel plugins                   | `any[]`                          | `[]`         |
| `[zOrientation]`  | Carousel orientation                     | `horizontal \| vertical`         | `horizontal` |
| `[zShowControls]` | Show navigation buttons                  | `boolean`                        | `true`       |
| `(zOnInit)`       | Emitted when the carousel is initialized | `CarouselApi`                    | -            |
| `(zOnSelect)`     | Emitted when a slide is selected         | `{ selectedIndex: number, ... }` | -            |

## [z-carousel-content] <span class="api-type-label component">Component</span>

> The content container for the carousel

| Property         | Description          | Type                     | Default      |
| ---------------- | -------------------- | ------------------------ | ------------ |
| `[zOrientation]` | Carousel orientation | `horizontal \| vertical` | `horizontal` |

## [z-carousel-item] <span class="api-type-label component">Component</span>

> An individual carousel item

| Property         | Description          | Type                     | Default      |
| ---------------- | -------------------- | ------------------------ | ------------ |
| `[zOrientation]` | Carousel orientation | `horizontal \| vertical` | `horizontal` |

## [z-carousel-indicators] <span class="api-type-label component">Component</span>

> Navigation indicators for the carousel

| Property         | Description            | Type                     | Default      |
| ---------------- | ---------------------- | ------------------------ | ------------ |
| `[zOrientation]` | Indicators orientation | `horizontal \| vertical` | `horizontal` |

## [z-carousel-thumbs] <span class="api-type-label component">Component</span>

> Thumbnail navigation for the carousel

| Property          | Description             | Type               | Default |
| ----------------- | ----------------------- | ------------------ | ------- |
| `[thumbTemplate]` | Template for thumbnails | `TemplateRef<any>` | -       |

## Interface CarouselOptions

This interface exposes all configurable options from Embla Carousel:

| Property          | Description                             | Type                     | Default  |
| ----------------- | --------------------------------------- | ------------------------ | -------- |
| `loop`            | Enable infinite scrolling               | `boolean`                | `false`  |
| `align`           | Slide alignment                         | `start \| center \| end` | `center` |
| `axis`            | Scroll axis                             | `x \| y`                 | `x`      |
| `dragFree`        | Enable momentum-based scrolling         | `boolean`                | `false`  |
| `dragThreshold`   | Threshold before drag is activated      | `number`                 | `10`     |
| `inViewThreshold` | Threshold to consider a slide in view   | `number`                 | `0`      |
| `skipSnaps`       | Skip snap positions when scrolling fast | `boolean`                | `false`  |
| `containScroll`   | Prevent overscrolling                   | `trimSnaps \| keepSnaps` | -        |

## Interface CarouselApi

This interface provides methods to programmatically interact with the carousel:

| Method                | Description                                      | Parameters                           |
| --------------------- | ------------------------------------------------ | ------------------------------------ |
| `canScrollNext`       | Check if scrolling to next slide is possible     | -                                    |
| `canScrollPrev`       | Check if scrolling to previous slide is possible | -                                    |
| `scrollNext`          | Scroll to next slide                             | -                                    |
| `scrollPrev`          | Scroll to previous slide                         | -                                    |
| `scrollTo`            | Scroll to specific slide                         | `index: number, immediate?: boolean` |
| `slidesInView`        | Get indices of slides in view                    | -                                    |
| `slidesNotInView`     | Get indices of slides not in view                | -                                    |
| `inView`              | Check if a slide is in view                      | `index: number`                      |
| `scrollProgress`      | Get scroll progress (0-1)                        | -                                    |
| `scrollSnapList`      | Get list of snap positions                       | -                                    |
| `slideNodes`          | Get slide HTML elements                          | -                                    |
| `slideCount`          | Get total number of slides                       | -                                    |
| `addEventListener`    | Add an event listener                            | `event: string, callback: Function`  |
| `removeEventListener` | Remove an event listener                         | `event: string, callback: Function`  |
| `reInit`              | Reinitialize the carousel                        | `options?: Object, plugins?: any[]`  |
| `destroy`             | Destroy the carousel instance                    | -                                    |
