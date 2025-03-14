import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="w-full border-t bg-background/95">
      <main class="max-w-[90rem] h-16 mx-auto px-4 flex items-center justify-center xl:justify-start">
        <p class="text-muted-foreground text-sm">
          Made with love by <a class="font-medium underline underline-offset-4" href="https://github.com/zard-ui" target="_blank">Zard</a>
        </p>
      </main>
    </footer>
  `,
  standalone: true,
  imports: [RouterModule],
})
export class FooterComponent {}
