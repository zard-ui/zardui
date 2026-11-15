import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  signal,
  type Signal,
} from '@angular/core';

import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';
import type { ZardBubbleVariantVariants } from '@/shared/components/bubble/bubble.variants';
import { ZardMessageImports } from '@/shared/components/message/message.imports';

/**
 * A scripted conversation for the chat demos: the docs have no model behind them, so each demo replays a fixed
 * script, streaming the assistant's replies word by word like a real response would arrive.
 */

export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  readonly id: string;
  readonly role: ChatRole;
  readonly text: string;
}

export interface ChatScriptStep {
  readonly role: ChatRole;
  readonly text: string;
  /** Stable id. Defaults to `<role>-<index>`. */
  readonly id?: string;
  /** Pause before an assistant reply starts streaming, in ms. */
  readonly delay?: number;
}

export type ChatStatus = 'ready' | 'submitted' | 'streaming';

export interface ScriptedChatOptions {
  /** How many script messages are already in the thread when the demo opens. */
  readonly initial?: number;
  /** Pause between streamed words, in ms. */
  readonly delayMs?: number;
}

export interface ScriptedChat {
  readonly messages: Signal<ChatMessage[]>;
  readonly status: Signal<ChatStatus>;
  readonly busy: Signal<boolean>;
  /** The user message the next `send()` adds, or `undefined` once the script is done. */
  readonly next: Signal<ChatMessage | undefined>;
  /** Adds the next user message, then streams the assistant reply that follows it in the script. */
  send(): Promise<void>;
  /** Back to the opening state, cancelling a reply that is still streaming. */
  reset(): void;
}

/** Every message of a script with its final text, for demos that render a saved transcript. */
export function scriptMessages(script: readonly ChatScriptStep[]): ChatMessage[] {
  return script.map((step, index) => ({ id: step.id ?? `${step.role}-${index}`, role: step.role, text: step.text }));
}

/** A scripted chat bound to the calling component: call it in a field initializer. */
export function injectScriptedChat(script: readonly ChatScriptStep[], options: ScriptedChatOptions = {}): ScriptedChat {
  const { initial = 0, delayMs = 20 } = options;
  const all = scriptMessages(script);
  const opening = all.slice(0, initial);

  const messages = signal<ChatMessage[]>(opening);
  const status = signal<ChatStatus>('ready');
  let run = 0;
  inject(DestroyRef).onDestroy(() => run++);

  const wait = (ms: number, current: number) =>
    new Promise<boolean>(resolve => setTimeout(() => resolve(current === run), ms));

  const next = computed(() => {
    const candidate = all[messages().length];
    return candidate?.role === 'user' ? candidate : undefined;
  });

  return {
    messages: messages.asReadonly(),
    status: status.asReadonly(),
    busy: computed(() => status() !== 'ready'),
    next,
    async send() {
      const message = next();
      if (!message || status() !== 'ready') return;

      const current = ++run;
      status.set('submitted');
      messages.update(list => [...list, message]);

      for (let index = messages().length; all[index]?.role === 'assistant'; index++) {
        const reply = all[index];
        if (!(await wait(script[index].delay ?? 300, current))) return;

        status.set('streaming');
        let shown = '';
        for (const word of reply.text.split(/(?<=\s)/)) {
          if (!(await wait(delayMs, current))) return;
          // The reply joins the thread with its first word, like a streamed message part.
          const first = !shown;
          shown += word;
          const streamed = { ...reply, text: shown };
          messages.update(list =>
            first ? [...list, streamed] : list.map(item => (item.id === reply.id ? streamed : item)),
          );
        }
      }
      status.set('ready');
    },
    reset() {
      run++;
      messages.set(opening);
      status.set('ready');
    },
  };
}

/** Splits a message into the paragraphs it is written in. */
export function chatParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map(paragraph => paragraph.trim())
    .filter(Boolean);
}

/** Entrance animations for a newly sent message. Transform and opacity only, so the row's measured height is stable. */
export const MESSAGE_ANIMATIONS = [
  { id: 'fade', name: 'Fade', class: 'animate-in fade-in-0 duration-200 ease-out' },
  { id: 'slide-up', name: 'Slide Up', class: 'animate-in fade-in-0 slide-in-from-bottom-2.5 duration-300' },
  { id: 'slide-side', name: 'Slide Side', class: 'animate-in fade-in-0 slide-in-from-right-4 duration-300' },
  {
    id: 'pop',
    name: 'Pop',
    class: 'origin-bottom-right animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-1.5 duration-300',
  },
  {
    id: 'spring-bounce',
    name: 'Spring Bounce',
    class: 'animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-3 duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
  },
  {
    id: 'blur-fade',
    name: 'Blur Fade',
    class:
      'transition-[opacity,filter,translate] duration-300 ease-out starting:translate-y-1.5 starting:opacity-0 starting:blur-sm',
  },
  { id: 'scale-fade', name: 'Scale Fade', class: 'animate-in fade-in-0 zoom-in-[0.98] duration-200 ease-out' },
] as const;

export type MessageAnimationId = (typeof MESSAGE_ANIMATIONS)[number]['id'];

/** The entrance class of a preset, with reduced motion turning it off. */
export function messageAnimationClass(id: MessageAnimationId): string {
  const preset = MESSAGE_ANIMATIONS.find(animation => animation.id === id) ?? MESSAGE_ANIMATIONS[0];
  return `${preset.class} motion-reduce:animate-none motion-reduce:transition-none`;
}

/** One chat row: the user's message as a muted bubble at the end, the assistant's reply as a ghost one at the start. */
@Component({
  selector: 'z-demo-chat-row',
  imports: [...ZardBubbleImports, ...ZardMessageImports],
  template: `
    @let message = zMessage();
    @let isUser = message.role === 'user';
    <z-message [zAlign]="isUser ? 'end' : 'start'">
      <z-message-content>
        <z-bubble [zAlign]="isUser ? 'end' : 'start'" [zVariant]="isUser ? zUserVariant() : zAssistantVariant()">
          <z-bubble-content class="space-y-2">
            @for (paragraph of paragraphs(); track $index) {
              <p class="whitespace-pre-wrap">{{ paragraph }}</p>
            }
          </z-bubble-content>
        </z-bubble>
      </z-message-content>
    </z-message>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class ZardDemoChatRowComponent {
  readonly zMessage = input.required<ChatMessage>();
  readonly zUserVariant = input<ZardBubbleVariantVariants>('muted');
  readonly zAssistantVariant = input<ZardBubbleVariantVariants>('ghost');

  protected readonly paragraphs = computed(() => chatParagraphs(this.zMessage().text));
}
