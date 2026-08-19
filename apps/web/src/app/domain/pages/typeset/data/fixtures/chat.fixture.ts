export const CHAT_FIXTURE = `
<p>
  Sure — here is what is happening. Your effect reads a signal that it also writes to, so
  every write schedules another run.
</p>

<h3>The fix</h3>
<p>Read the value once, outside the reactive context:</p>
<pre><code>const current = untracked(() =&gt; this.count());
this.count.set(current + 1);</code></pre>

<p>Three things to check when an effect loops:</p>
<ol>
  <li>Does it write to a signal it also reads?</li>
  <li>Does it write to a signal an upstream <code>computed</code> depends on?</li>
  <li>Is the write conditional on a value that the write itself changes?</li>
</ol>

<p>
  If none of those apply, the loop is probably coming from a <code>computed</code> with a
  side effect in it — those should be pure.
</p>

<blockquote>
  <p>Rule of thumb: an effect that writes is a smell. An effect that only reads is fine.</p>
</blockquote>

<p>Want me to look at the actual component?</p>
`;
