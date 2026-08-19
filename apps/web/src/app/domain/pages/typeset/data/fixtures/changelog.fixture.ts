export const CHANGELOG_FIXTURE = `
<h1>Changelog</h1>
<p>Everything that shipped, newest first.</p>

<h2>1.4.0</h2>
<h3>Added</h3>
<ul>
  <li>
    <strong>Typeset.</strong> A styling system for rendered markdown, published in the
    registry as a single CSS file.
  </li>
  <li>A <code>--path</code> flag on <code>add</code>, for workspaces that keep components
    outside the configured directory.</li>
</ul>

<h3>Fixed</h3>
<ul>
  <li>
    <code>add</code> no longer skips an item whose directory already holds unrelated files.
    It now checks the files the item declares.
  </li>
  <li>The dialog no longer traps focus when opened from inside a drawer.</li>
</ul>

<h3>Changed</h3>
<ul>
  <li>
    <del>Icons resolved at build time.</del> They are resolved from the configured family
    at install time, so switching families no longer means reinstalling everything.
  </li>
</ul>

<h2>1.3.2</h2>
<h3>Fixed</h3>
<ul>
  <li>Server-side rendering no longer throws on <code>navigator</code> in the theme loader.</li>
  <li>Tabs keep their selection across a route change.</li>
</ul>

<h4>Notes for upgraders</h4>
<p>
  No action required. If you patched the theme loader locally, revert the patch before
  upgrading.
</p>

<hr />

<h2>1.3.1</h2>
<p>Documentation only. No published code changed.</p>
`;
