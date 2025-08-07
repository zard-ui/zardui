import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SOCIAL_MEDIAS } from '@zard/shared/constants/medias.constant';

@Component({
  selector: 'z-footer',
  template: `
    <footer class="w-full bg-background mt-5">
      <main class="max-w-[90rem] h-16 mx-auto px-4 md:px-6 flex items-center justify-center">
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
