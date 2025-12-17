export interface Step {
  title: string;
  subtitle?: string;
  url?: {
    text: string;
    href: string;
    external?: boolean;
  };
  path?: string;
  file?: {
    path: string;
    lineNumber: boolean;
  };
  expandable?: boolean;
}

export interface Installation {
  environment: string;
  title: string;
  description: string;
  manual: Step[];
  cli: Step[];
}

export const installations: Installation[] = [
  {
    environment: 'angular',
    title: 'Angular',
    description: 'Install and configure zard/ui for Angular.',
    manual: [
      {
        title: 'Create project',
        subtitle: 'Start the cli and create an application that uses CSS as default styling.',
        url: {
          text: 'Since Tailwind is the core of the project, we do not recommend using other pre-processors.',
          href: '/docs/scss',
          external: false,
        },
        file: {
          path: '/documentation/setup/angular/manual/install.md',
          lineNumber: false,
        },
      },
      {
        title: 'Add dependencies',
        subtitle: 'Add the following dependencies to your project:',
        file: {
          path: '/documentation/setup/angular/manual/dependencies.md',
          lineNumber: false,
        },
      },
      {
        title: 'Configure path aliases',
        subtitle: 'add these lines inside your compilerOptions on the tsconfig.json',
        file: {
          path: '/documentation/setup/angular/manual/tsconfig.md',
          lineNumber: true,
        },
      },
      {
        title: 'Configure styles',
        subtitle:
          'Add the following to your styles.css file. You can learn more about using CSS variables for theming in the',
        url: {
          text: 'theming section.',
          href: '/docs/theming',
        },
        file: {
          path: '/documentation/setup/angular/manual/styles.md',
          lineNumber: true,
        },
      },
      {
        title: 'Add the core utilities to zard',
        subtitle: 'Create a folder called core inside your app folder',
        path: 'shared/core',
        file: {
          path: '/documentation/setup/angular/manual/core.md',
          lineNumber: true,
        },
      },
      {
        title: 'Add a lib helper',
        subtitle: 'Create a folder called lib inside your app folder',
        path: 'shared/utils/merge-classes.ts',
        file: {
          path: '/documentation/setup/angular/manual/helpers.md',
          lineNumber: true,
        },
      },
      {
        title: 'Create a components.json file',
        subtitle: 'Create a components.json file in the root of your project.',
        path: 'shared/utils/merge-classes.ts',
        file: {
          path: '/documentation/setup/angular/manual/config.md',
          lineNumber: true,
        },
      },
      {
        title: "That's it",
        subtitle: 'You can now start adding components to your project.',
      },
    ],
    cli: [
      {
        title: 'Create project',
        subtitle: 'Start the cli and create an application that uses Tailwind as default styling.',
        url: {
          text: 'Since Tailwind is the core of the project, we do not recommend using other pre-processors.',
          href: '/docs/scss',
          external: false,
        },
        file: {
          path: '/documentation/setup/angular/cli/install.md',
          lineNumber: false,
        },
      },
      {
        title: 'Add Zard/ui',
        subtitle: 'prepare your entire project using the zard/ui cli:',
        file: {
          path: '/documentation/setup/angular/cli/add-zard-ui.md',
          lineNumber: false,
        },
      },
      {
        title: "That's it",
        subtitle: 'You can now start adding components to your project.',
        url: {
          text: 'Open the components page and select what component you want to install',
          href: '/docs/components',
          external: false,
        },
      },
    ],
  },
];
