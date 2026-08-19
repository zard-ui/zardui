export const DOCS_FIXTURE = `
<h1>Installation</h1>
<p>
  Get a project running in under a minute. The CLI writes the files, installs the
  dependencies and wires the providers; everything after that is yours to edit.
</p>

<h2>Requirements</h2>
<ul>
  <li>Node 20 or newer.</li>
  <li>An Angular workspace on version 19 or newer.</li>
  <li>Tailwind CSS v4, already configured.</li>
</ul>

<h2>Run the CLI</h2>
<p>Point it at the project root and answer three questions.</p>
<pre><code>npx zard-cli@latest init</code></pre>
<p>
  The command creates <code>components.json</code>, writes the theme into your global
  stylesheet and registers the providers. Re-running it is safe: nothing already
  configured is written twice.
</p>

<h3>What it writes</h3>
<dl>
  <dt>components.json</dt>
  <dd>Where components land, which alias resolves them, which icon family you use.</dd>
  <dt>src/styles.css</dt>
  <dd>The design tokens, the base layer and the imports Tailwind needs.</dd>
</dl>

<blockquote>
  <p>
    Already have a stylesheet you like? Pass <code>--no-theme</code> and the CLI leaves it
    alone.
  </p>
</blockquote>

<h2>Add a component</h2>
<p>Every component is a source file you own, not a package you depend on.</p>
<pre><code>npx zard-cli@latest add button dialog</code></pre>
<p>
  Press <kbd>Ctrl</kbd> + <kbd>C</kbd> at any point; nothing is written until the
  confirmation step.
</p>

<hr />

<h2>Troubleshooting</h2>
<p>
  If the import does not resolve, check that <code>tsconfig.json</code> carries the alias
  the CLI reported. See <a href="#">the configuration reference</a> for the full list.
</p>
`;
