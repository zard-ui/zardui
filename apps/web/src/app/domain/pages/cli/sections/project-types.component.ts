import { Component } from '@angular/core';

/**
 * O que muda de um tipo de projeto para outro.
 *
 * A tabela é o coração da página: escolher o tipo errado no init leva a um
 * projeto que compila mas não renderiza, e o motivo (o PostCSS no diretório
 * errado, o alias num tsconfig que ninguém estende) não é óbvio de fora.
 */
@Component({
  selector: 'cli-project-types-section',
  standalone: true,
  template: `
    <h2 class="font-heading mt-12 scroll-m-28 text-2xl font-semibold tracking-tight first:mt-0 lg:mt-20">
      Project types
    </h2>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      The type you pick decides where the components live, which files get configured, and how Tailwind is wired into
      the build. These are not cosmetic differences — each one breaks a step if the plain Angular flow is applied to it.
    </p>

    <div class="mt-6 overflow-x-auto">
      <table class="w-full text-left text-sm">
        <thead class="text-foreground border-border border-b">
          <tr>
            <th class="py-2 pr-4 font-medium">Type</th>
            <th class="py-2 pr-4 font-medium">Tailwind</th>
            <th class="py-2 pr-4 font-medium">TypeScript paths</th>
            <th class="py-2 font-medium">Providers</th>
          </tr>
        </thead>
        <tbody class="text-muted-foreground">
          @for (type of types; track type.name) {
            <tr class="border-border/50 border-b">
              <td class="py-2 pr-4">
                <code class="bg-muted rounded px-1.5 py-0.5 text-xs">{{ type.name }}</code>
              </td>
              <td class="py-2 pr-4">{{ type.tailwind }}</td>
              <td class="py-2 pr-4">
                <code class="bg-muted rounded px-1.5 py-0.5 text-xs">{{ type.tsconfig }}</code>
              </td>
              <td class="py-2">{{ type.providers }}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>

    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-6">
      A few consequences worth knowing:
    </p>
    <ul class="text-muted-foreground mt-4 list-disc space-y-2 pl-6 text-base leading-relaxed">
      <li>
        <strong class="text-foreground">Nx keeps its paths in tsconfig.base.json.</strong>
        The root
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">tsconfig.json</code>
        of an Nx workspace is not extended by any project, so an alias written there resolves in the editor and breaks
        in the build.
      </li>
      <li>
        <strong class="text-foreground">The Nx PostCSS config goes inside the application.</strong>
        At the workspace root it would configure every app at once.
      </li>
      <li>
        <strong class="text-foreground">Analog builds with Vite</strong>
        , so Tailwind is a Vite plugin there. A
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">.postcssrc.json</code>
        would never be read.
      </li>
      <li>
        <strong class="text-foreground">Libraries ship the theme as a package asset</strong>
        , declared in
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">ng-package.json</code>
        so it lands at the package root. They register no providers — the application that consumes the library does
        that.
      </li>
    </ul>

    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      When a workspace declares more than one compatible project, init asks which one should receive the components.
      Projects that only exist to run end-to-end tests are left out.
    </p>
  `,
})
export class CliProjectTypesSection {
  protected readonly types = [
    {
      name: 'angular',
      tailwind: '.postcssrc.json at the root',
      tsconfig: 'tsconfig.json',
      providers: 'src/app/app.config.ts',
    },
    {
      name: 'angular-library',
      tailwind: 'none — the consuming app owns the build',
      tsconfig: 'tsconfig.json',
      providers: 'none',
    },
    {
      name: 'nx',
      tailwind: '.postcssrc.json inside the app',
      tsconfig: 'tsconfig.base.json',
      providers: 'apps/<app>/src/app/app.config.ts',
    },
    {
      name: 'nx-library',
      tailwind: 'none — the consuming app owns the build',
      tsconfig: 'tsconfig.base.json',
      providers: 'none',
    },
    {
      name: 'analog',
      tailwind: 'plugin in vite.config.ts',
      tsconfig: 'tsconfig.json',
      providers: 'src/app/app.config.ts',
    },
  ];
}
