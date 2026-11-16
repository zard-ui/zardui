import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown, lucideDownload, lucideFileCode, lucideTerminal, lucideWrapText } from '@ng-icons/lucide';

import { ZardBubbleImports } from '@zard/components/bubble/bubble.imports';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { injectHighlightedCode } from '@zard/components/code-block/code-block.highlight';
import { ZardCodeBlockImports } from '@zard/components/code-block/code-block.imports';
import type { ZardCodeBlockLineTokens } from '@zard/components/code-block/code-block.types';
import type { ZardCodeBlockLineTypeVariants } from '@zard/components/code-block/code-block.variants';
import { ZardDialogImports } from '@zard/components/dialog/dialog.imports';
import { ZardMessageImports } from '@zard/components/message/message.imports';
import { ZardTabComponent, ZardTabGroupComponent } from '@zard/components/tabs/tabs.component';
import { ZardTraceImports } from '@zard/components/trace/trace.imports';

import { ExampleImports } from './example.component';

const BUILD = `$ pnpm build
> next build

   ▲ Next.js 16.0.0
   Creating an optimized production build ...
 ✓ Compiled successfully in 4.2s
 ✓ Generating static pages (12/12)

Route (app)                Size  First Load JS
┌ ○ /                    1.9 kB         112 kB
├ ○ /_not-found           993 B         103 kB
└ ƒ /api/chat             141 B         102 kB`;

const INSTALL = `$ pnpm add ai @ai-sdk/react zod
Progress: resolved 412, reused 398, downloaded 14, added 14, done
dependencies:
+ @ai-sdk/react 3.0.12
+ ai 6.0.12
+ zod 4.1.12
Done in 2.8s using pnpm v10.18.0`;

const ERROR = `TypeError: Cannot read properties of undefined (reading 'map')
    at MessageList (components/message-list.tsx:18:22)
    at renderWithHooks (react-dom.development.js:16305:18)
    at mountIndeterminateComponent (react-dom.development.js:20069:13)`;

const SOURCE = `import { streamText } from "ai"

export async function POST(request: Request) {
  const { messages } = await request.json()

  const result = streamText({
    model: "anthropic/claude-sonnet-4.5",
    messages,
  })

  return result.toUIMessageStreamResponse()
}`;

const CHAT = `"use client"

import * as React from "react"
import { useChat } from "@ai-sdk/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Chat() {
  const [input, setInput] = React.useState("")
  const { messages, sendMessage, status } = useChat()

  return (
    <div className="flex flex-col gap-4">
      {messages.map((message) => (
        <div key={message.id}>
          {message.parts.map((part, index) =>
            part.type === "text" ? <p key={index}>{part.text}</p> : null
          )}
        </div>
      ))}
      <form
        onSubmit={(event) => {
          event.preventDefault()
          sendMessage({ text: input })
          setInput("")
        }}
      >
        <Input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask anything" />
        <Button disabled={status !== "ready"}>Send</Button>
      </form>
    </div>
  )
}`;

const DIFF: readonly { type: ZardCodeBlockLineTypeVariants; text: string }[] = [
  { type: 'default', text: 'export function Greeting({ name }: Props) {' },
  { type: 'removed', text: '  return <p>Hello, {name}</p>' },
  { type: 'added', text: '  return <p className="text-sm">Hello, {name}!</p>' },
  { type: 'default', text: '}' },
];

const LOG = Array.from(
  { length: 40 },
  (_, index) => `[${String(index + 1).padStart(2, '0')}] GET /api/chat 200 in ${12 + ((index * 7) % 40)}ms`,
).join('\n');

const MIDDLE = `  if (!session) {
    redirect("/login")
  }

  const projects = await db.project.findMany({
    where: { ownerId: session.user.id },
    orderBy: { updatedAt: "desc" },
  })

  return <ProjectList projects={projects} />
}`;

const LONG_DIFF: readonly { type: ZardCodeBlockLineTypeVariants; text: string }[] = [
  { type: 'default', text: 'export async function GET(request: Request) {' },
  {
    type: 'removed',
    text: '  const { searchParams } = new URL(request.url, "http://localhost:3000/api/projects?include=owner,members")',
  },
  {
    type: 'added',
    text: '  const { searchParams } = new URL(request.url, process.env.NEXT_PUBLIC_APP_URL ?? request.headers.get("origin") ?? undefined)',
  },
  { type: 'added', text: '  const include = searchParams.get("include")?.split(",") ?? []' },
  { type: 'default', text: '  return Response.json(await getProjects({ include }))' },
  { type: 'default', text: '}' },
];

