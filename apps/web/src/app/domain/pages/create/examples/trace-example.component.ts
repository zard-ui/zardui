import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowUpRight,
  lucideBookOpen,
  lucideBrain,
  lucideChevronRight,
  lucideFileSearch,
  lucideFileText,
  lucideGlobe,
  lucideLink,
  lucideSearch,
  lucideSun,
  lucideTerminal,
} from '@ng-icons/lucide';

import { ZardBadgeComponent } from '@zard/components/badge/badge.component';
import { ZardBubbleImports } from '@zard/components/bubble/bubble.imports';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCodeBlockImports } from '@zard/components/code-block/code-block.imports';
import { ZardDialogImports } from '@zard/components/dialog/dialog.imports';
import { ZardItemImports } from '@zard/components/item/item.imports';
import { ZardMessageImports } from '@zard/components/message/message.imports';
import { ZardSheetImports } from '@zard/components/sheet/sheet.imports';
import { ZardTraceImports } from '@zard/components/trace/trace.imports';

import { ExampleImports } from './example.component';

const REASONING = `The user wants to know why the checkout deploy is slow, so I should start from the build log instead of guessing.

The install and compile steps finish in under a minute. Image optimization takes almost four, and it runs on every deploy because the cache key includes the commit hash.

Keying the cache on the lockfile and the image directory should let most deploys skip that step entirely.`;

const README = `# Acme Chat

A chat app built with Next.js and the AI SDK.

## Getting started

pnpm install
pnpm dev

## Chat route

app/api/chat/route.ts streams responses through the AI Gateway.
Set AI_GATEWAY_API_KEY in .env.local.`;

const SOURCES = [
  { title: 'Caching build outputs | example.com', href: 'https://example.com/docs/caching' },
  { title: 'Image optimization reference | example.com', href: 'https://example.com/docs/images' },
  { title: 'Deploy hooks and cache keys | example.com', href: 'https://example.com/docs/deploy-hooks' },
] as const;

const WIKIPEDIA_RESULTS = [
  { title: 'Voyager program', href: 'https://en.wikipedia.org/wiki/Voyager_program' },
  { title: 'Voyager 1', href: 'https://en.wikipedia.org/wiki/Voyager_1' },
  { title: 'Voyager 2', href: 'https://en.wikipedia.org/wiki/Voyager_2' },
] as const;

const CHAT_TURNS = 3;

/**
 * shadcn/ui's `trace-example`, in zard. shadcn streams its two chats from the AI SDK; here "Send message" reveals the
 * next scripted turn already finished, and the command in the last turn waits for Approve or Deny.
 */
