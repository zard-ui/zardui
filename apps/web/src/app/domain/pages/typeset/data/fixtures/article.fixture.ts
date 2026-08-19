export const ARTICLE_FIXTURE = `
<h1>The measure is not yours to keep</h1>
<p>
  Every typography system eventually has to answer one question: who decides how wide a
  line of text may be? The answer most systems give is <em>the stylesheet</em>, and that
  answer is wrong often enough to be worth revisiting.
</p>

<p>
  A paragraph does not know whether it sits in a sidebar, a chat bubble or a printed page.
  The layout knows. When a typography system bakes in a <code>max-width</code>, it takes a
  decision away from the only place that has the context to make it, and every consumer
  spends the rest of its life overriding that decision.
</p>

<h2>What a rhythm actually is</h2>
<p>
  The vertical rhythm of a page is not a grid you draw once. It is the relationship between
  three numbers: how big the text is, how far apart its lines sit, and how much air separates
  one block from the next. Fix those three and everything else — heading sizes, list indents,
  the space around a rule — can be derived.
</p>

<blockquote>
  <p>
    Typography is the craft of endowing human language with a durable visual form.
  </p>
  <p>— Robert Bringhurst</p>
</blockquote>

<h2>Deriving, not declaring</h2>
<p>
  Consider the space above a second-level heading. Declared, it is a magic number that has to
  be re-tuned every time the base size changes. Derived from the block spacing, it moves on
  its own:
</p>

<pre><code>h2 {
  margin-block-start: calc(var(--typeset-flow) * 1.4);
}</code></pre>

<p>
  The multiplier encodes a judgement — a section break deserves more air than a paragraph
  break — and that judgement holds at every size.<sup><a href="#">1</a></sup>
</p>

<h2>Where this leaves the layout</h2>
<p>
  The layout keeps the measure. The typography system keeps the rhythm. Neither has to know
  much about the other, which is the whole point.
</p>

<figure>
  <img src="data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20640%20200%22%3E%3Crect%20width%3D%22640%22%20height%3D%22200%22%20fill%3D%22%23e5e5e5%22%2F%3E%3Cg%20fill%3D%22%23a3a3a3%22%3E%3Crect%20x%3D%2260%22%20y%3D%2250%22%20width%3D%22200%22%20height%3D%2210%22%2F%3E%3Crect%20x%3D%2260%22%20y%3D%2280%22%20width%3D%22320%22%20height%3D%2210%22%2F%3E%3Crect%20x%3D%2260%22%20y%3D%22110%22%20width%3D%22280%22%20height%3D%2210%22%2F%3E%3Crect%20x%3D%2260%22%20y%3D%22140%22%20width%3D%22160%22%20height%3D%2210%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E" alt="Four lines of text of decreasing width, illustrating a measure" />
  <figcaption>A measure is a count of characters, not a count of pixels.</figcaption>
</figure>

<hr />

<p>
  <small>Filed under typography, CSS and things that should have been settled by now.</small>
</p>
`;
