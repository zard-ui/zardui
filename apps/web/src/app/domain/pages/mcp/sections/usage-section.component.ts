import { Component } from '@angular/core';

@Component({
  selector: 'z-mcp-usage-section',
  standalone: true,
  template: `
    <section class="flex flex-col gap-6 sm:gap-8">
      <div class="flex flex-col gap-4 sm:gap-6">
        <h2
          class="font-heading mt-12 scroll-m-28 text-2xl font-semibold tracking-tight first:mt-0 sm:text-3xl lg:mt-20"
        >
          Usage
        </h2>
        <p class="text-muted-foreground text-base leading-relaxed sm:text-lg">
          Talk to your assistant in plain language. It chains the tools on its own — searching, reading the API, then
          writing or installing the code.
        </p>
      </div>

      <div class="flex flex-col gap-3">
        @for (prompt of prompts; track prompt) {
          <div class="bg-muted/30 rounded-lg border p-4 sm:p-5">
            <p class="text-sm leading-relaxed sm:text-base">“{{ prompt }}”</p>
          </div>
        }
      </div>

      <div class="flex flex-col gap-4">
        <h3 class="text-lg font-medium sm:text-xl lg:text-2xl">A typical flow</h3>
        <div class="flex flex-col gap-4">
          @for (step of flow; track step.title; let index = $index) {
            <div class="flex gap-4">
              <div
                class="bg-primary text-primary-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
              >
                {{ index + 1 }}
              </div>
              <div class="flex flex-col gap-1 pt-0.5">
                <span class="text-sm font-semibold">{{ step.title }}</span>
                <span class="text-muted-foreground text-sm leading-relaxed">{{ step.description }}</span>
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class McpUsageSectionComponent {
  readonly prompts = [
    'Which ZardUI components can I use to build a data table with pagination?',
    'Show me the API of the ZardUI dialog component before we use it.',
    'Add a ZardUI button with a loading state to my signup form.',
    'Install the ZardUI carousel in this project and show me a basic example.',
  ];

  readonly flow = [
    {
      title: 'Discovery',
      description: 'The assistant calls search-components or list-components to find what matches your request.',
    },
    {
      title: 'Reading',
      description:
        'It calls get-component-docs and get-component-examples to learn the real inputs, outputs and usage.',
    },
    {
      title: 'Dependencies',
      description: 'get-dependencies reveals everything the component needs before anything is written to disk.',
    },
    {
      title: 'Installation',
      description: 'install-component runs the CLI in your project, then the assistant writes the integration code.',
    },
  ];
}
