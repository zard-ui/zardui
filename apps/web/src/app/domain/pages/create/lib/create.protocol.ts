import type { DesignConfig } from '@zard/design';

/**
 * The `postMessage` protocol between the `/create` page and the preview iframe it hosts.
 *
 * Every message carries `channel` so unrelated traffic on the window is ignored. The iframe is only ever
 * reloaded when the previewed item changes; everything else travels as a `design` message.
 */
export const CREATE_CHANNEL = 'zard-create';

/** What the keyboard can ask for. Shared by the page and the iframe so both resolve keys the same way. */
export type CreateAction = 'navigate' | 'open-preset' | 'shuffle' | 'toggle-dark' | 'undo' | 'redo' | 'reset';

/** Page → iframe: apply this design. `design` already carries any hover preview. */
export interface DesignMessage {
  readonly channel: typeof CREATE_CHANNEL;
  readonly type: 'design';
  readonly design: DesignConfig;
  readonly dark: boolean;
}

/** Iframe → page: the preview app has booted and can receive a `design`. */
export interface ReadyMessage {
  readonly channel: typeof CREATE_CHANNEL;
  readonly type: 'ready';
}

/** Iframe → page: a shortcut was pressed while focus was inside the iframe. */
export interface ActionMessage {
  readonly channel: typeof CREATE_CHANNEL;
  readonly type: 'action';
  readonly action: CreateAction;
}

export type ToPreviewMessage = DesignMessage;
export type FromPreviewMessage = ReadyMessage | ActionMessage;

export function isCreateMessage(value: unknown): value is ToPreviewMessage | FromPreviewMessage {
  return (
    typeof value === 'object' &&
    value !== null &&
    (value as { channel?: unknown }).channel === CREATE_CHANNEL &&
    typeof (value as { type?: unknown }).type === 'string'
  );
}

/** The two canvases of the overview; `preview-01` is the default and never written to the URL. */
export const CANVAS_ITEMS = ['preview-01', 'preview-02'] as const;
export const DEFAULT_ITEM: string = CANVAS_ITEMS[0];
export const COMPONENT_ITEM_PREFIX = 'component:';
export const BLOCK_ITEM_PREFIX = 'block:';

export function isCanvasItem(item: string): boolean {
  return (CANVAS_ITEMS as readonly string[]).includes(item);
}
