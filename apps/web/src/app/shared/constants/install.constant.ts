export interface Step {
  title: string;
  subtitle: string;
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
          text: "If you don't know, you can follow the initial documentation step by step",
          href: 'https://angular.dev/installation',
          external: true,
        },
        file: {
          path: '/angular/install.md',
          lineNumber: false,
        },
      },
      {
        title: 'Add Tailwind CSS',
        subtitle: 'Components are styled using Tailwind CSS. You need to install Tailwind CSS in your project.',
        url: {
          text: 'Follow the Tailwind CSS installation instructions to get started.',
          href: 'https://tailwindcss.com/docs/installation/framework-guides/angular',
          external: true,
        },
      },
      {
        title: 'Add dependencies',
        subtitle: 'Add the following dependencies to your project:',
        file: {
          path: '/angular/dependencies.md',
          lineNumber: false,
        },
      },
      {
        title: 'Configure path aliases',
        subtitle: 'Configure the path aliases in your tsconfig.json file.',
        file: {
          path: '/angular/tsconfig.md',
          lineNumber: true,
        },
      },
      {
        title: 'Configure styles',
        subtitle: 'Add the following to your styles.css file. You can learn more about using CSS variables for theming in the',
        url: {
          text: 'theming section.',
          href: '/docs/theming',
        },
        file: {
          path: '/angular/theming.md',
          lineNumber: true,
        },
      },
      {
        title: 'Add a cn helper',
        subtitle: 'Create a folder called lib inside your app folder',
        path: 'lib/utils.ts',
        file: {
          path: '/angular/helper.md',
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
        subtitle: 'Start the cli and create an application that uses CSS as default styling.',
        url: {
          text: "If you don't know, you can follow the initial documentation step by step",
          href: 'https://angular.dev/installation',
          external: true,
        },
        file: {
          path: '/angular/install.md',
          lineNumber: false,
        },
      },
      {
        title: 'Add Tailwind CSS',
        subtitle: 'Components are styled using Tailwind CSS. You need to install Tailwind CSS in your project.',
        url: {
          text: 'Follow the Tailwind CSS installation instructions to get started.',
          href: 'https://tailwindcss.com/docs/installation/framework-guides/angular',
          external: true,
        },
      },
      {
        title: 'Add dependencies',
        subtitle: 'Add the following dependencies to your project:',
        file: {
          path: '/angular/dependencies.md',
          lineNumber: false,
        },
      },
      {
        title: 'Configure path aliases',
        subtitle: 'Configure the path aliases in your tsconfig.json file.',
        file: {
          path: '/angular/tsconfig.md',
          lineNumber: true,
        },
      },
      {
        title: 'Configure styles',
        subtitle: 'Add the following to your styles.css file. You can learn more about using CSS variables for theming in the',
        url: {
          text: 'theming section.',
          href: '/docs/theming',
        },
        file: {
          path: '/angular/theming.md',
          lineNumber: true,
        },
      },
      {
        title: 'Add a cn helper',
        subtitle: 'Create a folder called lib inside your app folder',
        path: 'lib/utils.ts',
        file: {
          path: '/angular/helper.md',
          lineNumber: true,
        },
      },
      {
        title: "That's it",
        subtitle: 'You can now start adding components to your project.',
      },
    ],
  },
];
