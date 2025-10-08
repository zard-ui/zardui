import { ZardButtonComponent } from '@zard/components/button/button.component';
import { Component } from '@angular/core';

@Component({
  selector: 'support-section',
  standalone: true,
  imports: [ZardButtonComponent],
  template: `
    <section class="flex flex-col gap-8">
      <div class="relative overflow-hidden rounded-lg border border-dashed border-border p-8">
        <div class="relative z-10">
          <div class="flex flex-col items-center text-center gap-4">
            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <img src="/icons/github.svg" alt="github icon" class="invert-0 dark:invert" />
            </div>
            <h3 class="text-xl font-semibold">Support Open Source</h3>
            <p class="text-base leading-7 text-muted-foreground max-w-2xl">
              Love what we're building? Support ZardUI through contributions, sponsorships, or simply spreading the word. Every bit helps us maintain our commitment to the
              community.
            </p>
            <div class="flex gap-3">
              <a z-button target="_blank" href="https://github.com/zard-ui/zardui">
                <img src="/icons/github.svg" alt="github icon" class="invert dark:invert-0 hidden md:block h-4 w-4" />
                Star on GitHub
              </a>
              <a z-button zType="outline" target="_blank" href="https://github.com/sponsors/zard-ui">Be a Sponsor </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class SupportSection {}
