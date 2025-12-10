import { Component, ChangeDetectionStrategy, input, WritableSignal, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { SvgNodeProps } from './svg-node-props.interface';

const OUTPUT_PATH = 'M843.463 1.3315L245.316 5.47507L0.633077 4.69725';

@Component({
  selector: 'z-svg-outputs',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="844"
      height="80"
      viewBox="0 0 844 40"
      fill="none"
      class="output-line"
      style="opacity: 0.8"
    >
      <path d="M843.463 1.3315L245.316 5.47507L0.633077 4.69725" stroke="url(#output_gradient)" stroke-width="1.2" />
      @for (outputLine of outputLines(); track $index) {
        @if (outputLine().visible) {
          <circle
            [attr.cx]="getNodePosition(OUTPUT_PATH, outputLine().position).x"
            [attr.cy]="getNodePosition(OUTPUT_PATH, outputLine().position).y"
            r="3"
            [attr.fill]="outputLine().dotColor || '#3178c6'"
            class="circle-dot"
          />
          @if (outputLine().labelVisible) {
            <g class="label-group">
              <rect
                [attr.x]="getNodePosition(OUTPUT_PATH, outputLine().position).x - 30"
                [attr.y]="getNodePosition(OUTPUT_PATH, outputLine().position).y - 25"
                width="60"
                height="18"
                rx="4"
                fill="var(--svg-label-bg)"
                stroke="var(--svg-label-border)"
                stroke-width="1"
              />
              <text
                [attr.x]="getNodePosition(OUTPUT_PATH, outputLine().position).x"
                [attr.y]="getNodePosition(OUTPUT_PATH, outputLine().position).y - 13"
                text-anchor="middle"
                [attr.fill]="outputLine().dotColor || '#ffffff'"
                font-size="11"
                font-family="Inter, sans-serif"
                font-weight="500"
              >
                {{ outputLine().label }}
              </text>
            </g>
          }
          @if (outputLine().glowColor) {
            <circle
              [attr.cx]="getNodePosition(OUTPUT_PATH, outputLine().position).x"
              [attr.cy]="getNodePosition(OUTPUT_PATH, outputLine().position).y"
              r="8"
              [attr.fill]="outputLine().glowColor"
              opacity="0.4"
              filter="url(#glow-filter-output)"
            />
          }
        }
      }
      <defs>
        <linearGradient id="output_gradient" gradientUnits="userSpaceOnUse">
          <stop offset="0.1" stop-color="#6BA5E7" stop-opacity="0" />
          <stop offset="0.4" stop-color="#6BA5E7" stop-opacity="0.4" />
          <stop offset="1" stop-color="#6BA5E7" stop-opacity="0" />
        </linearGradient>
        <filter id="glow-filter-output">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  `,
  styles: [
    `
      :host {
        --svg-path-color: var(--muted-foreground);
        --svg-label-bg: var(--card);
        --svg-label-border: var(--border);
      }

      :host-context(.dark) {
        --svg-path-color: var(--muted-foreground);
        --svg-label-bg: var(--card);
        --svg-label-border: var(--border);
      }

      .output-line {
        position: absolute;
        top: 300px;
        left: 785px;
        transform: translate3d(0, 0, 0);
      }

      .label-group {
        animation: fadeIn 0.2s ease-in;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
    `,
  ],
})
export class SvgOutputsComponent {
  readonly outputLines = input.required<WritableSignal<SvgNodeProps>[]>();
  readonly OUTPUT_PATH = OUTPUT_PATH;

  getNodePosition(path: string, position: number): { x: number; y: number } {
    if (typeof document === 'undefined') {
      return { x: 0, y: 0 };
    }
    const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathElement.setAttribute('d', path);
    const length = pathElement.getTotalLength();
    const point = pathElement.getPointAtLength(length * position);
    return { x: point.x, y: point.y };
  }
}
