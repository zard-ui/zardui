import { Component } from '@angular/core';

@Component({
  selector: 'z-mcp-troubleshooting-section',
  standalone: true,
  template: `
    <section class="flex flex-col gap-6 sm:gap-8">
      <div class="flex flex-col gap-4 sm:gap-6">
        <h2
          class="font-heading mt-12 scroll-m-28 text-2xl font-semibold tracking-tight first:mt-0 sm:text-3xl lg:mt-20"
        >
          Troubleshooting
        </h2>
        <p class="text-muted-foreground text-base leading-relaxed sm:text-lg">
          Most issues come from the client not reloading its configuration, or from the CLI not being initialized in the
          target project.
        </p>
      </div>

      <div class="flex flex-col gap-4">
        @for (item of issues; track item.problem) {
          <div class="flex flex-col gap-2 rounded-lg border p-4 sm:p-5">
            <span class="text-sm font-semibold sm:text-base">{{ item.problem }}</span>
            <span class="text-muted-foreground text-sm leading-relaxed">{{ item.solution }}</span>
          </div>
        }
      </div>
    </section>
  `,
})
export class McpTroubleshootingSectionComponent {
  readonly issues = [
    {
      problem: 'The tools do not show up in the assistant',
      solution:
        'MCP servers are started when the client boots. Fully restart Claude Code, Claude Desktop, Cursor, VS Code or Windsurf after editing the configuration file.',
    },
    {
      problem: 'The server fails to start',
      solution:
        'zard-mcp requires Node.js 20 or newer. Check your version with node -v and make sure npx can reach the npm registry from your network.',
    },
    {
      problem: 'Registry requests time out',
      solution:
        'Every request to the registry has a 10 second timeout. Behind a corporate proxy, expose it through HTTPS_PROXY or point ZARD_REGISTRY_URL to an internal mirror.',
    },
    {
      problem: 'install-component fails',
      solution:
        'The tool runs the ZardUI CLI, which needs a components.json file. Run npx zard-cli init in the project first, and pass the cwd parameter if the assistant is working outside the project root.',
    },
    {
      problem: 'A component looks outdated',
      solution:
        'The registry response is cached in memory for five minutes. Restart the client to force a fresh fetch.',
    },
  ];
}
