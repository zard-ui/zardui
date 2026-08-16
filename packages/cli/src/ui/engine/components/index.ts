/**
 * components — fábricas puras que retornam `Node` imutável (immediate-mode
 * declarativo, ADR-0002). Sem JSX, sem classes, sem estado oculto.
 * (Fatia vertical / PoC: fábricas reais. A pintura de cada tipo vive no renderer.)
 */

import type { Attr } from '../ansi/index.js';
import type { ColorRef } from '../frame/index.js';
import type { LayoutProps } from '../layout/index.js';

export interface Node {
  readonly type: string;
  readonly props: Readonly<Record<string, unknown>>;
  readonly children: readonly Node[];
  readonly key?: string;
}

export interface TextStyle {
  readonly color?: ColorRef;
  readonly background?: ColorRef;
  readonly attrs?: Attr;
  readonly bold?: boolean;
  readonly dim?: boolean;
  readonly italic?: boolean;
  readonly underline?: boolean;
  readonly inverse?: boolean;
  readonly wrap?: boolean;
  readonly align?: 'left' | 'center' | 'right';
}

export type BorderStyle = 'none' | 'single' | 'double' | 'round' | 'bold' | 'ascii';

export interface BoxProps extends LayoutProps {
  readonly border?: BorderStyle;
  readonly borderColor?: ColorRef;
  readonly title?: string;
  readonly background?: ColorRef;
}
export interface PanelProps extends BoxProps {
  readonly footer?: string;
}
export interface CardProps extends BoxProps {
  readonly subtitle?: string;
}
export interface SeparatorProps {
  readonly orientation?: 'horizontal' | 'vertical';
  readonly char?: string;
  readonly color?: ColorRef;
  readonly label?: string;
}
export interface HeaderProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly badge?: string;
  readonly align?: 'left' | 'center' | 'right';
}
export interface FooterProps {
  readonly items: readonly string[];
  readonly color?: ColorRef;
}
export interface EmptyStateProps {
  readonly icon?: string;
  readonly title: string;
  readonly description?: string;
  readonly hint?: string;
}
export interface BannerProps {
  readonly lines: readonly string[]; // arte ASCII (uma string por linha)
  readonly colors?: readonly string[]; // paradas do gradiente horizontal (hex)
  readonly align?: 'left' | 'center';
}
export interface GradientTextProps {
  readonly content: string;
  readonly colors?: readonly string[];
  readonly align?: 'left' | 'center' | 'right';
  readonly bold?: boolean;
}
export interface SpinnerProps {
  readonly variant?: 'dots' | 'line' | 'arc' | 'bounce';
  readonly label?: string;
  readonly color?: ColorRef;
  readonly frame?: number; // índice do quadro (fornecido pela animação)
  readonly glyph?: string; // quadro explícito (usado na PoC até o AnimationClock)
  readonly key?: string;
}
export interface ProgressProps {
  readonly value: number;
  readonly width?: number;
  readonly label?: string;
  readonly showPercent?: boolean;
  readonly color?: ColorRef;
}
export type StatusKind = 'ok' | 'warn' | 'error' | 'info' | 'pending';
export interface BadgeProps {
  readonly text: string;
  readonly kind?: StatusKind;
  readonly color?: ColorRef;
}
export interface StatusProps {
  readonly kind: StatusKind;
  readonly label: string;
}
export interface LogEntry {
  readonly level?: 'debug' | 'info' | 'warn' | 'error';
  readonly text: string;
}
export interface LogsProps {
  readonly source: readonly LogEntry[] | readonly string[];
  readonly max?: number;
  readonly follow?: boolean;
}
export interface TreeNodeData {
  readonly label: string;
  readonly children?: readonly TreeNodeData[];
  readonly expanded?: boolean;
}
export interface TreeProps {
  readonly root: TreeNodeData;
  readonly indent?: number;
}
export interface TableColumn {
  readonly header: string;
  readonly width?: number;
  readonly align?: 'left' | 'center' | 'right';
}
export interface TableProps {
  readonly columns: readonly TableColumn[];
  readonly rows: readonly (readonly string[])[];
  readonly border?: BorderStyle;
}
export interface ListProps {
  readonly items: readonly string[];
  readonly bullet?: string;
  readonly ordered?: boolean;
}
export interface InputProps {
  readonly key: string;
  readonly value: string;
  readonly placeholder?: string;
  readonly label?: string;
  readonly onChange?: (value: string) => void;
  readonly onSubmit?: (value: string) => void;
}
export interface PasswordProps extends InputProps {
  readonly mask?: string;
}
export interface SelectOption {
  readonly label: string;
  readonly value: string;
  readonly disabled?: boolean;
}
export interface SelectProps {
  readonly key: string;
  readonly options: readonly SelectOption[];
  readonly value?: string;
  readonly label?: string;
  readonly onChange?: (value: string) => void;
}
export interface ConfirmProps {
  readonly key: string;
  readonly message: string;
  readonly value?: boolean;
  readonly onChange?: (value: boolean) => void;
}
export interface CheckboxProps {
  readonly key: string;
  readonly label: string;
  readonly checked: boolean;
  readonly onChange?: (checked: boolean) => void;
}
export interface TextareaProps {
  readonly key: string;
  readonly value: string;
  readonly rows?: number;
  readonly placeholder?: string;
  readonly onChange?: (value: string) => void;
}

