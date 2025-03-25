import { SOCIAL_MEDIAS } from '@zard/shared/constants/medias.constant';
import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'z-footer',
  template: `
    <footer class="w-full border-t bg-background/95">
      <main class="max-w-[90rem] h-16 mx-auto px-4 md:px-6 flex items-center justify-center xl:justify-start">
        <p class="text-muted-foreground text-sm">
          Made with ❤️ from 🇧🇷 | Open source and available on
          <a class="font-medium underline underline-offset-4" [href]="githubUrl" target="_blank">Github</a>.
        </p>
      </main>
    </footer>
  `,
  standalone: true,
  imports: [RouterModule],
})
export class FooterComponent {
  readonly githubUrl = SOCIAL_MEDIAS.find(media => media.name === 'GitHub')?.url;
}
