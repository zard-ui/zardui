import {
  PACKAGE_MANAGERS,
  TEMPLATES,
  printable,
  type ScaffoldCommand,
  scaffoldCommands,
  templateById,
  withNpxRunner,
} from '@cli/commands/create/templates.js';

describe('scaffoldCommands', () => {
  it('runs the Angular CLI through each manager’s runner with every prompt answered', () => {
    const expected: Record<string, string> = {
      npm: 'npx --yes @angular/cli@latest new app --interactive=false --style=css --routing --ssr=false --ai-config=none --package-manager=npm',
      pnpm: 'pnpm dlx @angular/cli@latest new app --interactive=false --style=css --routing --ssr=false --ai-config=none --package-manager=pnpm',
      yarn: 'yarn dlx @angular/cli@latest new app --interactive=false --style=css --routing --ssr=false --ai-config=none --package-manager=yarn',
      bun: 'bunx @angular/cli@latest new app --interactive=false --style=css --routing --ssr=false --ai-config=none --package-manager=bun',
    };

    for (const manager of PACKAGE_MANAGERS) {
      const commands = scaffoldCommands('angular', 'app', manager);
      expect(commands).toHaveLength(1);
      expect(printable(commands[0] as ScaffoldCommand)).toBe(expected[manager]);
    }
  });

  it('builds the Nx workspace empty, adds the Angular plugin and generates the app by the project’s name', () => {
    const commands = scaffoldCommands('nx', 'app', 'pnpm');

    expect(commands.map(printable)).toEqual([
      'pnpm dlx create-nx-workspace@latest app --preset=apps --formatter=prettier --aiAgents=none --nxCloud=skip ' +
        '--interactive=false --packageManager=pnpm',
      'pnpm exec nx add @nx/angular --interactive=false',
      'pnpm exec nx generate @nx/angular:application --directory=apps/app --name=app --style=css --bundler=esbuild ' +
        '--ssr=false --routing --unitTestRunner=none --e2eTestRunner=none --linter=eslint --interactive=false',
    ]);
    expect(commands.map(command => command.inProject)).toEqual([undefined, true, true]);
  });

  it.each([
    ['npm', 'npx --no-install nx add'],
    ['yarn', 'yarn nx add'],
    ['bun', 'bunx nx add'],
  ] as const)('runs the workspace’s own nx through %s, never a second copy', (manager, prefix) => {
    expect(printable(scaffoldCommands('nx', 'app', manager)[1] as ScaffoldCommand)).toContain(prefix);
  });

  it('runs create-analog, then installs inside the new project', () => {
    const commands = scaffoldCommands('analog', 'app', 'bun');

    expect(commands.map(printable)).toEqual([
      'bunx create-analog@latest app --template latest --skipTailwind',
      'bun install',
    ]);
    expect((commands[0] as ScaffoldCommand).inProject).toBeUndefined();
    expect((commands[1] as ScaffoldCommand).inProject).toBe(true);
  });

  it('puts the name right after the generator, where its positional argument is read', () => {
    expect((scaffoldCommands('analog', 'my-app', 'npm')[0] as ScaffoldCommand).args.slice(0, 3)).toEqual([
      '--yes',
      'create-analog@latest',
      'my-app',
    ]);
  });
});

describe('withNpxRunner', () => {
  it('swaps yarn dlx for npx and leaves everything else alone', () => {
    const commands = withNpxRunner(scaffoldCommands('analog', 'app', 'yarn'));

    expect(commands.map(printable)).toEqual([
      'npx --yes create-analog@latest app --template latest --skipTailwind',
      'yarn install',
    ]);
  });
});

describe('TEMPLATES', () => {
  it('lists the three project kinds a new app can be, Angular first', () => {
    expect(TEMPLATES.map(template => template.value)).toEqual(['angular', 'nx', 'analog']);
    expect(TEMPLATES.map(template => template.kind)).toEqual(['angular', 'nx', 'analog']);
  });

  it('finds a template by id', () => {
    expect(templateById('nx')?.label).toBe('Nx');
    expect(templateById('vue')).toBeUndefined();
  });
});
