# The six variables

```css title="typeset.css" copyButton showLineNumbers
.typeset {
  --typeset-font-body: inherit;
  --typeset-font-heading: var(--font-heading, var(--font-sans, inherit));
  --typeset-font-mono: var(--font-mono);

  --typeset-size: 1em; /* body font-size */
  --typeset-leading: 1.75; /* line-height */
  --typeset-flow: 1.25em; /* space between blocks */
}
```
