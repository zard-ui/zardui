# Shimmer

## Usage

One class on the element that holds the text. The base colour is `currentColor`, so it inherits
whatever colour the element already had.

```angular-html copyButton
<p class="shimmer text-muted-foreground">Generating response...</p>
```

## How it works

The highlight is a `linear-gradient` clipped to the glyphs and swept across them. Dark mode brightens
it through a `@variant dark` override, so the effect reads as light on dark rather than dimmer.

```css title="css/utilities.css"
@utility shimmer {
  --_highlight: var(--shimmer-color, oklch(from currentColor l c h / calc(alpha* 0.2)));

  background-clip: text;
  -webkit-text-fill-color: var(--shimmer-text-fill, transparent);
  animation: tw-shimmer var(--shimmer-duration, 2s) linear infinite;

  @variant dark {
    --_highlight: var(--shimmer-color, oklch(from currentColor max(0.8, calc(l + 0.4)) c h / calc(alpha + 0.4)));
  }
}
```

## Color

`shimmer-color-*` takes a theme colour or an arbitrary one, and accepts the `/<opacity>` modifier.

```angular-html copyButton
<p class="shimmer shimmer-color-primary">A theme token</p>
<p class="shimmer shimmer-color-blue-500">An arbitrary colour</p>
<p class="shimmer shimmer-color-blue-500/60">The same colour, dimmed to 60%</p>
```

## Duration

`shimmer-duration-*` is in milliseconds, unlike the `2s` default.

```angular-html copyButton
<p class="shimmer shimmer-duration-1000">One second per sweep</p>
<p class="shimmer shimmer-duration-4000">Four seconds per sweep</p>
```

## Spread and angle

`shimmer-spread-*` widens the band from the spacing scale or an arbitrary length; `shimmer-angle-*`
tilts it, in degrees.

```angular-html copyButton
<p class="shimmer shimmer-spread-24">A wider band</p>
<p class="shimmer shimmer-spread-[8ch]">An arbitrary width</p>
<p class="shimmer shimmer-angle-45">A steeper tilt</p>
```

## Once and direction

```angular-html copyButton
<p class="shimmer shimmer-duration-1100 shimmer-once">Response generated.</p>
<p class="shimmer shimmer-reverse">Sweeping the other way</p>
```

## Turning it off

`shimmer-none` restores normal text rendering, which makes it composable with variants.

```angular-html copyButton
<p class="shimmer md:shimmer-none">Shimmers on small screens only</p>
```

## Browser support

The gradient relies on relative colour syntax and `color-mix()`. Where either is missing, gate the
class behind a feature query so the text keeps its own colour.

```angular-html copyButton
<p class="supports-[color:oklch(from_white_l_c_h)]:shimmer text-muted-foreground">Generating response...</p>
```
