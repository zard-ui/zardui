/**
 * Every element the stylesheet touches, on one page.
 *
 * This is the visual test: a rule that regresses shows up here, and nowhere
 * else does a heading level 6, a definition list and a table footer sit close
 * enough to compare.
 */
export const ELEMENTS_FIXTURE = `
<h1>Heading level 1</h1>
<p>
  A paragraph directly under a heading takes the heading's own spacing, not the block flow.
  This one carries <strong>bold text</strong>, <em>italic text</em>, a
  <a href="#">link</a>, <code>inline code</code>, <mark>highlighted text</mark>,
  <del>struck-out text</del>, an <abbr title="Abbreviation">abbr</abbr>, a
  superscript<sup>1</sup> and a subscript<sub>2</sub>.
</p>

<h2>Heading level 2</h2>
<p>Second-level headings take more space above them than any other block.</p>

<h3>Heading level 3</h3>
<p>Third level, back to the standard flow.</p>

<h4>Heading level 4</h4>
<p>Fourth level is body size, distinguished only by weight.</p>

<h5>Heading level 5</h5>
<p>Fifth level drops below body size and goes muted.</p>

<h6>Heading level 6</h6>
<p>Sixth level is uppercase, tracked out, and quieter still.</p>

<hr />

<h2>Lists</h2>
<ul>
  <li>An unordered item.</li>
  <li>
    An item with a nested list:
    <ul>
      <li>Second level uses a hollow marker.</li>
      <li>
        And a third:
        <ul>
          <li>Square, at this depth.</li>
        </ul>
      </li>
    </ul>
  </li>
  <li>
    <p>An item whose content is a paragraph.</p>
    <p>And a second one, on the list's tighter rhythm.</p>
  </li>
</ul>

<ol>
  <li>First.</li>
  <li>Second.</li>
  <li>Third.</li>
</ol>

<ol type="a">
  <li>Lower alpha.</li>
  <li>Second.</li>
</ol>

<ol type="I">
  <li>Upper roman.</li>
  <li>Second.</li>
</ol>

<ul class="contains-task-list">
  <li class="task-list-item"><input type="checkbox" checked disabled /> A finished task.</li>
  <li class="task-list-item"><input type="checkbox" disabled /> An unfinished one.</li>
</ul>

<h2>Definition list</h2>
<dl>
  <dt>--typeset-size</dt>
  <dd>The base body size. Everything else derives from it.</dd>
  <dt>--typeset-leading</dt>
  <dt>--typeset-flow</dt>
  <dd>Two terms can share one definition.</dd>
</dl>

<h2>Quotation</h2>
<blockquote>
  <p>A quotation carries its own rule on the inline start edge.</p>
  <p>A second paragraph inside it keeps the block flow.</p>
</blockquote>

<h2>Code</h2>
<p>Inline <code>--typeset-flow</code> against a block:</p>
<pre><code>.typeset-reading {
  --typeset-font-body: var(--font-lora);
  --typeset-size: 18px;
  --typeset-leading: 1.9;
  --typeset-flow: 2em;
}</code></pre>

<h2>Keys</h2>
<p>Press <kbd>Cmd</kbd> + <kbd>K</kbd> to open the palette, then <kbd>Esc</kbd> to close it.</p>

<h2>Disclosure</h2>
<details>
  <summary>A closed disclosure</summary>
  <p>Whose content takes the block flow when it opens.</p>
</details>

<h2>Table</h2>
<table>
  <caption>Sizes, and where each one is meant to be read</caption>
  <thead>
    <tr>
      <th>Preset</th>
      <th align="center">Size</th>
      <th align="right">Leading</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Compact</th>
      <td align="center">14px</td>
      <td align="right">1.6</td>
    </tr>
    <tr>
      <th scope="row">Docs</th>
      <td align="center">15px</td>
      <td align="right">1.75</td>
    </tr>
    <tr>
      <th scope="row">Reading</th>
      <td align="center">18px</td>
      <td align="right">1.9</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <th scope="row">Range</th>
      <td align="center">14–18px</td>
      <td align="right">1.6–1.9</td>
    </tr>
  </tfoot>
</table>

<h2>Wide table, wrapped to scroll</h2>
<div class="typeset-scroll">
  <table>
    <thead>
      <tr>
        <th>Variable</th>
        <th>Default</th>
        <th>Controls</th>
        <th>Derived from it</th>
        <th>Set on</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>--typeset-size</code></td>
        <td><code>1em</code></td>
        <td>Base body size</td>
        <td>Every heading size, every code block size</td>
        <td>The preset class</td>
      </tr>
      <tr>
        <td><code>--typeset-leading</code></td>
        <td><code>1.75</code></td>
        <td>Line height</td>
        <td>Nothing — it stands alone</td>
        <td>The preset class</td>
      </tr>
      <tr>
        <td><code>--typeset-flow</code></td>
        <td><code>1.25em</code></td>
        <td>Space between blocks</td>
        <td>Heading spacing, rule margins, list gaps</td>
        <td>The preset class</td>
      </tr>
    </tbody>
  </table>
</div>

<h2>Media</h2>
<figure>
  <img src="data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20640%20180%22%3E%3Crect%20width%3D%22640%22%20height%3D%22180%22%20fill%3D%22%23d4d4d4%22%2F%3E%3Ccircle%20cx%3D%22320%22%20cy%3D%2290%22%20r%3D%2244%22%20fill%3D%22%23a3a3a3%22%2F%3E%3C%2Fsvg%3E" alt="A grey placeholder with a circle at its centre" />
  <figcaption>A figure caption sits centred and quiet under its image.</figcaption>
</figure>

<h2>Opting out</h2>
<div class="not-typeset" style="border: 1px dashed currentColor; padding: 12px; border-radius: 8px; opacity: 0.7">
  <p style="margin: 0">
    This box carries <code>not-typeset</code>. Nothing inside it is styled by typeset —
    not this paragraph, not this <code>code</code>.
  </p>
</div>

<hr />

<p>
  A footnote reference<sup><a href="#fn1">1</a></sup> points into the section below.
</p>

<div class="footnotes">
  <ol>
    <li id="fn1">Footnotes come out smaller and muted, above a rule of their own.</li>
  </ol>
</div>
`;
