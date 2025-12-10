import { Component, ChangeDetectionStrategy, input, WritableSignal, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { SvgNodeProps } from './svg-node-props.interface';

@Component({
  selector: 'z-svg-inputs',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="844"
      height="644"
      viewBox="0 0 844 644"
      fill="none"
      class="input-lines"
    >
      <!-- Input Lines -->
      @for (inputLine of inputLines(); track inputLine().path; let i = $index) {
        <g>
          <path [attr.d]="inputLine().path" stroke="url(#base_gradient)" stroke-width="1.2" style="opacity: 0.8" />
          @if (inputLine().visible) {
            <circle
              [attr.cx]="getNodePosition(inputLine().path, inputLine().position).x"
              [attr.cy]="getNodePosition(inputLine().path, inputLine().position).y"
              r="3"
              [attr.fill]="inputLine().dotColor || '#ffffff'"
              class="circle-dot"
            />
            @if (inputLine().labelVisible) {
              <g class="label-group">
                <rect
                  [attr.x]="getNodePosition(inputLine().path, inputLine().position).x - 35"
                  [attr.y]="getNodePosition(inputLine().path, inputLine().position).y - 25"
                  width="70"
                  height="18"
                  rx="4"
                  fill="var(--svg-label-bg)"
                  stroke="var(--svg-label-border)"
                  stroke-width="1"
                />
                <text
                  [attr.x]="getNodePosition(inputLine().path, inputLine().position).x"
                  [attr.y]="getNodePosition(inputLine().path, inputLine().position).y - 13"
                  text-anchor="middle"
                  [attr.fill]="inputLine().dotColor || '#ffffff'"
                  font-size="11"
                  font-family="Inter, sans-serif"
                  font-weight="500"
                >
                  {{ inputLine().label }}
                </text>
              </g>
            }
            @if (inputLine().glowColor) {
              <circle
                [attr.cx]="getNodePosition(inputLine().path, inputLine().position).x"
                [attr.cy]="getNodePosition(inputLine().path, inputLine().position).y"
                r="8"
                [attr.fill]="inputLine().glowColor"
                opacity="0.4"
                filter="url(#glow-filter)"
              />
            }
          }
        </g>
      }

      <defs>
        <linearGradient
          id="base_gradient"
          x1="88.1032"
          y1="324.167"
          x2="843.505"
          y2="324.167"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stop-color="#c6caff" stop-opacity="0" />
          <stop offset="0.2" stop-color="#c6caff" stop-opacity="0.1" />
          <stop offset="0.4" stop-color="white" stop-opacity="0.4" />
          <stop offset="0.6" stop-color="#c6caff" stop-opacity="0.2" />
          <stop offset="0.8" stop-color="#c6caff" stop-opacity="0.2" />
          <stop offset="0.9" stop-color="#c6caff" stop-opacity="0" />
        </linearGradient>
        <filter id="glow-filter">
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

      .input-lines {
        transform: translate3d(0, 0, 0);
      }

      .input-lines ::ng-deep .circle-dot {
        display: none;
      }

      @media (min-width: 768px) {
        .input-lines ::ng-deep .circle-dot {
          display: block;
        }
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
export class SvgInputsComponent {
  readonly inputLines = input.required<WritableSignal<SvgNodeProps>[]>();

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