const SAMPLES = [
  {
    language: 'json',
    title: 'package.json',
    code: `{
  "name": "acme-chat",
  "scripts": { "dev": "next dev --turbopack" },
  "dependencies": { "ai": "^6.0.12", "zod": "^4.1.12" }
}`,
  },
  {
    language: 'css',
    title: 'app/globals.css',
    code: `@import "tailwindcss";

:root {
  --radius: 0.625rem;
}`,
  },
  {
    language: 'python',
    title: 'main.py',
    code: `def greet(name: str) -> str:
    return f"Hello, {name}!"`,
  },
  { language: 'text', title: 'notes.txt', code: 'An unknown language renders as plain lines.' },
];

const ANSI = `$ pnpm test
\x1b[32m✓\x1b[39m src/format.test.ts \x1b[2m(4 tests)\x1b[22m
\x1b[31m✗\x1b[39m src/stream.test.ts \x1b[2m(3 tests | 1 failed)\x1b[22m

Tests  \x1b[31m1 failed\x1b[39m | \x1b[32m6 passed\x1b[39m (7)`;

const ANSWER = `Wrap the input in a \`useDebounce\` hook:

\`\`\`tsx
export function useDebounce<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = React.useState(value)

  React.useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timeout)
  }, [value, delay])

  return debounced
}
\`\`\`

Then install it:

\`\`\`bash
pnpm dlx shadcn@latest add use-debounce
\`\`\``;

const FILES = [
  { id: 'route', title: 'app/api/chat/route.ts', language: 'ts', code: SOURCE },
  { id: 'chat', title: 'components/chat.tsx', language: 'tsx', code: CHAT },
  { id: 'env', title: '.env.local', language: 'bash', code: 'AI_GATEWAY_API_KEY=your-api-key' },
];

interface StreamedBlock {
  title?: string;
  language: string;
  code: string;
  lineNumbers?: boolean;
  highlight?: number[];
  diff?: boolean;
}

const STREAMED: readonly StreamedBlock[] = [
  { title: 'app/api/chat/route.ts', language: 'ts', lineNumbers: true, highlight: [5, 6, 7, 8], code: SOURCE },
  { language: 'bash', code: 'pnpm dlx shadcn@latest add code-block' },
  {
    title: 'components/search.tsx',
    language: 'tsx',
    lineNumbers: true,
    diff: true,
    code: ` export function Search() {
   const [query, setQuery] = React.useState("")
-  const results = useSearch(query)
+  const debounced = useDebounce(query, 300)
+  const results = useSearch(debounced)

   return <SearchResults results={results} />
 }`,
  },
];

const STREAMED_OFFSETS = STREAMED.map((_, index) =>
  STREAMED.slice(0, index).reduce((total, block) => total + block.code.length, 0),
);
const STREAMED_LENGTH = STREAMED.reduce((sum, block) => sum + block.code.length, 0);

type MarkdownPart =
  | { kind: 'paragraph'; segments: { code: boolean; text: string }[] }
  | { kind: 'code'; language: string; code: string; complete: boolean };

/** Just enough Markdown for the answer: paragraphs with inline code, and fenced code blocks (open ones included). */
function parseMarkdown(text: string): MarkdownPart[] {
  const parts: MarkdownPart[] = [];
  const lines = text.split('\n');
  let index = 0;
  while (index < lines.length) {
    const line = lines[index];
    if (line.startsWith('```')) {
      const language = line.slice(3).trim();
      const body: string[] = [];
      index++;
      while (index < lines.length && !lines[index].startsWith('```')) {
        body.push(lines[index]);
        index++;
      }
      const complete = index < lines.length;
      parts.push({ kind: 'code', language, code: body.join('\n'), complete });
      index++;
      continue;
    }
    if (line.trim()) {
      const segments = line.split('`').map((segment, i) => ({ code: i % 2 === 1, text: segment }));
      parts.push({ kind: 'paragraph', segments: segments.filter(segment => segment.text) });
    }
    index++;
  }
  return parts;
}

/** Moves a position to `length`, three characters every 16 ms, like shadcn's `useStream`. */
function injectStream(length: number) {
  const position = signal(length);
  let timer: ReturnType<typeof setInterval> | undefined;
  inject(DestroyRef).onDestroy(() => clearInterval(timer));
  return {
    position,
    replay: () => {
      clearInterval(timer);
      position.set(0);
      timer = setInterval(() => {
        position.update(value => Math.min(value + 3, length));
        if (position() >= length) clearInterval(timer);
      }, 16);
    },
  };
}

