import { Component } from '@angular/core';

import { ZardButtonComponent } from '../../../../../../../../libs/zard/button/button.component';

@Component({
  selector: 'support-section',
  standalone: true,
  imports: [ZardButtonComponent],
  template: `
    <section class="flex flex-col gap-8">
      <div class="border-border relative overflow-hidden rounded-lg border border-dashed p-8">
        <div class="relative z-10">
          <div class="flex flex-col items-center gap-4 text-center">
            <div class="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
              <img src="/icons/github.svg" alt="github icon" class="invert-0 dark:invert" />
            </div>
            <h3 class="text-xl font-semibold">Support Open Source</h3>
            <p class="text-muted-foreground max-w-2xl text-base leading-7">
              Love what we're building? Support ZardUI through contributions, sponsorships, or simply spreading the
              word. Every bit helps us maintain our commitment to the community.
            </p>
            <div class="flex gap-3">
              <a z-button target="_blank" href="https://github.com/zard-ui/zardui">
                <img src="/icons/github.svg" alt="github icon" class="hidden h-4 w-4 invert md:block dark:invert-0" />
                Star on GitHub
              </a>
              <a z-button zType="outline" target="_blank" href="https://github.com/sponsors/zard-ui">Be a Sponsor</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class SupportSection {}
