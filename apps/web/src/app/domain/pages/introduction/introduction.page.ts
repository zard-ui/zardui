import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import { SidebarComponent } from '@zard/domain/components/sidebar/sidebar.component';

@Component({
  selector: 'z-introduction',
  standalone: true,
  imports: [RouterModule, SidebarComponent],
  template: `
    <section class="elative flex items-stretch text-[1.05rem] sm:text-[15px] xl:w-full">
      <main class="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px] [&_h1]:text-3xl [&_h1]:font-bold [&_p]:text-base [&_p]:text-muted-foreground">
        <section class="flex flex-col gap-10">
          <h1>teste</h1>
        </section>
      </main>
    </section>
  `,
})
export class IntroductionPage {}