/** shadcn/ui's `code-block-example`, in zard: the same thirty examples, with the same code. */
@Component({
  selector: 'z-code-block-example',
  imports: [
    ExampleImports,
    NgIcon,
    ZardBubbleImports,
    ZardButtonComponent,
    ZardCardImports,
    ZardCodeBlockImports,
    ZardDialogImports,
    ZardMessageImports,
    ZardTabComponent,
    ZardTabGroupComponent,
    ZardTraceImports,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideChevronDown, lucideDownload, lucideFileCode, lucideTerminal, lucideWrapText })],
  template: `
    <z-example-wrapper zClass="md:grid-cols-1">
      <z-example zTitle="Plain">
        <z-code-block>
          <z-code-block-content>{{ build }}</z-code-block-content>
        </z-code-block>
      </z-example>

      <z-example zTitle="Wrap">
        <z-code-block>
          <z-code-block-content zWrap>{{ error }}</z-code-block-content>
        </z-code-block>
      </z-example>

      <z-example zTitle="Line Numbers">
        <z-code-block>
          <z-code-block-content zLineNumbers>
            @for (line of sourceLines(); track $index) {
              <z-code-block-line [zTokens]="line" />
            }
          </z-code-block-content>
        </z-code-block>
      </z-example>

      <z-example zTitle="Header">
        <z-code-block>
          <z-code-block-header>
            <z-code-block-title>
              <ng-icon name="lucideTerminal" />
              Terminal
            </z-code-block-title>
            <z-code-block-actions>
              <z-code-block-copy-button [zValue]="install" />
            </z-code-block-actions>
          </z-code-block-header>
          <z-code-block-content>{{ install }}</z-code-block-content>
        </z-code-block>
      </z-example>

      <z-example zTitle="Actions">
        <z-code-block>
          <z-code-block-header>
            <z-code-block-title>app/api/chat/route.ts</z-code-block-title>
            <z-code-block-actions>
              <button
                type="button"
                z-button
                zType="ghost"
                zSize="icon-xs"
                aria-label="Wrap lines"
                class="aria-pressed:text-foreground"
                [attr.aria-pressed]="wrap()"
                (click)="wrap.set(!wrap())"
              >
                <ng-icon name="lucideWrapText" />
              </button>
              <button
                type="button"
                z-button
                zType="ghost"
                zSize="icon-xs"
                aria-label="Download"
                (click)="download(source, 'route.ts')"
              >
                <ng-icon name="lucideDownload" />
              </button>
              <z-code-block-copy-button [zValue]="source" />
            </z-code-block-actions>
          </z-code-block-header>
          <z-code-block-content zLineNumbers [zWrap]="wrap()">
            @for (line of sourceLines(); track $index) {
              <z-code-block-line [zTokens]="line" />
            }
          </z-code-block-content>
        </z-code-block>
      </z-example>

      <z-example zTitle="Destructive">
        <z-code-block zType="destructive">
          <z-code-block-header>
            <z-code-block-title>Error</z-code-block-title>
            <z-code-block-actions>
              <z-code-block-copy-button [zValue]="error" />
            </z-code-block-actions>
          </z-code-block-header>
          <z-code-block-content zWrap>{{ error }}</z-code-block-content>
        </z-code-block>
      </z-example>

      <z-example zTitle="Diff">
        <z-code-block>
          <z-code-block-header>
            <z-code-block-title>components/greeting.tsx</z-code-block-title>
          </z-code-block-header>
          <z-code-block-content zLineNumbers>
            @for (line of diffLines(); track $index) {
              <z-code-block-line [zTokens]="line" [zType]="diff[$index].type" />
            }
          </z-code-block-content>
        </z-code-block>
      </z-example>

      <z-example zTitle="Highlighted Lines">
        <z-code-block>
          <z-code-block-content zLineNumbers>
            @for (line of sourceLines(); track $index) {
              <z-code-block-line [zTokens]="line" [zType]="$index >= 5 && $index <= 8 ? 'highlighted' : 'default'" />
            }
          </z-code-block-content>
        </z-code-block>
      </z-example>

      <z-example zTitle="Height">
        <z-code-block>
          <z-code-block-header>
            <z-code-block-title>Logs</z-code-block-title>
            <z-code-block-actions>
              <z-code-block-copy-button [zValue]="log" />
            </z-code-block-actions>
          </z-code-block-header>
          <z-code-block-content class="scroll-fade-y max-h-48">{{ log }}</z-code-block-content>
        </z-code-block>
      </z-example>

      <z-example zTitle="Show More">
        <z-code-block>
          <z-code-block-header>
            <z-code-block-title>components/chat.tsx</z-code-block-title>
            <z-code-block-actions>
              <z-code-block-copy-button [zValue]="chat" />
            </z-code-block-actions>
          </z-code-block-header>
          <z-code-block-content
            id="create-code-block-show-more"
            zLineNumbers
            [class]="showMore() ? '' : 'scroll-fade-y max-h-64 overflow-y-hidden'"
          >
            @for (line of chatLines(); track $index) {
              <z-code-block-line [zTokens]="line" />
            }
          </z-code-block-content>
          <z-code-block-footer class="justify-center">
            <button
              type="button"
              z-button
              zType="ghost"
              zSize="xs"
              aria-controls="create-code-block-show-more"
              [attr.aria-expanded]="showMore()"
              (click)="showMore.set(!showMore())"
            >
              <ng-icon name="lucideChevronDown" class="transition-transform in-aria-expanded:rotate-180" />
              {{ showMore() ? 'Show less' : 'Show more' }}
            </button>
          </z-code-block-footer>
        </z-code-block>
      </z-example>

      <z-example zTitle="Show More with Max Height">
        <z-code-block>
          <z-code-block-header>
            <z-code-block-title>components/chat.tsx</z-code-block-title>
            <z-code-block-actions>
              <z-code-block-copy-button [zValue]="chat" />
            </z-code-block-actions>
          </z-code-block-header>
          <z-code-block-content
            id="create-code-block-show-more-scroll"
            zLineNumbers
            [class]="showMoreScroll() ? 'scroll-fade-y max-h-96' : 'scroll-fade-y max-h-64 overflow-y-hidden'"
          >
            @for (line of chatLines(); track $index) {
              <z-code-block-line [zTokens]="line" />
            }
          </z-code-block-content>
          <z-code-block-footer class="justify-center">
            <button
              type="button"
              z-button
              zType="ghost"
              zSize="xs"
              aria-controls="create-code-block-show-more-scroll"
              [attr.aria-expanded]="showMoreScroll()"
              (click)="showMoreScroll.set(!showMoreScroll())"
            >
              <ng-icon name="lucideChevronDown" class="transition-transform in-aria-expanded:rotate-180" />
              {{ showMoreScroll() ? 'Show less' : 'Show more' }}
            </button>
          </z-code-block-footer>
        </z-code-block>
      </z-example>

      <z-example zTitle="Syntax Highlighting">
        <z-code-block>
          <z-code-block-header>
            <z-code-block-title>
              <ng-icon name="lucideFileCode" />
              app/api/chat/route.ts
            </z-code-block-title>
            <z-code-block-actions>
              <z-code-block-copy-button [zValue]="source" />
            </z-code-block-actions>
          </z-code-block-header>
          <z-code-block-content zLineNumbers>
            @for (line of sourceLines(); track $index) {
              <z-code-block-line [zTokens]="line" />
            }
          </z-code-block-content>
        </z-code-block>
      </z-example>

      <z-example zTitle="Empty">
        <z-code-block>
          <z-code-block-content />
        </z-code-block>
      </z-example>

      <z-example zTitle="Small">
        <z-code-block zSize="sm">
          <z-code-block-header>
            <z-code-block-title>
              <ng-icon name="lucideTerminal" />
              pnpm add ai &#64;ai-sdk/react zod
            </z-code-block-title>
            <z-code-block-actions>
              <z-code-block-copy-button [zValue]="install" />
            </z-code-block-actions>
          </z-code-block-header>
          <z-code-block-content zWrap>{{ install }}</z-code-block-content>
        </z-code-block>
      </z-example>

      <z-example zTitle="Small Destructive">
        <z-code-block zSize="sm" zType="destructive">
          <z-code-block-content zWrap>{{ error }}</z-code-block-content>
        </z-code-block>
      </z-example>

      <z-example zTitle="Trace">
        <z-trace>
          <z-trace-collapsible zOpen>
            <z-trace-collapsible-trigger>
              <z-trace-line>
                <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
                <z-trace-title>Ran pnpm add ai &#64;ai-sdk/react zod</z-trace-title>
              </z-trace-line>
            </z-trace-collapsible-trigger>
            <z-trace-collapsible-content>
              <z-code-block zSize="sm">
                <z-code-block-content zWrap class="max-h-64">{{ install }}</z-code-block-content>
              </z-code-block>
            </z-trace-collapsible-content>
          </z-trace-collapsible>
          <z-trace-collapsible zOpen>
            <z-trace-collapsible-trigger>
              <z-trace-line zStatus="error">
                <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
                <z-trace-title>Failed to run pnpm dev</z-trace-title>
              </z-trace-line>
            </z-trace-collapsible-trigger>
            <z-trace-collapsible-content>
              <z-code-block zSize="sm" zType="destructive">
                <z-code-block-content zWrap class="max-h-64">{{ error }}</z-code-block-content>
              </z-code-block>
            </z-trace-collapsible-content>
          </z-trace-collapsible>
        </z-trace>
      </z-example>

      <z-example zTitle="Typeset">
        <div class="typeset max-w-2xl">
          <h3>Stream a response</h3>
          <p>
            Create a route handler that calls
            <code>streamText</code>
            and returns the stream to the client. The
            <code>useChat</code>
            hook reads it on the other side.
          </p>
          <z-code-block>
            <z-code-block-header>
              <z-code-block-title>
                <ng-icon name="lucideFileCode" />
                app/api/chat/route.ts
              </z-code-block-title>
              <z-code-block-actions>
                <z-code-block-copy-button [zValue]="source" />
              </z-code-block-actions>
            </z-code-block-header>
            <z-code-block-content zLineNumbers>
              @for (line of sourceLines(); track $index) {
                <z-code-block-line [zTokens]="line" />
              }
            </z-code-block-content>
          </z-code-block>
          <p>Then install the packages the route uses.</p>
          <z-code-block>
            <z-code-block-content>
              @for (line of commandLines(); track $index) {
                <z-code-block-line [zTokens]="line" />
              }
            </z-code-block-content>
          </z-code-block>
          <p>The model streams text parts as they arrive, so the answer renders while it is written.</p>
        </div>
      </z-example>

      <z-example zTitle="Wrap and Line Numbers">
        <z-code-block>
          <z-code-block-header>
            <z-code-block-title>components/chat.tsx</z-code-block-title>
          </z-code-block-header>
          <z-code-block-content zWrap zLineNumbers>
            @for (line of chatLines(); track $index) {
              <z-code-block-line [zTokens]="line" />
            }
          </z-code-block-content>
        </z-code-block>
      </z-example>

      <z-example zTitle="Start Line">
        <z-code-block>
          <z-code-block-header>
            <z-code-block-title>app/dashboard/page.tsx</z-code-block-title>
          </z-code-block-header>
          <z-code-block-content zLineNumbers [zStartLine]="995">
            @for (line of middleLines(); track $index) {
              <z-code-block-line [zTokens]="line" />
            }
          </z-code-block-content>
        </z-code-block>
      </z-example>

      <z-example zTitle="Diff, Wrap and Highlighting">
        <z-code-block>
          <z-code-block-header>
            <z-code-block-title>app/api/projects/route.ts</z-code-block-title>
          </z-code-block-header>
          <z-code-block-content zWrap zLineNumbers [zStartLine]="12">
            @for (line of longDiffLines(); track $index) {
              <z-code-block-line [zTokens]="line" [zType]="longDiff[$index].type" />
            }
          </z-code-block-content>
        </z-code-block>
      </z-example>

      <z-example zTitle="Header Edges">
        <div class="flex flex-col gap-4">
          <z-code-block>
            <z-code-block-header>
              <z-code-block-title>Title only</z-code-block-title>
            </z-code-block-header>
            <z-code-block-content>console.log("title, no actions")</z-code-block-content>
          </z-code-block>
          <z-code-block>
            <z-code-block-actions>
              <z-code-block-copy-button [zValue]="install" />
            </z-code-block-actions>
            <z-code-block-content>{{ install }}</z-code-block-content>
          </z-code-block>
          <z-code-block>
            <z-code-block-header>
              <z-code-block-title>
                <ng-icon name="lucideFileCode" />
                apps/web/app/(dashboard)/settings/organizations/[organizationId]/members/invitations/page.tsx
              </z-code-block-title>
              <z-code-block-actions>
                <z-code-block-copy-button [zValue]="source" />
              </z-code-block-actions>
            </z-code-block-header>
            <z-code-block-content>{{ emptyPage }}</z-code-block-content>
          </z-code-block>
        </div>
      </z-example>

      <z-example zTitle="Single Line and Empty">
        <div class="flex flex-col gap-4">
          <z-code-block>
            <z-code-block-header>
              <z-code-block-title>Install</z-code-block-title>
              <z-code-block-actions>
                <z-code-block-copy-button [zValue]="addCodeBlock" />
              </z-code-block-actions>
            </z-code-block-header>
            <z-code-block-content>
              @for (line of addCodeBlockLines(); track $index) {
                <z-code-block-line [zTokens]="line" />
              }
            </z-code-block-content>
          </z-code-block>
          <z-code-block>
            <z-code-block-header>
              <z-code-block-title>output.log</z-code-block-title>
            </z-code-block-header>
            <z-code-block-content />
          </z-code-block>
          <z-code-block>
            <z-code-block-content>
              @for (line of devLines(); track $index) {
                <z-code-block-line [zTokens]="line" />
              }
            </z-code-block-content>
          </z-code-block>
        </div>
      </z-example>

      <z-example zTitle="Small Combinations">
        <div class="flex flex-col gap-4">
          <z-code-block zSize="sm">
            <z-code-block-header>
              <z-code-block-title>components/greeting.tsx</z-code-block-title>
              <z-code-block-actions>
                <z-code-block-copy-button [zValue]="source" />
              </z-code-block-actions>
            </z-code-block-header>
            <z-code-block-content zLineNumbers>
              @for (line of diffLines(); track $index) {
                <z-code-block-line [zTokens]="line" [zType]="diff[$index].type" />
              }
            </z-code-block-content>
          </z-code-block>
          <z-code-block zSize="sm">
            <z-code-block-content zLineNumbers [zStartLine]="995">
              @for (line of sourceLines(); track $index) {
                <z-code-block-line [zTokens]="line" />
              }
            </z-code-block-content>
          </z-code-block>
        </div>
      </z-example>

      <z-example zTitle="Streaming">
        <div class="flex flex-col gap-4">
          @for (block of streamedBlocks(); track $index) {
            @if (block.visible) {
              <z-code-block>
                @if (block.title) {
                  <z-code-block-header>
                    <z-code-block-title>{{ block.title }}</z-code-block-title>
                    <z-code-block-actions>
                      <z-code-block-copy-button [zValue]="block.text" [zDisabled]="!block.complete" />
                    </z-code-block-actions>
                  </z-code-block-header>
                }
                <z-code-block-content [zLineNumbers]="!!block.lineNumbers">
                  @for (line of block.lines; track $index) {
                    <z-code-block-line [zTokens]="line" [zType]="block.types[$index]" />
                  }
                </z-code-block-content>
              </z-code-block>
            }
          }
          <button
            type="button"
            z-button
            zType="outline"
            zSize="sm"
            class="self-start"
            [disabled]="streamPosition() < streamedLength"
            (click)="replayStream()"
          >
            Replay
          </button>
        </div>
      </z-example>

      <z-example zTitle="Markdown">
        <div class="flex flex-col gap-4 text-sm">
          <div class="space-y-4 whitespace-normal [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
            @for (part of markdown(); track $index) {
              @if (part.kind === 'paragraph') {
                <p>
                  @for (segment of part.segments; track $index) {
                    @if (segment.code) {
                      <code class="bg-muted rounded-sm px-1 py-0.5 font-mono text-[0.9em]">{{ segment.text }}</code>
                    } @else {
                      {{ segment.text }}
                    }
                  }
                </p>
              } @else {
                <z-code-block class="my-3">
                  <z-code-block-header>
                    <z-code-block-title>{{ part.language || 'text' }}</z-code-block-title>
                    <z-code-block-actions>
                      <z-code-block-copy-button [zValue]="part.code" [zDisabled]="!part.complete" />
                    </z-code-block-actions>
                  </z-code-block-header>
                  <z-code-block-content>
                    @for (line of markdownLines()[$index]; track $index) {
                      <z-code-block-line [zTokens]="line" />
                    }
                  </z-code-block-content>
                </z-code-block>
              }
            }
          </div>
          <button
            type="button"
            z-button
            zType="outline"
            zSize="sm"
            class="self-start"
            [disabled]="markdownPosition() < answerLength"
            (click)="replayMarkdown()"
          >
            Replay
          </button>
        </div>
      </z-example>

      <z-example zTitle="Languages">
        <div class="flex flex-col gap-4">
          @for (sample of samples; track sample.language) {
            <z-code-block>
              <z-code-block-header>
                <z-code-block-title>{{ sample.title }}</z-code-block-title>
              </z-code-block-header>
              <z-code-block-content>
                @for (line of sample.lines(); track $index) {
                  <z-code-block-line [zTokens]="line" />
                }
              </z-code-block-content>
            </z-code-block>
          }
          <z-code-block>
            <z-code-block-header>
              <z-code-block-title>ANSI</z-code-block-title>
            </z-code-block-header>
            <z-code-block-content zWrap>
              @for (line of ansiLines(); track $index) {
                <z-code-block-line [zTokens]="line" />
              }
            </z-code-block-content>
          </z-code-block>
        </div>
      </z-example>

      <z-example zTitle="Card and Dialog">
        <div class="flex flex-col items-start gap-4">
          <z-card class="w-full">
            <z-card-header>
              <z-card-title zTitle="Install the AI SDK" />
              <z-card-description zDescription="Add the packages to your project." />
            </z-card-header>
            <z-card-content>
              <z-code-block>
                <z-code-block-header>
                  <z-code-block-title>Terminal</z-code-block-title>
                  <z-code-block-actions>
                    <z-code-block-copy-button [zValue]="addPackages" />
                  </z-code-block-actions>
                </z-code-block-header>
                <z-code-block-content>
                  @for (line of addPackagesLines(); track $index) {
                    <z-code-block-line [zTokens]="line" />
                  }
                </z-code-block-content>
              </z-code-block>
            </z-card-content>
          </z-card>
          <button type="button" z-button zType="outline" (click)="dialogOpen.set(true)">View route</button>
          <z-dialog class="sm:max-w-xl" [(zVisible)]="dialogOpen">
            <z-dialog-header>
              <z-dialog-title>app/api/chat/route.ts</z-dialog-title>
              <z-dialog-description>The route that streams the answer.</z-dialog-description>
            </z-dialog-header>
            <z-code-block>
              <z-code-block-content zLineNumbers>
                @for (line of sourceLines(); track $index) {
                  <z-code-block-line [zTokens]="line" />
                }
              </z-code-block-content>
            </z-code-block>
          </z-dialog>
        </div>
      </z-example>

      <z-example zTitle="Chat Answer">
        <div class="flex flex-col gap-4 text-sm">
          <z-message zAlign="end">
            <z-message-content>
              <z-bubble>
                <z-bubble-content>How do I stream a response?</z-bubble-content>
              </z-bubble>
            </z-message-content>
          </z-message>
          <z-message>
            <z-message-content class="gap-3">
              <p>Create a route handler that returns the stream:</p>
              <z-code-block>
                <z-code-block-header>
                  <z-code-block-title>app/api/chat/route.ts</z-code-block-title>
                  <z-code-block-actions>
                    <z-code-block-copy-button [zValue]="source" />
                  </z-code-block-actions>
                </z-code-block-header>
                <z-code-block-content>
                  @for (line of sourceLines(); track $index) {
                    <z-code-block-line [zTokens]="line" />
                  }
                </z-code-block-content>
              </z-code-block>
              <p>The client reads it with useChat.</p>
            </z-message-content>
          </z-message>
        </div>
      </z-example>

      <z-example zTitle="Tabs">
        <z-tab-group>
          @for (file of files; track file.id) {
            <z-tab [label]="file.title.split('/').at(-1)!">
              <z-code-block>
                <z-code-block-header>
                  <z-code-block-title>{{ file.title }}</z-code-block-title>
                  <z-code-block-actions>
                    <z-code-block-copy-button [zValue]="file.code" />
                  </z-code-block-actions>
                </z-code-block-header>
                <z-code-block-content zLineNumbers>
                  @for (line of file.lines(); track $index) {
                    <z-code-block-line [zTokens]="line" />
                  }
                </z-code-block-content>
              </z-code-block>
            </z-tab>
          }
        </z-tab-group>
      </z-example>

      <z-example zTitle="RTL">
        <div dir="rtl" class="flex flex-col gap-3 text-sm">
          <p>أنشئ ملف المسار وأعد البث إلى العميل.</p>
          <z-code-block>
            <z-code-block-header>
              <z-code-block-title>app/api/chat/route.ts</z-code-block-title>
              <z-code-block-actions>
                <z-code-block-copy-button [zValue]="source" />
              </z-code-block-actions>
            </z-code-block-header>
            <z-code-block-content zLineNumbers>
              @for (line of sourceLines(); track $index) {
                <z-code-block-line [zTokens]="line" />
              }
            </z-code-block-content>
          </z-code-block>
        </div>
      </z-example>
    </z-example-wrapper>
  `,
})
export class CodeBlockExampleComponent {
  protected readonly build = BUILD;
  protected readonly install = INSTALL;
  protected readonly error = ERROR;
  protected readonly source = SOURCE;
  protected readonly chat = CHAT;
  protected readonly log = LOG;
  protected readonly diff = DIFF;
  protected readonly longDiff = LONG_DIFF;
  protected readonly emptyPage = 'export default function Page() {}';
  protected readonly addCodeBlock = 'pnpm dlx shadcn@latest add code-block';
  protected readonly addPackages = 'pnpm add ai @ai-sdk/react zod';
  protected readonly streamedLength = STREAMED_LENGTH;
  protected readonly answerLength = ANSWER.length;

