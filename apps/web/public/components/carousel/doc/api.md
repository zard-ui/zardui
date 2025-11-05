# API

## [z-carousel] <span class="api-type-label component">Component</span>

> A carousel component with slide controls and swipe gesture support.

| Property          | Description                                                                                                                                | Type                     | Default         |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------ | --------------- |
| `[zOptions]`      | Embla Carousel configuration options. See the **[Embla Carousel docs](https://www.embla-carousel.com/api/options/)** for more information. | `EmblaOptionsType`       | `{loop: false}` |
| `[zPlugins]`      | Embla Carousel plugins                                                                                                                     | `EmblaPluginType[]`      | `[]`            |
| `[zOrientation]`  | Carousel orientation                                                                                                                       | `horizontal \| vertical` | `horizontal`    |
| `[zShowControls]` | Show navigation buttons                                                                                                                    | `boolean`                | `true`          |
| `(zInited)`       | Emits Embla API when caraousel is initialized                                                                                              | `EmblaCarouselType`      | -               |
| `(zSelected)`     | Emitted when a slide is selected                                                                                                           | `void`                   | -               |

## [z-carousel-content] <span class="api-type-label component">Component</span>

> The content container for the carousel

## [z-carousel-item] <span class="api-type-label component">Component</span>

> An individual carousel item
