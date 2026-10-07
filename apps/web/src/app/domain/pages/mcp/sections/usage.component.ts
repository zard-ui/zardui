import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'z-mcp-usage-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 class="font-heading mt-12 scroll-m-28 text-2xl font-semibold tracking-tight first:mt-0 lg:mt-20">Usage</h2>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      Describe what you want, not which tool to call. Naming zard/ui in the prompt keeps the assistant from reaching for
      another library.
    </p>
    <ul class="mt-4 space-y-2">
      @for (prompt of prompts; track prompt) {
        <li class="bg-muted/50 rounded-md border px-4 py-3 font-mono text-sm leading-relaxed">{{ prompt }}</li>
      }
    </ul>
  `,
})
export class McpUsageSectionComponent {
  readonly prompts = [
    'Which zard/ui components could I use for a settings page?',
    'Add a zard/ui dialog to my settings page, with a destructive confirm button. Read its docs first.',
    'Show me the zard/ui login blocks, then add login-02 to /login with the components it needs.',
    'What does installing the zard/ui date-picker bring into my project, npm packages included?',
  ];
}