  protected readonly wrap = signal(false);
  protected readonly showMore = signal(false);
  protected readonly showMoreScroll = signal(false);
  protected readonly dialogOpen = signal(false);

  protected readonly sourceLines = injectHighlightedCode(SOURCE, 'ts');
  protected readonly chatLines = injectHighlightedCode(CHAT, 'tsx');
  protected readonly diffLines = injectHighlightedCode(DIFF.map(line => line.text).join('\n'), 'tsx');
  protected readonly longDiffLines = injectHighlightedCode(LONG_DIFF.map(line => line.text).join('\n'), 'ts');
  protected readonly middleLines = injectHighlightedCode(MIDDLE, 'tsx');
  protected readonly commandLines = injectHighlightedCode('pnpm add ai @ai-sdk/react zod', 'bash');
  protected readonly addCodeBlockLines = injectHighlightedCode('pnpm dlx shadcn@latest add code-block', 'bash');
  protected readonly addPackagesLines = injectHighlightedCode('pnpm add ai @ai-sdk/react zod', 'bash');
  protected readonly devLines = injectHighlightedCode('pnpm dev', 'bash');
  protected readonly ansiLines = injectHighlightedCode(ANSI, 'ansi');
  protected readonly samples = SAMPLES.map(sample => ({
    ...sample,
    lines: injectHighlightedCode(sample.code, sample.language),
  }));

