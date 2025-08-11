import { Component } from '@angular/core';

interface CLIFeature {
  title: string;
  description: string;
}

@Component({
  selector: 'cli-section',
  standalone: true,
  template: `
    <section class="flex flex-col gap-8">
      <div class="flex flex-col gap-4">
        <h2 class="text-3xl font-bold tracking-tight">Powerful CLI</h2>
        <p class="text-base leading-7 text-muted-foreground">
          Our command-line interface makes adding components to your project effortless. No more copy-pasting code or hunting through documentation.
        </p>
      </div>

      <div class="relative overflow-x-auto no-scrollbar rounded-lg bg-code px-4 py-3 text-sm mb-4 group">
        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-2">
            <div class="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground text-xs font-mono">$</div>
            <p class="font-mono text-sm">npx &#64;ngzard/ui add button</p>
          </div>
          <div class="pl-8 text-sm text-muted-foreground">
            ✓ Ready to install 1 component(s) and 1 dependencies. Proceed? … yes<br />
            ✓ Installing dependencies...<br />
            ✓ Added button<br />
            ✓ Done!
          </div>
        </div>
      </div>

      <div class="grid gap-6 md:grid-cols-3">
        @for (feature of features; track $index) {
          <div class="flex flex-col gap-3">
            <h3 class="text-base font-semibold">{{ feature.title }}</h3>
            <p class="text-base leading-7 text-muted-foreground">{{ feature.description }}</p>
          </div>
        }
      </div>
    </section>
  `,
})
export class CLISection {
  readonly features: CLIFeature[] = [
    {
      title: 'Smart Installation',
      description: "Automatically handles dependencies, imports, and configuration. Just specify what you need, and we'll handle the rest.",
    },
    {
      title: 'Project Integration',
      description: 'Seamlessly integrates with your existing Angular project structure. Respects your conventions and coding style.',
    },
    {
      title: 'Developer Friendly',
      description: 'Clear feedback, helpful error messages, and intuitive commands. Designed to enhance your development workflow, not complicate it.',
    },
  ];
}
