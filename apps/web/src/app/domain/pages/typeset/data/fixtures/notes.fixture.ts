export const NOTES_FIXTURE = `
<h2>Reading notes — week 12</h2>

<p>
  Three things worth keeping from this week, plus one I want to come back to.
</p>

<h3>On specificity</h3>
<p>
  <code>:where()</code> costs nothing. That is the whole trick behind a stylesheet you can
  override with a plain utility class. Everything inside it contributes zero to the
  specificity of the selector, so <code>.text-lg</code> on the element wins on its own.
</p>

<ul class="contains-task-list">
  <li class="task-list-item"><input type="checkbox" checked disabled /> Read the cascade layers spec.</li>
  <li class="task-list-item"><input type="checkbox" checked disabled /> Try <code>@layer</code> ordering in a real project.</li>
  <li class="task-list-item"><input type="checkbox" disabled /> Write up why unlayered CSS wins over layered CSS.</li>
</ul>

<h3>On streaming</h3>
<p>
  A selector that looks forward — <code>:last-child</code>, <code>:has()</code> — is a
  selector whose match changes when content is appended. In a chat UI that means the
  paragraph you already read moves while you are reading it.
</p>

<details>
  <summary>The one-way rule, stated precisely</summary>
  <p>
    Spacing between blocks belongs to the block below, never the block above. Then a new
    block brings its own space and nothing above it is touched.
  </p>
</details>

<h3>To come back to</h3>
<p>
  <mark>Optical sizing</mark> in variable fonts. Every reference I found either assumes you
  already know what <code>opsz</code> does, or explains it with a diagram that assumes the
  same. Worth an afternoon.
</p>

<p>
  <abbr title="Terms of reference">TOR</abbr> for next week: pick one system, read its CSS
  end to end, write down every decision I would have made differently.
</p>
`;
