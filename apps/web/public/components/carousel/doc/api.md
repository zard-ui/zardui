# API

## [z-carousel] <span class="api-type-label component">Component</span>

> A carousel component with slide controls and swipe gesture support.

| Property         | Description                                                                                                                                | Type                          | Default         |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------- | --------------- |
| `[class]`        | Additional CSS classes                                                                                                                     | `ClassValue`                  | `''`            |
| `[zOptions]`     | Embla Carousel configuration options. See the **[Embla Carousel docs](https://www.embla-carousel.com/api/options/)** for more information. | `EmblaOptionsType`            | `{loop: false}` |
| `[zPlugins]`     | Embla Carousel plugins                                                                                                                     | `EmblaPluginType[]`           | `[]`            |
| `[zOrientation]` | Carousel orientation                                                                                                                       | `horizontal \| vertical`      | `horizontal`    |
| `[zControls]`    | Navigation type buttons                                                                                                                    | `'button' \| 'dot' \| 'none'` | `button`        |
| `(zInited)`      | Emits Embla API when carousel is initialized                                                                                               | `EmblaCarouselType`           | -               |
| `(zSelected)`    | Emitted when a slide is selected                                                                                                           | `void`                        | -               |

## [z-carousel-content] <span class="api-type-label component">Component</span>

> The content container for the carousel

| Property  | Description            | Type         | Default |
| --------- | ---------------------- | ------------ | ------- |
| `[class]` | Additional CSS classes | `ClassValue` | `''`    |

## [z-carousel-item] <span class="api-type-label component">Component</span>

> An individual carousel item

| Property  | Description            | Type         | Default |
| --------- | ---------------------- | ------------ | ------- |
| `[class]` | Additional CSS classes | `ClassValue` | `''`    |