function node(type: string, props: object = {}, children: readonly Node[] = [], key?: string): Node {
  const p = props as Readonly<Record<string, unknown>>;
  return key === undefined ? { type, props: p, children } : { type, props: p, children, key };
}

// texto e contêineres
export function text(content: string, style: TextStyle = {}): Node {
  return node('text', { content, ...style });
}
export function box(props: BoxProps = {}, ...children: Node[]): Node {
  return node('box', props, children);
}
export function panel(props: PanelProps = {}, ...children: Node[]): Node {
  return node('panel', props, children);
}
export function card(props: CardProps = {}, ...children: Node[]): Node {
  return node('card', props, children);
}
export function separator(props: SeparatorProps = {}): Node {
  return node('separator', props);
}
export function header(props: HeaderProps): Node {
  return node('header', props);
}
export function footer(props: FooterProps): Node {
  return node('footer', props);
}
export function emptyState(props: EmptyStateProps): Node {
  return node('emptyState', props);
}
export function banner(props: BannerProps): Node {
  return node('banner', props);
}
export function gradientText(
  content: string,
  colors?: readonly string[],
  opts: { align?: 'left' | 'center' | 'right'; bold?: boolean } = {},
): Node {
  return node('gradientText', { content, colors, ...opts });
}

// layout
export function stack(props: LayoutProps = {}, ...children: Node[]): Node {
  return node('stack', props, children);
}
export function row(props: LayoutProps = {}, ...children: Node[]): Node {
  return node('row', props, children);
}
export function column(props: LayoutProps = {}, ...children: Node[]): Node {
  return node('column', props, children);
}
export function center(props: LayoutProps = {}, ...children: Node[]): Node {
  return node('center', props, children);
}
export function spacer(props: { readonly flexGrow?: number } = {}): Node {
  return node('spacer', props);
}
export function grid(props: LayoutProps & { readonly columns: number } = { columns: 1 }, ...children: Node[]): Node {
  return node('grid', props, children);
}

// feedback / status
export function spinner(props: SpinnerProps = {}): Node {
  return node('spinner', props, [], props.key);
}
export function progressBar(props: ProgressProps): Node {
  return node('progressBar', props);
}
export function badge(props: BadgeProps): Node {
  return node('badge', props);
}
export function status(props: StatusProps): Node {
  return node('status', props);
}
export function logs(props: LogsProps): Node {
  return node('logs', props);
}

// dados
export function tree(props: TreeProps): Node {
  return node('tree', props);
}
export function table(props: TableProps): Node {
  return node('table', props);
}
export function list(props: ListProps): Node {
  return node('list', props);
}

// interativos
export function input(props: InputProps): Node {
  return node('input', props, [], props.key);
}
export function password(props: PasswordProps): Node {
  return node('password', props, [], props.key);
}
export function select(props: SelectProps): Node {
  return node('select', props, [], props.key);
}
export function confirm(props: ConfirmProps): Node {
  return node('confirm', props, [], props.key);
}
export function checkbox(props: CheckboxProps): Node {
  return node('checkbox', props, [], props.key);
}
export function textarea(props: TextareaProps): Node {
  return node('textarea', props, [], props.key);
}

// raiz
export function screen(...children: Node[]): Node {
  return node('screen', {}, children);
}
