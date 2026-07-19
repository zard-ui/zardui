# Carousel snippets

Illustrative code fragments used as `codeBefore` blocks on the carousel docs page.
Each fenced block is exported as `CAROUSEL_SNIPPET_<ID>` via the snippet generator.

```angular-html id="sizes-thirds" copyButton
<!-- 33% of the carousel width. -->
<z-carousel>
  <z-carousel-content>
    <z-carousel-item class="basis-1/3">...</z-carousel-item>
    <z-carousel-item class="basis-1/3">...</z-carousel-item>
    <z-carousel-item class="basis-1/3">...</z-carousel-item>
  </z-carousel-content>
</z-carousel>
```

```angular-html id="sizes-responsive" copyButton
<!-- 50% on small screens and 33% on larger screens. -->
<z-carousel>
  <z-carousel-content>
    <z-carousel-item class="md:basis-1/2 lg:basis-1/3">...</z-carousel-item>
    <z-carousel-item class="md:basis-1/2 lg:basis-1/3">...</z-carousel-item>
    <z-carousel-item class="md:basis-1/2 lg:basis-1/3">...</z-carousel-item>
  </z-carousel-content>
</z-carousel>
```

```angular-html id="spacing-default" copyButton
<z-carousel>
  <z-carousel-content class="-ml-4">
    <z-carousel-item class="pl-4">...</z-carousel-item>
    <z-carousel-item class="pl-4">...</z-carousel-item>
    <z-carousel-item class="pl-4">...</z-carousel-item>
  </z-carousel-content>
</z-carousel>
```

```angular-html id="spacing-responsive" copyButton
<z-carousel>
  <z-carousel-content class="-ml-2 md:-ml-4">
    <z-carousel-item class="pl-2 md:pl-4">...</z-carousel-item>
    <z-carousel-item class="pl-2 md:pl-4">...</z-carousel-item>
    <z-carousel-item class="pl-2 md:pl-4">...</z-carousel-item>
  </z-carousel-content>
</z-carousel>
```

```angular-html id="orientation" copyButton
<z-carousel zOrientation="vertical | horizontal">
  <z-carousel-content>
    <z-carousel-item>...</z-carousel-item>
    <z-carousel-item>...</z-carousel-item>
    <z-carousel-item>...</z-carousel-item>
  </z-carousel-content>
</z-carousel>
```
