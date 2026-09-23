import { Component } from '@angular/core';

interface Problem {
  readonly symptom: string;
  readonly fix: string;
}

@Component({
  selector: 'mcp-troubleshooting-section',
  standalone: true,
  template: `
    <h2 class="font-heading mt-12 scroll-m-28 text-2xl font-semibold tracking-tight first:mt-0 lg:mt-20">
      Troubleshooting
    </h2>
    <dl class="mt-4 divide-y">
      @for (problem of problems; track problem.symptom) {
        <div class="py-4">
          <dt class="font-medium">{{ problem.symptom }}</dt>
          <dd class="text-muted-foreground mt-1 text-base leading-relaxed">
            @for (part of problem.fix.split('\`'); track $index) {
              @if ($odd) {
                <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">{{ part }}</code>
              } @else {
                {{ part }}
              }
            }
          </dd>
        </div>
      }
    </dl>
  `,
})
export class McpTroubleshootingSection {
  readonly problems: Problem[] = [
    {
      symptom: 'The server shows no tools, or fails to start',
      fix: 'Check that `node --version` is 20 or newer, then delete the npx cache in `~/.npm/_npx` and restart the client. On Windows, some clients need the command as `cmd /c npx -y zard-mcp` instead.',
    },
    {
      symptom: 'The assistant invents an API instead of using the server',
      fix: 'Name zard/ui in the prompt, or ask it to read the component docs first. Check the server is connected before blaming the model.',
    },
    {
      symptom: 'Installing fails with "Configuration not found"',
      fix: 'The project has not been set up yet. Run `npx zard-cli init` at its root, then try again.',
    },
    {
      symptom: 'Components land in the wrong project',
      fix: 'The server process does not always start in your project, so the assistant must pass its root as `cwd` for the install. Ask it to install into the absolute path.',
    },
  ];
}