@Component({
  selector: 'z-trace-example',
  imports: [
    ExampleImports,
    NgIcon,
    ZardBadgeComponent,
    ZardBubbleImports,
    ZardButtonComponent,
    ZardCodeBlockImports,
    ZardDialogImports,
    ZardItemImports,
    ZardMessageImports,
    ZardSheetImports,
    ZardTraceImports,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({
      lucideArrowUpRight,
      lucideBookOpen,
      lucideBrain,
      lucideChevronRight,
      lucideFileSearch,
      lucideFileText,
      lucideGlobe,
      lucideLink,
      lucideSearch,
      lucideSun,
      lucideTerminal,
    }),
  ],
  template: `
    <z-example-wrapper>
      <z-example zTitle="Chat" zContainerClass="md:col-span-2">
        <div class="flex min-h-96 w-full max-w-xl flex-col gap-6 text-sm">
          @if (chatStep() >= 1) {
            <z-message zAlign="end">
              <z-message-content>
                <z-bubble zAlign="end" zVariant="muted">
                  <z-bubble-content>What's the weather in Lisbon and Tokyo?</z-bubble-content>
                </z-bubble>
              </z-message-content>
            </z-message>
            <z-message>
              <z-message-content class="gap-3">
                <z-trace>
                  <z-trace-collapsible>
                    <z-trace-collapsible-trigger>
                      <z-trace-line>
                        <z-trace-icon><ng-icon name="lucideBrain" /></z-trace-icon>
                        <z-trace-title>Thought</z-trace-title>
                      </z-trace-line>
                    </z-trace-collapsible-trigger>
                    <z-trace-collapsible-content class="whitespace-pre-wrap">
                      The user wants the weather in two cities. I'll look both up at once, then compare them in a
                      sentence.
                    </z-trace-collapsible-content>
                  </z-trace-collapsible>
                  @for (weather of weathers; track weather.city) {
                    <z-trace-collapsible>
                      <z-trace-collapsible-trigger>
                        <z-trace-line>
                          <z-trace-icon><ng-icon name="lucideSun" /></z-trace-icon>
                          <z-trace-title>Got weather for {{ weather.city }}</z-trace-title>
                        </z-trace-line>
                      </z-trace-collapsible-trigger>
                      <z-trace-collapsible-content>
                        <div class="flex flex-col gap-2">
                          <z-code-block zSize="sm">
                            <z-code-block-header><z-code-block-title>Input</z-code-block-title></z-code-block-header>
                            <z-code-block-content zWrap class="max-h-64">{{ weather.input }}</z-code-block-content>
                          </z-code-block>
                          <z-code-block zSize="sm">
                            <z-code-block-header><z-code-block-title>Output</z-code-block-title></z-code-block-header>
                            <z-code-block-content zWrap class="max-h-64">{{ weather.output }}</z-code-block-content>
                          </z-code-block>
                        </div>
                      </z-trace-collapsible-content>
                    </z-trace-collapsible>
                  }
                </z-trace>
                <p class="leading-relaxed">
                  Lisbon is 18°C and mainly clear. Tokyo is warmer at 26°C under a clear sky.
                </p>
              </z-message-content>
            </z-message>
          }

          @if (chatStep() >= 2) {
            <z-message zAlign="end">
              <z-message-content>
                <z-bubble zAlign="end" zVariant="muted">
                  <z-bubble-content>
                    Search Wikipedia for the Voyager probes and summarise with sources.
                  </z-bubble-content>
                </z-bubble>
              </z-message-content>
            </z-message>
            <z-message>
              <z-message-content class="gap-3">
                <z-trace>
                  <z-trace-collapsible>
                    <z-trace-collapsible-trigger>
                      <z-trace-line>
                        <z-trace-icon><ng-icon name="lucideBrain" /></z-trace-icon>
                        <z-trace-title>Thought</z-trace-title>
                      </z-trace-line>
                    </z-trace-collapsible-trigger>
                    <z-trace-collapsible-content class="whitespace-pre-wrap">
                      Start with a Wikipedia search. The Voyager 1 article should say where the probe is now.
                    </z-trace-collapsible-content>
                  </z-trace-collapsible>
                  <z-trace-collapsible>
                    <z-trace-collapsible-trigger>
                      <z-trace-line>
                        <z-trace-icon><ng-icon name="lucideBookOpen" /></z-trace-icon>
                        <z-trace-title>Searched Wikipedia for “Voyager probes”</z-trace-title>
                      </z-trace-line>
                    </z-trace-collapsible-trigger>
                    <z-trace-collapsible-content>
                      <z-trace>
                        @for (result of wikipediaResults; track result.href) {
                          <a [href]="result.href" target="_blank" rel="noreferrer">
                            <z-trace-line>
                              <z-trace-icon><ng-icon name="lucideGlobe" /></z-trace-icon>
                              <z-trace-title>
                                {{ result.title }}
                                <span class="sr-only">(opens in a new tab)</span>
                              </z-trace-title>
                              <z-trace-icon><ng-icon name="lucideArrowUpRight" /></z-trace-icon>
                            </z-trace-line>
                          </a>
                        }
                      </z-trace>
                    </z-trace-collapsible-content>
                  </z-trace-collapsible>
                  <z-trace-collapsible>
                    <z-trace-collapsible-trigger>
                      <z-trace-line>
                        <z-trace-icon><ng-icon name="lucideGlobe" /></z-trace-icon>
                        <z-trace-title>Fetched en.wikipedia.org/wiki/Voyager_1</z-trace-title>
                      </z-trace-line>
                    </z-trace-collapsible-trigger>
                    <z-trace-collapsible-content>
                      <div class="flex flex-col gap-2">
                        <z-code-block zSize="sm">
                          <z-code-block-header><z-code-block-title>Input</z-code-block-title></z-code-block-header>
                          <z-code-block-content zWrap class="max-h-64">{{ voyagerInput }}</z-code-block-content>
                        </z-code-block>
                        <z-code-block zSize="sm">
                          <z-code-block-header><z-code-block-title>Output</z-code-block-title></z-code-block-header>
                          <z-code-block-content zWrap class="max-h-64">{{ voyagerOutput }}</z-code-block-content>
                        </z-code-block>
                      </div>
                    </z-trace-collapsible-content>
                  </z-trace-collapsible>
                </z-trace>
                <p class="leading-relaxed">
                  NASA launched both Voyager probes in 1977 to study the outer planets. Both have since reached
                  interstellar space, and Voyager 1 is the most distant human-made object from Earth.
                </p>
                <z-trace>
                  <z-trace-collapsible>
                    <z-trace-collapsible-trigger>
                      <z-trace-line>
                        <z-trace-icon><ng-icon name="lucideLink" /></z-trace-icon>
                        <z-trace-title>Used 2 sources</z-trace-title>
                      </z-trace-line>
                    </z-trace-collapsible-trigger>
                    <z-trace-collapsible-content>
                      <z-trace>
                        @for (result of wikipediaResults.slice(0, 2); track result.href) {
                          <a [href]="result.href" target="_blank" rel="noreferrer">
                            <z-trace-line>
                              <z-trace-icon><ng-icon name="lucideGlobe" /></z-trace-icon>
                              <z-trace-title>
                                {{ result.title }}
                                <span class="sr-only">(opens in a new tab)</span>
                              </z-trace-title>
                              <z-trace-icon><ng-icon name="lucideArrowUpRight" /></z-trace-icon>
                            </z-trace-line>
                          </a>
                        }
                      </z-trace>
                    </z-trace-collapsible-content>
                  </z-trace-collapsible>
                </z-trace>
              </z-message-content>
            </z-message>
          }

          @if (chatStep() >= 3) {
            <z-message zAlign="end">
              <z-message-content>
                <z-bubble zAlign="end" zVariant="muted">
                  <z-bubble-content>Read the README and the changelog, then check the Node version.</z-bubble-content>
                </z-bubble>
              </z-message-content>
            </z-message>
            <z-message>
              <z-message-content class="gap-3">
                <z-trace>
                  <z-trace-collapsible>
                    <z-trace-collapsible-trigger>
                      <z-trace-line>
                        <z-trace-icon><ng-icon name="lucideBrain" /></z-trace-icon>
                        <z-trace-title>Thought</z-trace-title>
                      </z-trace-line>
                    </z-trace-collapsible-trigger>
                    <z-trace-collapsible-content class="whitespace-pre-wrap">
                      Read both files first. Running a command needs the user's approval.
                    </z-trace-collapsible-content>
                  </z-trace-collapsible>
                  <button type="button" (click)="readmeOpen.set(true)">
                    <z-trace-line>
                      <z-trace-icon><ng-icon name="lucideFileText" /></z-trace-icon>
                      <z-trace-title>Read README.md</z-trace-title>
                      <z-trace-icon><ng-icon name="lucideChevronRight" class="rtl:-scale-x-100" /></z-trace-icon>
                    </z-trace-line>
                  </button>
                  <z-trace-collapsible>
                    <z-trace-collapsible-trigger>
                      <z-trace-line zStatus="error">
                        <z-trace-icon><ng-icon name="lucideFileText" /></z-trace-icon>
                        <z-trace-title>Couldn't read CHANGELOG.md</z-trace-title>
                      </z-trace-line>
                    </z-trace-collapsible-trigger>
                    <z-trace-collapsible-content>
                      <z-code-block zSize="sm" zType="destructive">
                        <z-code-block-content zWrap class="max-h-64">{{ changelogError }}</z-code-block-content>
                      </z-code-block>
                    </z-trace-collapsible-content>
                  </z-trace-collapsible>
                  @if (approval() === 'approved') {
                    <z-trace-collapsible>
                      <z-trace-collapsible-trigger>
                        <z-trace-line>
                          <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
                          <z-trace-title>Ran node --version</z-trace-title>
                        </z-trace-line>
                      </z-trace-collapsible-trigger>
                      <z-trace-collapsible-content>
                        <z-code-block zSize="sm">
                          <z-code-block-content zWrap class="max-h-64">v24.18.0</z-code-block-content>
                        </z-code-block>
                      </z-trace-collapsible-content>
                    </z-trace-collapsible>
                  } @else if (approval() === 'denied') {
                    <z-trace-line>
                      <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
                      <z-trace-title>Denied node --version</z-trace-title>
                    </z-trace-line>
                  }
                </z-trace>
                @switch (approval()) {
                  @case ('pending') {
                    <z-item zVariant="outline" zSize="sm">
                      <z-item-media zVariant="icon"><ng-icon name="lucideTerminal" /></z-item-media>
                      <z-item-content>
                        <z-item-title>Run node --version?</z-item-title>
                        <z-item-description>The command runs in this project.</z-item-description>
                      </z-item-content>
                      <z-item-actions>
                        <button type="button" z-button zType="outline" zSize="sm" (click)="approval.set('denied')">
                          Deny
                        </button>
                        <button type="button" z-button zSize="sm" (click)="approval.set('approved')">Approve</button>
                      </z-item-actions>
                    </z-item>
                  }
                  @case ('approved') {
                    <p class="leading-relaxed">
                      The README covers setup and the chat route. There is no changelog. The project runs on Node
                      v24.18.0.
                    </p>
                  }
                  @case ('denied') {
                    <p class="leading-relaxed">
                      The README covers setup and the chat route. There is no changelog. I didn't run the command.
                    </p>
                  }
                }
              </z-message-content>
            </z-message>
          }

          <button
            type="button"
            z-button
            zType="outline"
            zSize="sm"
            class="mt-auto self-start"
            [disabled]="chatDone() && approval() === 'pending'"
            (click)="sendChatMessage()"
          >
            {{ chatDone() ? 'Reset' : 'Send message' }}
          </button>
        </div>

        <z-sheet [(zVisible)]="readmeOpen">
          <z-sheet-header>
            <z-sheet-title class="font-mono">README.md</z-sheet-title>
            <z-sheet-description>{{ readmeLines }} lines</z-sheet-description>
          </z-sheet-header>
          <z-code-block class="mx-4 mb-4 min-h-0 w-auto flex-1">
            <z-code-block-content zWrap>{{ readme }}</z-code-block-content>
          </z-code-block>
        </z-sheet>
      </z-example>

      <z-example zTitle="Rows">
        <z-trace class="max-w-md">
          <z-trace-line zStatus="running">
            <z-trace-icon><ng-icon name="lucideFileSearch" /></z-trace-icon>
            <z-trace-title>Scanning 52 files</z-trace-title>
          </z-trace-line>
          <z-trace-collapsible>
            <z-trace-collapsible-trigger>
              <z-trace-line>
                <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
                <z-trace-title>Ran node --version</z-trace-title>
              </z-trace-line>
            </z-trace-collapsible-trigger>
            <z-trace-collapsible-content>
              <z-code-block zSize="sm">
                <z-code-block-content zWrap class="max-h-64">v24.18.0</z-code-block-content>
              </z-code-block>
            </z-trace-collapsible-content>
          </z-trace-collapsible>
          <a href="#rows">
            <z-trace-line>
              <z-trace-icon><ng-icon name="lucideFileText" /></z-trace-icon>
              <z-trace-title>Read apps/v4/lib/docs.ts</z-trace-title>
              <z-trace-icon><ng-icon name="lucideChevronRight" class="rtl:-scale-x-100" /></z-trace-icon>
            </z-trace-line>
          </a>
          <button type="button" (click)="filesOpen.set(true)">
            <z-trace-line>
              <z-trace-icon><ng-icon name="lucideFileSearch" /></z-trace-icon>
              <z-trace-title>Explored 4 files</z-trace-title>
              <z-trace-icon><ng-icon name="lucideChevronRight" class="rtl:-scale-x-100" /></z-trace-icon>
            </z-trace-line>
          </button>
          <button type="button" (click)="searchOpen.set(true)">
            <z-trace-line>
              <z-trace-icon><ng-icon name="lucideGlobe" /></z-trace-icon>
              <z-trace-title>Searched the web for cache keys</z-trace-title>
              <z-trace-icon><ng-icon name="lucideChevronRight" class="rtl:-scale-x-100" /></z-trace-icon>
            </z-trace-line>
          </button>
        </z-trace>

        <z-sheet [(zVisible)]="filesOpen">
          <z-sheet-header>
            <z-sheet-title>Explored 4 files</z-sheet-title>
            <z-sheet-description>Files read while preparing the response.</z-sheet-description>
          </z-sheet-header>
          <ul class="flex flex-col gap-2 px-4 font-mono text-xs">
            <li>apps/v4/lib/docs.ts</li>
            <li>apps/v4/lib/components.ts</li>
            <li>apps/v4/next.config.mjs</li>
            <li>apps/v4/package.json</li>
          </ul>
        </z-sheet>

        <z-dialog [(zVisible)]="searchOpen">
          <z-dialog-header>
            <z-dialog-title>Searched the web for cache keys</z-dialog-title>
            <z-dialog-description>Three results were used in the response.</z-dialog-description>
          </z-dialog-header>
          <ul class="flex flex-col gap-2 text-sm">
            <li>Caching build outputs</li>
            <li>Image optimization reference</li>
            <li>Deploy hooks and cache keys</li>
          </ul>
        </z-dialog>
      </z-example>

      <z-example zTitle="Tool Calls">
        <z-trace class="max-w-md">
          <z-trace-collapsible>
            <z-trace-collapsible-trigger>
              <z-trace-line zStatus="running">
                <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
                <z-trace-title>Running npm --version</z-trace-title>
              </z-trace-line>
            </z-trace-collapsible-trigger>
            <z-trace-collapsible-content>
              <z-code-block zSize="sm">
                <z-code-block-content zWrap class="max-h-64">$ npm --version</z-code-block-content>
              </z-code-block>
            </z-trace-collapsible-content>
          </z-trace-collapsible>
          <z-trace-collapsible>
            <z-trace-collapsible-trigger>
              <z-trace-line>
                <z-trace-icon><ng-icon name="lucideGlobe" /></z-trace-icon>
                <z-trace-title>Searched the web for app getting started installation</z-trace-title>
              </z-trace-line>
            </z-trace-collapsible-trigger>
            <z-trace-collapsible-content class="flex flex-wrap gap-1.5">
              <z-badge zType="secondary">example.com/docs/install</z-badge>
              <z-badge zType="secondary">example.com/blog/getting-started</z-badge>
            </z-trace-collapsible-content>
          </z-trace-collapsible>
          <z-trace-line>
            <z-trace-icon><ng-icon name="lucideSearch" /></z-trace-icon>
            <z-trace-title>Searched for minimumReleaseAge</z-trace-title>
          </z-trace-line>
          <z-trace-collapsible zOpen>
            <z-trace-collapsible-trigger>
              <z-trace-line>
                <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
                <z-trace-title>Ran node --version</z-trace-title>
              </z-trace-line>
            </z-trace-collapsible-trigger>
            <z-trace-collapsible-content>
              <z-code-block zSize="sm">
                <z-code-block-content zWrap>{{ nodeVersion }}</z-code-block-content>
              </z-code-block>
            </z-trace-collapsible-content>
          </z-trace-collapsible>
          <z-trace-collapsible>
            <z-trace-collapsible-trigger>
              <z-trace-line zStatus="error">
                <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
                <z-trace-title>Failed to run pnpm --version</z-trace-title>
              </z-trace-line>
            </z-trace-collapsible-trigger>
            <z-trace-collapsible-content>
              <z-code-block zSize="sm" zType="destructive">
                <z-code-block-content zWrap class="max-h-64">command not found: pnpm</z-code-block-content>
              </z-code-block>
            </z-trace-collapsible-content>
          </z-trace-collapsible>
        </z-trace>
      </z-example>

      <z-example zTitle="Reasoning">
        <div class="flex w-full max-w-md flex-col gap-8">
          <z-trace-collapsible>
            <z-trace-collapsible-trigger>
              <z-trace-line>
                <z-trace-title>Thought for 12 seconds</z-trace-title>
              </z-trace-line>
            </z-trace-collapsible-trigger>
            <z-trace-collapsible-content class="whitespace-pre-wrap">{{ reasoning }}</z-trace-collapsible-content>
          </z-trace-collapsible>
          <div class="flex min-h-80 flex-col gap-4 border-t pt-8">
            @if (reasoningSent()) {
              <p class="text-sm font-medium">Why is the checkout deploy so slow?</p>
              <z-trace>
                <z-trace-collapsible>
                  <z-trace-collapsible-trigger>
                    <z-trace-line>
                      <z-trace-title>Thought</z-trace-title>
                    </z-trace-line>
                  </z-trace-collapsible-trigger>
                  <z-trace-collapsible-content class="whitespace-pre-wrap">{{ reasoning }}</z-trace-collapsible-content>
                </z-trace-collapsible>
              </z-trace>
              <p class="text-sm leading-relaxed">
                Image optimization is the bottleneck. It reruns on every deploy because the cache key includes the
                commit hash. Key it on the lockfile and the image directory instead.
              </p>
            }
            <button
              type="button"
              z-button
              zType="outline"
              zSize="sm"
              class="mt-auto self-start"
              (click)="reasoningSent.set(!reasoningSent())"
            >
              {{ reasoningSent() ? 'Reset' : 'Send message' }}
            </button>
          </div>
        </div>
      </z-example>

      <z-example zTitle="Chain of Thought">
        <z-trace-collapsible class="max-w-md" zOpen>
          <z-trace-collapsible-trigger>
            <z-trace-line zStatus="running">
              <z-trace-title>Looking into the slow deploy</z-trace-title>
            </z-trace-line>
          </z-trace-collapsible-trigger>
          <z-trace-collapsible-content zKeepMounted>
            <z-trace>
              <z-trace-collapsible>
                <z-trace-collapsible-trigger>
                  <z-trace-line>
                    <z-trace-icon><ng-icon name="lucideSearch" /></z-trace-icon>
                    <z-trace-title>Searched for the checkout build log</z-trace-title>
                  </z-trace-line>
                </z-trace-collapsible-trigger>
                <z-trace-collapsible-content class="flex flex-wrap gap-1.5">
                  <z-badge zType="secondary">vercel.com</z-badge>
                  <z-badge zType="secondary">github.com</z-badge>
                  <z-badge zType="secondary">nextjs.org</z-badge>
                </z-trace-collapsible-content>
              </z-trace-collapsible>
              <z-trace-collapsible zOpen>
                <z-trace-collapsible-trigger>
                  <z-trace-line>
                    <z-trace-icon><ng-icon name="lucideFileText" /></z-trace-icon>
                    <z-trace-title>Read the last twelve deploys</z-trace-title>
                  </z-trace-line>
                </z-trace-collapsible-trigger>
                <z-trace-collapsible-content>
                  Image optimization takes almost four minutes on every deploy. The other steps finish in under a
                  minute.
                </z-trace-collapsible-content>
              </z-trace-collapsible>
              <z-trace-collapsible>
                <z-trace-collapsible-trigger>
                  <z-trace-line zStatus="running">
                    <z-trace-icon><ng-icon name="lucideSearch" /></z-trace-icon>
                    <z-trace-title>Searching for the cache key</z-trace-title>
                  </z-trace-line>
                </z-trace-collapsible-trigger>
                <z-trace-collapsible-content>
                  <z-code-block zSize="sm">
                    <z-code-block-content zWrap class="max-h-64">cache key image optimization</z-code-block-content>
                  </z-code-block>
                </z-trace-collapsible-content>
              </z-trace-collapsible>
            </z-trace>
          </z-trace-collapsible-content>
        </z-trace-collapsible>
      </z-example>

      <z-example zTitle="Task">
        <z-trace-collapsible class="max-w-md" zOpen>
          <z-trace-collapsible-trigger>
            <z-trace-line>
              <z-trace-title>Found the project files</z-trace-title>
            </z-trace-line>
          </z-trace-collapsible-trigger>
          <z-trace-collapsible-content zKeepMounted>
            <z-trace>
              <z-trace-line>
                <z-trace-icon><ng-icon name="lucideSearch" /></z-trace-icon>
                <z-trace-title>Searched for app/page.tsx</z-trace-title>
              </z-trace-line>
              <a href="#task">
                <z-trace-line>
                  <z-trace-icon><ng-icon name="lucideFileText" /></z-trace-icon>
                  <z-trace-title>Read app/page.tsx</z-trace-title>
                  <z-trace-icon><ng-icon name="lucideChevronRight" class="rtl:-scale-x-100" /></z-trace-icon>
                </z-trace-line>
              </a>
              <z-trace-line>
                <z-trace-icon><ng-icon name="lucideFileSearch" /></z-trace-icon>
                <z-trace-title>Scanned 52 files</z-trace-title>
              </z-trace-line>
              <a href="#task">
                <z-trace-line>
                  <z-trace-icon><ng-icon name="lucideFileText" /></z-trace-icon>
                  <z-trace-title>Read app/layout.tsx</z-trace-title>
                  <z-trace-icon><ng-icon name="lucideChevronRight" class="rtl:-scale-x-100" /></z-trace-icon>
                </z-trace-line>
              </a>
            </z-trace>
          </z-trace-collapsible-content>
        </z-trace-collapsible>
      </z-example>

      <z-example zTitle="Sources">
        <z-trace-collapsible class="max-w-md" zOpen>
          <z-trace-collapsible-trigger>
            <z-trace-line>
              <z-trace-title>Used {{ sources.length }} sources</z-trace-title>
            </z-trace-line>
          </z-trace-collapsible-trigger>
          <z-trace-collapsible-content>
            <z-trace>
              @for (source of sources; track source.href) {
                <a [href]="source.href" target="_blank" rel="noreferrer">
                  <z-trace-line>
                    <z-trace-icon><ng-icon name="lucideGlobe" /></z-trace-icon>
                    <z-trace-title>
                      {{ source.title }}
                      <span class="sr-only">(opens in a new tab)</span>
                    </z-trace-title>
                    <z-trace-icon><ng-icon name="lucideArrowUpRight" /></z-trace-icon>
                  </z-trace-line>
                </a>
              }
            </z-trace>
          </z-trace-collapsible-content>
        </z-trace-collapsible>
      </z-example>

      <z-example zTitle="Whole Turn" zContainerClass="md:col-span-2">
        <z-trace-collapsible class="max-w-md" zOpen>
          <z-trace-collapsible-trigger>
            <z-trace-line zStatus="error">
              <z-trace-title>Worked for 2m 4s, 1 command failed</z-trace-title>
            </z-trace-line>
          </z-trace-collapsible-trigger>
          <z-trace-collapsible-content zKeepMounted class="flex flex-col gap-2">
            <z-trace>
              <z-trace-collapsible>
                <z-trace-collapsible-trigger>
                  <z-trace-line>
                    <z-trace-icon><ng-icon name="lucideBrain" /></z-trace-icon>
                    <z-trace-title>Thought for 12 seconds</z-trace-title>
                  </z-trace-line>
                </z-trace-collapsible-trigger>
                <z-trace-collapsible-content class="whitespace-pre-wrap">{{ reasoning }}</z-trace-collapsible-content>
              </z-trace-collapsible>
              <z-trace-collapsible zOpen>
                <z-trace-collapsible-trigger>
                  <z-trace-line zStatus="error">
                    <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
                    <z-trace-title>Ran 3 commands, 1 failed</z-trace-title>
                  </z-trace-line>
                </z-trace-collapsible-trigger>
                <z-trace-collapsible-content zKeepMounted>
                  <z-trace>
                    <z-trace-collapsible>
                      <z-trace-collapsible-trigger>
                        <z-trace-line>
                          <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
                          <z-trace-title>Ran node --version</z-trace-title>
                        </z-trace-line>
                      </z-trace-collapsible-trigger>
                      <z-trace-collapsible-content>
                        <z-code-block zSize="sm">
                          <z-code-block-content zWrap class="max-h-64">v24.18.0</z-code-block-content>
                        </z-code-block>
                      </z-trace-collapsible-content>
                    </z-trace-collapsible>
                    <z-trace-line>
                      <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
                      <z-trace-title>Ran mkdir -p dist</z-trace-title>
                    </z-trace-line>
                    <z-trace-collapsible>
                      <z-trace-collapsible-trigger>
                        <z-trace-line zStatus="error">
                          <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
                          <z-trace-title>Failed to run pnpm --version</z-trace-title>
                        </z-trace-line>
                      </z-trace-collapsible-trigger>
                      <z-trace-collapsible-content>
                        <z-code-block zSize="sm" zType="destructive">
                          <z-code-block-content zWrap class="max-h-64">command not found: pnpm</z-code-block-content>
                        </z-code-block>
                      </z-trace-collapsible-content>
                    </z-trace-collapsible>
                  </z-trace>
                </z-trace-collapsible-content>
              </z-trace-collapsible>
            </z-trace>
            <p>Node is installed and pnpm is not. Reading the docs config.</p>
            <z-trace>
              <a href="#whole-turn">
                <z-trace-line>
                  <z-trace-icon><ng-icon name="lucideFileText" /></z-trace-icon>
                  <z-trace-title>Read apps/v4/lib/docs.ts</z-trace-title>
                  <z-trace-icon><ng-icon name="lucideChevronRight" class="rtl:-scale-x-100" /></z-trace-icon>
                </z-trace-line>
              </a>
            </z-trace>
          </z-trace-collapsible-content>
        </z-trace-collapsible>
      </z-example>
    </z-example-wrapper>
  `,
})
export class TraceExampleComponent {
  protected readonly reasoning = REASONING;
  protected readonly readme = README;
  protected readonly readmeLines = README.split('\n').length;
  protected readonly sources = SOURCES;
  protected readonly wikipediaResults = WIKIPEDIA_RESULTS;
  protected readonly nodeVersion = '$ node --version\nv24.18.0';
  protected readonly changelogError = "ENOENT: no such file or directory, open 'CHANGELOG.md'";
  protected readonly voyagerInput = JSON.stringify({ url: 'https://en.wikipedia.org/wiki/Voyager_1' });
  protected readonly voyagerOutput =
    'HTTP 200 · Voyager 1 - Wikipedia\n\nVoyager 1 is a space probe launched by NASA on September 5, 1977. It is the most distant human-made object from Earth.';

  protected readonly weathers = [
    { city: 'Lisbon', input: JSON.stringify({ city: 'Lisbon' }), output: 'Lisbon, Portugal\n18°C, Mainly clear' },
    { city: 'Tokyo', input: JSON.stringify({ city: 'Tokyo' }), output: 'Tokyo, Japan\n26°C, Clear sky' },
  ] as const;

  /** How many turns of the scripted chat are shown. */
  protected readonly chatStep = signal(0);
  protected readonly approval = signal<'pending' | 'approved' | 'denied'>('pending');
  protected readonly readmeOpen = signal(false);
  protected readonly filesOpen = signal(false);
  protected readonly searchOpen = signal(false);
  protected readonly reasoningSent = signal(false);
  protected readonly chatDone = computed(() => this.chatStep() >= CHAT_TURNS);

  protected sendChatMessage(): void {
    if (this.chatDone()) {
      this.chatStep.set(0);
      this.approval.set('pending');
      return;
    }
    this.chatStep.update(step => step + 1);
  }
}
