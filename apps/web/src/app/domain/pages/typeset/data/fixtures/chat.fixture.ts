/**
 * An assistant answer: the core genre. Short paragraphs, scannable lists, a
 * small table, code, and a closing question.
 */

/**
 * The turn that prompted the answer.
 *
 * It is chrome, not prose: the surface renders it outside the typeset
 * container, so nothing in it is styled by the preset under test.
 */
export const CHAT_QUESTION = "My Angular dev server takes forever to start. How do I figure out what's actually slow?";

export const CHAT_FIXTURE = `
<p>Slow dev startup in Angular almost always comes down to one of three things: module count, heavy work before the first build, or something outside the compiler entirely. Here's how to narrow it down fast.</p>
<h3>1. Get a baseline</h3>
<p>Start the server with the build profiler on and note the two numbers it prints:</p>
<pre tabindex="0"><code>NG_BUILD_DEBUG_PERF=1 ng serve</code></pre>
<ul>
<li><strong>Startup time</strong>: everything before the local URL appears. Config parsing, dependency prebundling, stylesheet setup.</li>
<li><strong>First build</strong>: the time until the app is served. Module graph size lives here.</li>
</ul>
<h3>2. Check the usual suspects</h3>
<table>
<thead>
<tr><th>Symptom</th><th>Likely cause</th></tr>
</thead>
<tbody>
<tr><td>Slow before the URL prints</td><td>A long <code>styles</code> list in <code>angular.json</code>, prebundling on a cold cache</td></tr>
<tr><td>Slow first build</td><td>Barrel files pulling in whole icon or UI libraries</td></tr>
<tr><td>Slow every save</td><td>Type checking or lint running in the dev loop</td></tr>
</tbody>
</table>
<p>The barrel-file one is the classic. A single <code>import { ZardButtonComponent } from '@acme/ui'</code> through a barrel can pull thousands of modules into the graph. Fix it by importing the entry point you actually render:</p>
<pre tabindex="0"><code>// Pulls every component in the package into the dev graph
import { ZardButtonComponent } from '@acme/ui';

// Pulls the one on screen
import { ZardButtonComponent } from '@acme/ui/button';</code></pre>
<h3>3. Measure, don't guess</h3>
<p>If neither jumps out, emit the build metafile and look at what actually landed:</p>
<pre tabindex="0"><code>ng build --stats-json
# then open the metafile in a bundle analyzer:
npx esbuild-visualizer --metadata dist/app/stats.json</code></pre>
<blockquote><p>Compare against a bare <code>ng new</code> app on the same machine first. If that's also slow, the problem is your machine or antivirus scanning <code>node_modules</code>, not your app.</p></blockquote>
<p>Want to paste the first few lines of your profiler output? I can point at the exact phase that's eating the time.</p>
`;
