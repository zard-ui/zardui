# Scroll Fade

## Usage

The utility paints a mask; it never makes the container scrollable. Pair it with an overflow class and
a height, or nothing happens.

```angular-html copyButton
<div class="scroll-fade h-72 overflow-y-auto">
  <!-- enough content to scroll -->
</div>
```

## Edges

`scroll-fade` and `scroll-fade-y` are the same utility. The rest fade a single edge — `-l` / `-r` are
physical, `-s` / `-e` are logical and mirror under `dir="rtl"`.

```angular-html copyButton
<div class="scroll-fade-y h-72 overflow-y-auto">Top and bottom</div>
<div class="scroll-fade-x overflow-x-auto">Inline start and end</div>
<div class="scroll-fade-t h-72 overflow-y-auto">Top only</div>
<div class="scroll-fade-b h-72 overflow-y-auto">Bottom only</div>
<div class="scroll-fade-l overflow-x-auto">Left only</div>
<div class="scroll-fade-r overflow-x-auto">Right only</div>
<div class="scroll-fade-s overflow-x-auto">Inline start only</div>
<div class="scroll-fade-e overflow-x-auto">Inline end only</div>
```

## Size

`scroll-fade-<number>` and `scroll-fade-[<value>]` set the depth. They only carry the value, so keep
the mask utility alongside them.

```angular-html copyButton
<div class="scroll-fade scroll-fade-4 h-72 overflow-y-auto">1rem</div>
<div class="scroll-fade scroll-fade-12 h-72 overflow-y-auto">3rem</div>
<div class="scroll-fade scroll-fade-[15%] h-72 overflow-y-auto">15% of the container</div>
<div class="scroll-fade scroll-fade-t-4 scroll-fade-b-16 h-72 overflow-y-auto">One depth per edge</div>
```

The classes write these custom properties, so a stylesheet can set them directly instead.

```css title="src/styles.css" copyButton
.timeline {
  /* Every edge. */
  --scroll-fade-size: 2rem;
  /* One edge, falling back to --scroll-fade-size. */
  --scroll-fade-t-size: 0.5rem;
  --scroll-fade-b-size: 4rem;
}
```

## Reveal

`--scroll-fade-reveal` is how far you scroll before an edge is fully faded. It defaults to 96px.

```angular-html copyButton
<div class="scroll-fade h-72 overflow-y-auto [--scroll-fade-reveal:64px]">
  <!-- reaches full fade after 64px of scrolling -->
</div>
```

## RTL

The logical utilities read the direction from the document, so a single class covers both scripts.

```angular-html copyButton
<div dir="rtl">
  <div class="scroll-fade-x overflow-x-auto">Mirrors: the fade follows the reading direction</div>
  <div class="scroll-fade-s overflow-x-auto">Fades the right edge under RTL</div>
</div>
```

## Browser support

Where scroll-driven animations are missing, the `@supports not` branch pins both edges to their full
size. You get a static double fade instead of a scroll-aware one — never a broken container.

```css title="css/utilities.css"
@supports not (animation-timeline: scroll()) {
  --scroll-fade-t: var(--_scroll-fade-size-t);
  --scroll-fade-b: var(--_scroll-fade-size-b);
}
```
