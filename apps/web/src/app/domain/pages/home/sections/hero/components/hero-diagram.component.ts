import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  signal,
  WritableSignal,
  OnInit,
  OnDestroy,
  inject,
  PLATFORM_ID,
} from '@angular/core';

import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { SvgInputsComponent } from './svg-inputs.component';
import { SvgNodeProps } from './svg-node-props.interface';
import { SvgOutputsComponent } from './svg-outputs.component';

gsap.registerPlugin(MotionPathPlugin, ScrollTrigger);

// Define the paths on the input side of the diagram
const INPUT_PATHS = [
  'M843.505 284.659L752.638 284.659C718.596 284.659 684.866 280.049 653.251 271.077L598.822 255.629L0.675021 1.00011',
  'M843.505 298.181L724.342 297.36C708.881 297.36 693.45 296.409 678.22 294.518L598.822 284.659C592.82 284.659 200.538 190.002 0.675028 164.892',
  'M843.505 311.703L701.108 310.061L598.822 305.136L0.675049 256.071',
  'M843.505 325.224L598.822 326.002L0.675049 321.858',
  'M843.505 338.746L701.108 340.388L598.822 345.442L0.675038 387.646',
  'M843.505 352.268L724.342 353.088C708.881 353.088 693.45 354.039 678.22 355.93L598.822 365.789L0.675067 478.825',
  'M843.505 365.789L752.638 365.789C718.596 365.789 684.866 370.399 653.251 379.372L598.822 394.82L0.675049 642.717',
];

// Define the file set "combinations" that can be shown on the input side
const INPUT_FILE_SETS = [
  [
    { label: '.component.ts', color: '#3178c6' },
    { label: '.component.html', color: '#ff6b35' },
    { label: '.service.ts', color: '#ffd700' },
  ],
  [
    { label: '.ts', color: '#3178c6' },
    { label: '.component.html', color: '#ff6b35' },
    { label: '.directive.ts', color: '#40b782' },
  ],
  [
    { label: '.component.ts', color: '#3178c6' },
    { label: '.service.ts', color: '#ffd700' },
    { label: '.directive.ts', color: '#40b782' },
  ],
  [
    { label: '.ts', color: '#3178c6' },
    { label: '.component.html', color: '#ff6b35' },
    { label: '.service.ts', color: '#ffd700' },
  ],
  [
    { label: '.component.ts', color: '#3178c6' },
    { label: '.directive.ts', color: '#40b782' },
    { label: '.component.html', color: '#ff6b35' },
  ],
];

