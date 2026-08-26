/**
 * A long technical page: prose, lists, several code blocks, note quotes, a
 * reference table and native MathML.
 *
 * It is the default sample because it is the shape most people arrive with —
 * and the one where a bad rhythm shows first, in the run of code blocks.
 */
export const DOCS_FIXTURE = `
<h1>Building a Streaming Chatbot</h1>
<p>The <code>injectChat</code> function makes it effortless to create a conversational user interface for your chatbot application. It streams chat messages from your AI provider, holds the chat state in signals, and updates the UI automatically as new messages arrive.</p>
<p>To summarize, <code>injectChat</code> provides the following features:</p>
<ul>
<li><strong>Message Streaming</strong>: All the messages from the AI provider are streamed to the chat UI in real-time.</li>
<li><strong>Managed Signals</strong>: The function manages the signals for input, messages, status, error and more for you.</li>
<li><strong>Seamless Integration</strong>: Easily integrate your chat AI into any design or layout with minimal effort.</li>
</ul>
<p>In this guide, you will learn how to use <code>injectChat</code> to create a chatbot application with real-time message streaming. Check out our <a href="/docs/chatbot-tool-usage">chatbot with tools guide</a> to learn how to use tools in your chatbot.</p>
<h2>Example</h2>
<p>The request flow works like this:</p>
<ol>
<li>The user submits a message and <code>sendMessage</code> posts it to your API route.</li>
<li>Your transport calls the provider and returns a UI message stream.</li>
<li>The chat appends chunks to the last message as they arrive, re-rendering as it goes.</li>
</ol>
<pre tabindex="0"><code>import { ChangeDetectionStrategy, Component } from '@angular/core';

import { injectChat } from '@acme/chat';

@Component({
  selector: 'app-chat',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    @for (message of chat.messages(); track message.id) {
      &lt;app-message [message]="message" /&gt;
    }

    &lt;app-chat-input
      [disabled]="chat.status() !== 'ready'"
      (submitted)="chat.sendMessage({ text: $event })"
    /&gt;
  \`,
})
export class ChatComponent {
  protected readonly chat = injectChat();
}</code></pre>
<pre tabindex="0"><code>import { Injectable } from '@angular/core';
import { readUIMessageStream } from '@acme/chat';

@Injectable({ providedIn: 'root' })
export class ChatTransport {
  async *stream(messages: UIMessage[]) {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ messages }),
    });

    yield* readUIMessageStream(response.body);
  }
}</code></pre>
<blockquote><p>The UI messages have a <code>parts</code> property that contains the message parts. We recommend rendering the messages using the <code>parts</code> property instead of the <code>content</code> property. The parts property supports different message types, including text, tool invocation, and tool result, and allows for more flexible and complex chat UIs.</p></blockquote>
<p>In the <code>ChatComponent</code>, <code>injectChat</code> will request your AI provider endpoint whenever the user sends a message using <code>sendMessage</code>. The messages are then streamed back in real-time and displayed in the chat UI.</p>
<h2>Customized UI</h2>
<p><code>injectChat</code> also provides ways to manage the chat message state in code, show status, and update messages without being triggered by user interactions.</p>
<h3>Status</h3>
<p><code>injectChat</code> returns a <code>status</code> signal. It has the following possible values:</p>
<ul>
<li><code>submitted</code>: The message has been sent to the API and we're awaiting the start of the response stream.</li>
<li><code>streaming</code>: The response is actively streaming in from the API, receiving chunks of data.</li>
<li><code>ready</code>: The full response has been received and processed; a new user message can be submitted.</li>
<li><code>error</code>: An error occurred during the request, preventing successful completion.</li>
</ul>
<pre tabindex="0"><code>protected readonly chat = injectChat({
  transport: new DefaultChatTransport({ api: '/api/chat' }),
});

&lt;!-- ... --&gt;

@if (chat.status() === 'submitted' || chat.status() === 'streaming') {
  &lt;div&gt;
    @if (chat.status() === 'submitted') {
      &lt;app-spinner /&gt;
    }
    &lt;button type="button" (click)="chat.stop()"&gt;Stop&lt;/button&gt;
  &lt;/div&gt;
}</code></pre>
<h3>Error State</h3>
<p>Similarly, the <code>error</code> signal holds the error thrown during the request. It can be used to display an error message, disable the submit button, or show a retry button:</p>
<blockquote><p>We recommend showing a generic error message to the user, such as "Something went wrong." This is a good practice to avoid leaking information from the server.</p></blockquote>
<pre tabindex="0"><code>protected readonly chat = injectChat({
  transport: new DefaultChatTransport({ api: '/api/chat' }),
});

&lt;!-- ... --&gt;

@if (chat.error()) {
  &lt;div&gt;An error occurred.&lt;/div&gt;
  &lt;button type="button" (click)="chat.regenerate()"&gt;Retry&lt;/button&gt;
}</code></pre>
<h3>Cancellation and regeneration</h3>
<p>It's also a common use case to abort the response message while it's still streaming back from the AI provider. You can do this by calling the <code>stop</code> method returned by <code>injectChat</code>.</p>
<pre tabindex="0"><code>&lt;button
  [disabled]="chat.status() !== 'streaming' &amp;&amp; chat.status() !== 'submitted'"
  (click)="chat.stop()"
&gt;
  Stop
&lt;/button&gt;</code></pre>
<hr>
<h2>API reference</h2>
<h3>injectChat(options)</h3>
<p>Creates a chat helper. All options are optional; the defaults talk to <code>/api/chat</code> and render at native stream speed.</p>
<table>
  <thead>
    <tr><th>Prop</th><th>Type</th><th>Description</th></tr>
  </thead>
  <tbody>
    <tr><td><code>transport</code></td><td><code>ChatTransport&lt;UIMessage&gt;</code></td><td>How messages reach your API route</td></tr>
    <tr><td><code>messages</code></td><td><code>UIMessage[]</code></td><td>Initial messages to seed the conversation</td></tr>
    <tr><td><code>onFinish</code></td><td><code>(event: FinishEvent) =&gt; void</code></td><td>Runs when the assistant response completes</td></tr>
    <tr><td><code>onError</code></td><td><code>(error: Error) =&gt; void</code></td><td>Runs when the request fails</td></tr>
    <tr><td><code>throttle</code></td><td><code>number</code></td><td>Milliseconds between signal updates while streaming</td></tr>
  </tbody>
</table>
<h2>Event Callbacks</h2>
<p><code>injectChat</code> provides optional event callbacks that you can use to handle different stages of the chatbot lifecycle:</p>
<ul>
<li><code>onFinish</code>: Called when the assistant response is completed. The event includes the response message, all messages, and flags for abort, disconnect, and errors.</li>
<li><code>onError</code>: Called when an error occurs during the request.</li>
<li><code>onData</code>: Called whenever a data part is received.</li>
</ul>
<p>These callbacks can be used to trigger additional actions, such as logging, analytics, or custom UI updates.</p>
<pre tabindex="0"><code>protected readonly chat = injectChat({
  onFinish: ({ message }) =&gt; this.history.save(message),
  onError: error =&gt; console.error(error),
});</code></pre>
<hr>
<h2>Math</h2>
<p>Display math sits in the flow rhythm and scrolls when it runs long. Inline math like <math><msup><mi>e</mi><mrow><mi>i</mi><mi>π</mi></mrow></msup><mo>+</mo><mn>1</mn><mo>=</mo><mn>0</mn></math> rides the line without stretching it.</p>
<h3>Display</h3>
<p>The quadratic formula, as a block:</p>
<math display="block">
  <mi>x</mi><mo>=</mo>
  <mfrac>
    <mrow><mo>−</mo><mi>b</mi><mo>±</mo><msqrt><mrow><msup><mi>b</mi><mn>2</mn></msup><mo>−</mo><mn>4</mn><mi>a</mi><mi>c</mi></mrow></msqrt></mrow>
    <mrow><mn>2</mn><mi>a</mi></mrow>
  </mfrac>
</math>
<p>Prose continues after the block at the normal distance, so equations read as part of the argument, not decoration.</p>
<h3>Overflow</h3>
<p>A long expansion scrolls inside its own box instead of breaking the column:</p>
<math display="block">
  <msup><mrow><mo>(</mo><mi>a</mi><mo>+</mo><mi>b</mi><mo>)</mo></mrow><mn>4</mn></msup><mo>=</mo>
  <msup><mi>a</mi><mn>4</mn></msup><mo>+</mo>
  <mn>4</mn><msup><mi>a</mi><mn>3</mn></msup><mi>b</mi><mo>+</mo>
  <mn>6</mn><msup><mi>a</mi><mn>2</mn></msup><msup><mi>b</mi><mn>2</mn></msup><mo>+</mo>
  <mn>4</mn><mi>a</mi><msup><mi>b</mi><mn>3</mn></msup><mo>+</mo>
  <msup><mi>b</mi><mn>4</mn></msup>
</math>
`;