  protected readonly files = FILES.map(file => ({ ...file, lines: injectHighlightedCode(file.code, file.language) }));

  private readonly stream = injectStream(STREAMED_LENGTH);
  protected readonly streamPosition = this.stream.position;
  private readonly streamedSlices = STREAMED.map((block, index) => {
    const code = computed(() => block.code.slice(0, Math.max(0, this.streamPosition() - STREAMED_OFFSETS[index])));
    const text = computed(() =>
      block.diff
        ? code()
            .split('\n')
            .map(row => row.slice(1))
            .join('\n')
        : code(),
    );
    return { code, text, lines: injectHighlightedCode(text, block.language) };
  });

  protected readonly streamedBlocks = computed(() =>
    STREAMED.map((block, index) => {
      const slice = this.streamedSlices[index];
      const rows = slice.code().split('\n');
      const types = slice.lines().map((_, line): ZardCodeBlockLineTypeVariants => {
        if (block.diff) {
          return rows[line]?.startsWith('+') ? 'added' : rows[line]?.startsWith('-') ? 'removed' : 'default';
        }
        return block.highlight?.includes(line) ? 'highlighted' : 'default';
      });
      return {
        ...block,
        visible: this.streamPosition() > STREAMED_OFFSETS[index],
        complete: slice.code().length >= block.code.length,
        text: slice.text(),
        lines: slice.lines(),
        types,
      };
    }),
  );

  private readonly markdownStream = injectStream(ANSWER.length);
  protected readonly markdownPosition = this.markdownStream.position;
  protected readonly markdown = computed(() => parseMarkdown(ANSWER.slice(0, this.markdownPosition())));
  // The answer has two fenced blocks; each part index maps to its highlighted lines (paragraph slots stay empty).
  private readonly markdownCode = [1, 3].map(index => {
    const part = computed(() => this.markdown()[index]);
    const code = computed(() => {
      const value = part();
      return value?.kind === 'code' ? value.code : '';
    });
    const language = computed(() => {
      const value = part();
      return value?.kind === 'code' ? value.language : '';
    });
    return { index, lines: injectHighlightedCode(code, language) };
  });

  protected readonly markdownLines = computed(() => {
    const lines: ZardCodeBlockLineTokens[][] = [];
    for (const block of this.markdownCode) lines[block.index] = block.lines();
    return lines;
  });

  protected replayStream(): void {
    this.stream.replay();
  }

  protected replayMarkdown(): void {
    this.markdownStream.replay();
  }

  protected download(code: string, filename: string): void {
    const url = URL.createObjectURL(new Blob([code], { type: 'text/plain' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }
}