@Component({
  selector: 'z-hero-diagram',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SvgInputsComponent, SvgOutputsComponent],
  template: `
    <div
      class="pointer-events-none relative left-[calc(50%-815px)] -mt-40 w-407.5 overflow-hidden max-md:scale-90"
      id="hero-diagram"
    >
      <!-- Input Lines -->
      <z-svg-inputs [inputLines]="inputLines" />

      <!-- Output Line -->
      <z-svg-outputs [outputLines]="outputLines" />

      <!-- ZardUI Chip -->
      <div
        class="chip-container absolute top-65 left-187 h-33.5 w-33.5 transform-[translate3d(0,0,0)_scale(0.85)] overflow-hidden rounded-[10px] transition-all duration-600 ease-out"
        [class.chip-active]="illuminateLogo()"
        [class.chip-highlight]="logoHighlight()"
      >
        <div class="chip-background">
          <div
            class="chip-border bg-primary absolute inset-0 rounded-[10px] border-0 border-solid transition-[background,border-color] duration-300 ease-in-out md:inset-0.5"
          ></div>
          <div
            class="chip-edge absolute inset-0 border-2 border-solid opacity-0 transition-all duration-1000 ease-in-out will-change-[opacity,border]"
            [class.edge-animated]="isChromiumBrowser()"
          ></div>
        </div>
        <img
          src="images/zard.svg"
          alt="ZardUI Logo"
          class="chip-logo absolute top-1/2 left-1/2 z-3 w-16.25 -translate-x-1/2 -translate-y-1/2 scale-90 invert transition-all duration-200 ease-in-out dark:invert-0"
        />
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        --hero-input-color: var(--muted-foreground);
        --hero-output-color: var(--muted-foreground);
        --hero-logo-glow: var(--foreground);
        --hero-path-opacity: 0.3;
      }

      :host-context(.dark) {
        --hero-path-opacity: 0.4;
      }

      .chip-edge {
        border-image-slice: 1;
        border-image-source: linear-gradient(
          to bottom right,
          rgba(0, 0, 0, 0) 60%,
          rgba(255, 255, 255, 0.15) 65%,
          rgba(0, 0, 0, 0) 90%
        );
      }

      @media (min-width: 768px) {
        .chip-edge {
          border-image-source: linear-gradient(
            to bottom right,
            rgba(0, 0, 0, 0) 50%,
            rgba(255, 255, 255, 0.15) 60%,
            rgba(0, 0, 0, 0) 90%
          );
        }
      }

      /* Active chip state */
      .chip-active {
        box-shadow: 0 30px 35px -10px rgba(0, 0, 0, 0.6);
        transform: translate3d(0, 0, 0) scale(1) !important;
      }

      .chip-active .chip-border {
        border-width: 5px;
      }

      .chip-active .chip-logo {
        filter: grayscale(0) brightness(1.2) drop-shadow(0 0 15px var(--hero-logo-glow)) !important;
        transform: translate(-50%, -50%) scale(1) !important;
      }

      /* Highlight animation */
      .chip-highlight .chip-logo {
        animation: logoHighlight 0.8s ease-in-out;
      }

      /* Edge gradient animation */
      @media (min-width: 768px) {
        .chip-active .edge-animated {
          animation: rotateGradient 8s linear infinite;
        }
      }

      /* Keyframes */
      @keyframes logoHighlight {
        0% {
          filter: grayscale(0) brightness(1.2) drop-shadow(0 0 15px var(--hero-logo-glow));
          transform: translate(-50%, -50%) scale(1);
        }
        50% {
          filter: grayscale(0) brightness(1.5) drop-shadow(0 0 40px var(--hero-logo-glow));
          transform: translate(-50%, -50%) scale(1.1);
        }
        100% {
          filter: grayscale(0) brightness(1.2) drop-shadow(0 0 15px var(--hero-logo-glow));
          transform: translate(-50%, -50%) scale(1);
        }
      }

      @keyframes rotateGradient {
        0% {
          border-image-source: linear-gradient(
            to bottom right,
            rgba(0, 0, 0, 0) 60%,
            rgba(255, 255, 255, 0.15) 65%,
            rgba(0, 0, 0, 0) 90%
          );
        }
        25% {
          border-image-source: linear-gradient(
            to right top,
            rgba(0, 0, 0, 0) 60%,
            rgba(255, 255, 255, 0.15) 65%,
            rgba(0, 0, 0, 0) 90%
          );
        }
        50% {
          border-image-source: linear-gradient(
            to top left,
            rgba(0, 0, 0, 0) 60%,
            rgba(255, 255, 255, 0.15) 65%,
            rgba(0, 0, 0, 0) 90%
          );
        }
        75% {
          border-image-source: linear-gradient(
            to left bottom,
            rgba(0, 0, 0, 0) 60%,
            rgba(255, 255, 255, 0.15) 65%,
            rgba(0, 0, 0, 0) 90%
          );
        }
        100% {
          border-image-source: linear-gradient(
            to bottom right,
            rgba(0, 0, 0, 0) 60%,
            rgba(255, 255, 255, 0.15) 65%,
            rgba(0, 0, 0, 0) 90%
          );
        }
      }
    `,
  ],
})
export class HeroDiagramComponent implements OnInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private scrollTriggerInstance: ScrollTrigger | null = null;
  private timeline: gsap.core.Timeline | null = null;

  // Create plain objects for GSAP to animate
  private readonly inputLineStates: SvgNodeProps[] = INPUT_PATHS.map(path => ({
    position: 0,
    visible: false,
    labelVisible: false,
    label: '',
    dotColor: undefined,
    glowColor: undefined,
    path,
  }));

  private readonly outputLineStates: SvgNodeProps[] = [
    {
      position: 0,
      visible: false,
      labelVisible: false,
      label: 'button',
      path: '',
      dotColor: '#3178c6',
      glowColor: '#3178c6',
    },
    {
      position: 0,
      visible: false,
      labelVisible: false,
      label: 'tooltip',
      path: '',
      dotColor: '#3178c6',
      glowColor: '#3178c6',
    },
    {
      position: 0,
      visible: false,
      labelVisible: false,
      label: 'carousel',
      path: '',
      dotColor: '#3178c6',
      glowColor: '#3178c6',
    },
  ];

  // Setup signals that will be updated when the plain objects change
  readonly inputLines: WritableSignal<SvgNodeProps>[] = this.inputLineStates.map(state => signal<SvgNodeProps>(state));

  readonly outputLines: WritableSignal<SvgNodeProps>[] = this.outputLineStates.map(state =>
    signal<SvgNodeProps>(state),
  );

  // Add some flags for whether to display various subcomponents
  readonly blueIndicator = signal(false);
  readonly pinkIndicator = signal(false);
  readonly illuminateLogo = signal(false);
  readonly logoHighlight = signal(false);

  // Chromium browser detection
  readonly isChromiumBrowser = signal(false);

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Check if chromium browser
    this.isChromiumBrowser.set('chrome' in window);

    // Start animations when element enters viewport
    this.scrollTriggerInstance = ScrollTrigger.create({
      trigger: '#hero-diagram',
      start: 'center 100%',
      once: true,
      onEnter: () => {
        this.animateDiagram();
      },
    });
  }

  ngOnDestroy(): void {
    this.scrollTriggerInstance?.kill();
    this.timeline?.kill();
  }

  /**
   * The core animation for the hero diagram.
   * Has both a desktop and mobile variation.
   */
  private animateDiagram(): void {
    // Determine if we're showing the desktop or mobile variation of the animation
    const isMobile = window.innerWidth < 768;

    // Prepare a timeline
    this.timeline = gsap.timeline({
      onComplete: () => this.animateDiagram(),
    });

    // === PHASE 1: Animate the input nodes/lines ===
    this.timeline.addLabel('inputStart', 0);
    this.prepareInputs().forEach((lineIndex, fileIndex) => {
      this.timeline!.add(
        isMobile
          ? this.animateSingleInputMobile(this.inputLines[lineIndex])
          : this.animateSingleInputDesktop(this.inputLines[lineIndex]),
        'inputStart+=' + fileIndex * (isMobile ? 0.4 : 0.2),
      );
    });

    // === PHASE 2: Logo highlight (intermediary animation) ===
    // Wait for ALL inputs to finish, then illuminate logo
    this.timeline.addLabel('logoStart', '>'); // Start AFTER inputs finish

    // Illuminate the logo and colored indicators sequentially
    this.timeline.set(this.illuminateLogo, { value: true }, 'logoStart');
    this.timeline.set(this.blueIndicator, { value: true }, 'logoStart+=0.1');
    this.timeline.set(this.pinkIndicator, { value: true }, 'logoStart+=0.2');

    // Add logo highlight pulse
    this.timeline.set(this.logoHighlight, { value: true }, 'logoStart+=0.3');
    this.timeline.set(this.logoHighlight, { value: false }, 'logoStart+=1.1'); // 0.3 + 0.8
    this.timeline.set({}, {}, '+=0.2'); // Small pause after highlight

    // === PHASE 3: Animate the output nodes/lines ===
    // Start AFTER logo highlight finishes
    this.timeline.addLabel('outputStart', '>');
    this.outputLines.forEach((outputLine, index) => {
      this.timeline!.add(
        isMobile ? this.animateSingleOutputMobile(outputLine) : this.animateSingleOutputDesktop(outputLine, index),
        'outputStart+=' + (isMobile ? 0.3 : 0.1) * index,
      );
    });

    // Desktop only reset
    if (!isMobile) {
      // Disable the colored indicators
      this.timeline.set(this.blueIndicator, { value: false }, '>-1');
      this.timeline.set(this.pinkIndicator, { value: false }, '<');

      // Pause briefly at the end of the animation
      this.timeline.set({}, {}, '+=0.2');
    }
  }

  /**
   * Randomly selects a set of input file nodes and assigns them to input lines.
   */
  private prepareInputs(): number[] {
    // Randomly select a set of input file "nodes"
    const inputFileSet = INPUT_FILE_SETS[Math.floor(Math.random() * INPUT_FILE_SETS.length)];

    // Choose enough unique lines for the input file nodes to slide along
    const inputLineIndexes = new Set<number>();
    while (inputLineIndexes.size < 3) {
      const index: number = Math.floor(Math.random() * this.inputLineStates.length);
      inputLineIndexes.add(index);
    }

    // Assign each line its appropriate node label
    const inputs = [...inputLineIndexes];
    inputs.forEach((lineIndex, fileIndex) => {
      this.inputLineStates[lineIndex].label = inputFileSet[fileIndex].label;
      this.inputLineStates[lineIndex].dotColor = inputFileSet[fileIndex].color;
      this.inputLineStates[lineIndex].glowColor = inputFileSet[fileIndex].color;
      this.inputLines[lineIndex].set({ ...this.inputLineStates[lineIndex] });
    });
    return inputs;
  }

  /**
   * Animates a single output line for desktop.
   */
  private animateSingleOutputDesktop(
    outputLineSignal: WritableSignal<SvgNodeProps>,
    index: number,
  ): gsap.core.Timeline {
    const timeline = gsap.timeline();
    const outputLineIndex = this.outputLines.indexOf(outputLineSignal);
    const outputLine = this.outputLineStates[outputLineIndex];

    // Reset the line (start from end)
    timeline.set(outputLine, { position: 1 }, 0);
    timeline.call(() => outputLineSignal.set({ ...outputLine }), [], 0);

    // Animate the dot in (from end towards middle)
    timeline.to(
      outputLine,
      {
        position: (0.7 / 3) * (index + 1) + 0.05,
        duration: 1.5,
        ease: 'expo.out',
        onUpdate: () => outputLineSignal.set({ ...outputLine }),
      },
      0,
    );

    // Show the dot
    timeline.set(outputLine, { visible: true }, 0);
    timeline.call(() => outputLineSignal.set({ ...outputLine }), [], 0);

    // Show the label
    timeline.set(outputLine, { labelVisible: true }, 0.4);
    timeline.call(() => outputLineSignal.set({ ...outputLine }), [], 0.4);

    // Animate the dot out (towards the beginning)
    timeline.to(
      outputLine,
      {
        position: 0,
        duration: 1.5,
        ease: 'power3.in',
        onUpdate: () => outputLineSignal.set({ ...outputLine }),
      },
      2,
    );

    // Hide the label
    timeline.set(outputLine, { labelVisible: false }, 2.5);
    timeline.call(() => outputLineSignal.set({ ...outputLine }), [], 2.5);

    // Hide the dot
    timeline.set(outputLine, { visible: false }, 3);
    timeline.call(() => outputLineSignal.set({ ...outputLine }), [], 3);

    return timeline;
  }

  /**
   * Animates a single output line for mobile.
   */
  private animateSingleOutputMobile(outputLineSignal: WritableSignal<SvgNodeProps>): gsap.core.Timeline {
    const timeline = gsap.timeline();
    const outputLineIndex = this.outputLines.indexOf(outputLineSignal);
    const outputLine = this.outputLineStates[outputLineIndex];

    // Reset the line (start from end)
    timeline.set(outputLine, { position: 1 }, 0);
    timeline.call(() => outputLineSignal.set({ ...outputLine }), [], 0);

    // Animate the dot in (from end towards middle)
    timeline.to(
      outputLine,
      {
        position: 0.3,
        duration: 2,
        ease: 'power1.inOut',
        onUpdate: () => outputLineSignal.set({ ...outputLine }),
      },
      0.3,
    );

    // Show the dot
    timeline.set(outputLine, { visible: true }, 0.75);
    timeline.call(() => outputLineSignal.set({ ...outputLine }), [], 0.75);

    // Hide the dot
    timeline.set(outputLine, { visible: false }, 1.2);
    timeline.call(() => outputLineSignal.set({ ...outputLine }), [], 1.2);

    return timeline;
  }

  /**
   * Animates a single input line for desktop.
   */
  private animateSingleInputDesktop(inputLineSignal: WritableSignal<SvgNodeProps>): gsap.core.Timeline {
    const timeline = gsap.timeline();
    const inputLineIndex = this.inputLines.indexOf(inputLineSignal);
    const inputLine = this.inputLineStates[inputLineIndex];

    // Reset the line (start from the end)
    timeline.set(inputLine, { position: 1 }, 0);
    timeline.call(() => inputLineSignal.set({ ...inputLine }), [], 0);

    // Animate the dot in (from end towards center)
    timeline.to(
      inputLine,
      {
        position: Math.random() * 0.1 + 0.5,
        duration: 1,
        ease: 'expo.out',
        onUpdate: () => inputLineSignal.set({ ...inputLine }),
      },
      0,
    );

    // Show the dot
    timeline.set(inputLine, { visible: true }, 0);
    timeline.call(() => inputLineSignal.set({ ...inputLine }), [], 0);

    // Show the label
    timeline.set(inputLine, { labelVisible: true }, 0.2);
    timeline.call(() => inputLineSignal.set({ ...inputLine }), [], 0.2);

    // Animate the dot out (towards the beginning)
    timeline.to(
      inputLine,
      {
        position: 0,
        duration: 1.2,
        ease: 'power3.in',
        onUpdate: () => inputLineSignal.set({ ...inputLine }),
      },
      1.2,
    );

    // Hide the label
    timeline.set(inputLine, { labelVisible: false }, 1.6);
    timeline.call(() => inputLineSignal.set({ ...inputLine }), [], 1.6);

    // Hide the dot
    timeline.set(inputLine, { visible: false }, 1.9);
    timeline.call(() => inputLineSignal.set({ ...inputLine }), [], 1.9);

    return timeline;
  }

  /**
   * Animates a single input line for mobile.
   */
  private animateSingleInputMobile(inputLineSignal: WritableSignal<SvgNodeProps>): gsap.core.Timeline {
    const timeline = gsap.timeline();
    const inputLineIndex = this.inputLines.indexOf(inputLineSignal);
    const inputLine = this.inputLineStates[inputLineIndex];

    // Reset the line (start from the end)
    timeline.set(inputLine, { position: 1 }, 0);
    timeline.call(() => inputLineSignal.set({ ...inputLine }), [], 0);

    // Animate the dot in (from end to beginning)
    timeline.to(
      inputLine,
      {
        position: 0,
        duration: 1.8,
        ease: 'power2.out',
        onUpdate: () => inputLineSignal.set({ ...inputLine }),
      },
      0,
    );

    // Show the dot
    timeline.set(inputLine, { visible: true }, 0);
    timeline.call(() => inputLineSignal.set({ ...inputLine }), [], 0);

    // Hide the dot
    timeline.set(inputLine, { visible: false }, 0.5);
    timeline.call(() => inputLineSignal.set({ ...inputLine }), [], 0.5);

    return timeline;
  }
}
