import { SETUP_ANALOG_CONFIG } from '@generated/documentation/setup/analog/config';
import { SETUP_ANALOG_CREATE } from '@generated/documentation/setup/analog/create';
import { SETUP_ANALOG_DEPENDENCIES } from '@generated/documentation/setup/analog/dependencies';
import { SETUP_ANALOG_TSCONFIG } from '@generated/documentation/setup/analog/tsconfig';
import { SETUP_ANALOG_VITE } from '@generated/documentation/setup/analog/vite';
import { SETUP_ANGULAR_CONFIG } from '@generated/documentation/setup/angular/config';
import { SETUP_ANGULAR_CREATE } from '@generated/documentation/setup/angular/create';
import { SETUP_ANGULAR_DEPENDENCIES } from '@generated/documentation/setup/angular/dependencies';
import { SETUP_ANGULAR_TSCONFIG } from '@generated/documentation/setup/angular/tsconfig';
import { SETUP_ANGULAR_LIBRARY_CONFIG } from '@generated/documentation/setup/angular-library/config';
import { SETUP_ANGULAR_LIBRARY_CREATE } from '@generated/documentation/setup/angular-library/create';
import { SETUP_ANGULAR_LIBRARY_DEPENDENCIES } from '@generated/documentation/setup/angular-library/dependencies';
import { SETUP_ANGULAR_LIBRARY_NG_PACKAGE } from '@generated/documentation/setup/angular-library/ng-package';
import { SETUP_ANGULAR_LIBRARY_TSCONFIG } from '@generated/documentation/setup/angular-library/tsconfig';
import { SETUP_NX_CONFIG } from '@generated/documentation/setup/nx/config';
import { SETUP_NX_CREATE } from '@generated/documentation/setup/nx/create';
import { SETUP_NX_DEPENDENCIES } from '@generated/documentation/setup/nx/dependencies';
import { SETUP_NX_TSCONFIG } from '@generated/documentation/setup/nx/tsconfig';
import { SETUP_NX_LIBRARY_CONFIG } from '@generated/documentation/setup/nx-library/config';
import { SETUP_NX_LIBRARY_CREATE } from '@generated/documentation/setup/nx-library/create';
import { SETUP_NX_LIBRARY_DEPENDENCIES } from '@generated/documentation/setup/nx-library/dependencies';
import { SETUP_NX_LIBRARY_TSCONFIG } from '@generated/documentation/setup/nx-library/tsconfig';
import { SETUP_SHARED_CLI_INIT } from '@generated/documentation/setup/shared/cli-init';
import { SETUP_SHARED_CORE } from '@generated/documentation/setup/shared/core';
import { SETUP_SHARED_HELPERS } from '@generated/documentation/setup/shared/helpers';
import { SETUP_SHARED_POSTCSS } from '@generated/documentation/setup/shared/postcss';
import { SETUP_SHARED_PROVIDERS } from '@generated/documentation/setup/shared/providers';
import { SETUP_SHARED_STYLES } from '@generated/documentation/setup/shared/styles';
import type { CodeBlockData, CodeTabData } from '@highlight/types';

export interface Step {
  title: string;
  subtitle?: string;
  url?: {
    text: string;
    href: string;
    external?: boolean;
  };
  path?: string;
  codeBlockData?: CodeBlockData | CodeBlockData[];
  codeTabData?: CodeTabData;
  expandable?: boolean;
}

export interface Installation {
  environment: string;
  title: string;
  description: string;
  manual: Step[];
  cli: Step[];
}

const TAILWIND_NOTE = {
  text: 'Since Tailwind is the core of the project, we do not recommend using other pre-processors.',
  href: '/docs/scss',
  external: false,
};

const THEMING_NOTE = { text: 'theming section.', href: '/docs/theming' };

const COMPONENTS_NOTE = {
  text: 'Open the components page and select what component you want to install',
  href: '/docs/components',
  external: false,
};

/**
 * As etapas finais, iguais em todo ambiente.
 *
 * What changes between them is how the project is created and how Tailwind
 * enters the build; the shared utilities and `components.json` are the same —
 * only the path they land in depends on the project type.
 */
function sharedManualSteps(options: { corePath: string; utilsPath: string; config: CodeBlockData }): Step[] {
  return [
    {
      title: 'Add the core utilities to zard',
      subtitle: `Create a core folder at ${options.corePath}`,
      codeBlockData: SETUP_SHARED_CORE,
    },
    {
      title: 'Add a lib helper',
      subtitle: `Create a utils folder at ${options.utilsPath}`,
      codeBlockData: SETUP_SHARED_HELPERS,
    },
    {
      title: 'Create a components.json file',
      subtitle: 'Create a components.json file in the root of your workspace.',
      codeBlockData: options.config,
    },
    {
      title: "That's it",
      subtitle: 'You can now start adding components to your project.',
    },
  ];
}

/** The three steps of the guided path: create, run init, use. */
function cliSteps(options: { create: CodeBlockData; createSubtitle: string; initSubtitle: string }): Step[] {
  return [
    {
      title: 'Create project',
      subtitle: options.createSubtitle,
      url: TAILWIND_NOTE,
      codeBlockData: options.create,
    },
    {
      title: 'Add Zard/ui',
      subtitle: options.initSubtitle,
      codeTabData: SETUP_SHARED_CLI_INIT,
    },
    {
      title: "That's it",
      subtitle: 'You can now start adding components to your project.',
      url: COMPONENTS_NOTE,
    },
  ];
}

function stylesStep(path: string): Step {
  return {
    title: 'Configure styles',
    subtitle: `Add the following to ${path}. You can learn more about using CSS variables for theming in the`,
    url: THEMING_NOTE,
    codeBlockData: SETUP_SHARED_STYLES,
  };
}

function tsconfigStep(file: string, block: CodeBlockData): Step {
  return {
    title: 'Configure path aliases',
    // baseUrl is left out: the option became an error in TypeScript 6, and since
    // 4.1 paths are resolved relative to the tsconfig itself without it.
    subtitle: `Add these lines inside compilerOptions on your ${file}. Do not add baseUrl, it is an error from TypeScript 6 on.`,
    codeBlockData: block,
  };
}

function providersStep(file: string): Step {
  return {
    title: 'Register the providers',
    subtitle: `Add provideZard() to the providers of your ${file}`,
    codeBlockData: SETUP_SHARED_PROVIDERS,
  };
}

export const installations: Installation[] = [
  {
    environment: 'angular',
    title: 'Angular',
    description: 'Install and configure zard/ui for Angular.',
    cli: cliSteps({
      create: SETUP_ANGULAR_CREATE,
      createSubtitle: 'Start the cli and create an application that uses Tailwind as default styling.',
      initSubtitle: 'Prepare your entire project using the zard/ui cli. Pick "Angular" on the first question:',
    }),
    manual: [
      {
        title: 'Create project',
        subtitle: 'Start the cli and create an application that uses Tailwind as default styling.',
        url: TAILWIND_NOTE,
        codeBlockData: SETUP_ANGULAR_CREATE,
      },
      {
        title: 'Add dependencies',
        subtitle: 'Add the following dependencies to your project:',
        codeTabData: SETUP_ANGULAR_DEPENDENCIES,
      },
      {
        title: 'Configure the Tailwind pipeline',
        subtitle:
          'Create a .postcssrc.json at the root of your project. Projects created with --style=tailwind already have it.',
        codeBlockData: SETUP_SHARED_POSTCSS,
      },
      tsconfigStep('tsconfig.json', SETUP_ANGULAR_TSCONFIG),
      stylesStep('src/styles.css'),
      providersStep('src/app/app.config.ts'),
      ...sharedManualSteps({
        corePath: 'src/app/shared/core',
        utilsPath: 'src/app/shared/utils',
        config: SETUP_ANGULAR_CONFIG,
      }),
    ],
  },
  {
    environment: 'nx',
    title: 'Nx',
    description: 'Install and configure zard/ui for an application inside an Nx workspace.',
    cli: cliSteps({
      create: SETUP_NX_CREATE,
      createSubtitle: 'Create an Nx workspace with an Angular application.',
      initSubtitle:
        'Run the cli at the workspace root. Pick "Nx" on the first question, then the app that receives the components:',
    }),
    manual: [
      {
        title: 'Create workspace',
        subtitle: 'Create an Nx workspace with an Angular application.',
        url: TAILWIND_NOTE,
        codeBlockData: SETUP_NX_CREATE,
      },
      {
        title: 'Add dependencies',
        subtitle: 'Add the following dependencies at the root of the workspace:',
        codeTabData: SETUP_NX_DEPENDENCIES,
      },
      {
        title: 'Configure the Tailwind pipeline',
        // At the repository root the file would apply to every app at once.
        subtitle:
          'Create a .postcssrc.json inside the application, at apps/my-app/. The Angular build looks for it from the stylesheet upwards.',
        codeBlockData: SETUP_SHARED_POSTCSS,
      },
      tsconfigStep('tsconfig.base.json', SETUP_NX_TSCONFIG),
      stylesStep('apps/my-app/src/styles.css'),
      providersStep('apps/my-app/src/app/app.config.ts'),
      ...sharedManualSteps({
        corePath: 'apps/my-app/src/app/shared/core',
        utilsPath: 'apps/my-app/src/app/shared/utils',
        config: SETUP_NX_CONFIG,
      }),
    ],
  },
  {
    environment: 'analog',
    title: 'Analog.js',
    description: 'Install and configure zard/ui for Analog.js.',
    cli: cliSteps({
      create: SETUP_ANALOG_CREATE,
      createSubtitle: 'Create an Analog.js application.',
      initSubtitle: 'Prepare your entire project using the zard/ui cli. Pick "Analog.js" on the first question:',
    }),
    manual: [
      {
        title: 'Create project',
        subtitle: 'Create an Analog.js application.',
        url: TAILWIND_NOTE,
        codeBlockData: SETUP_ANALOG_CREATE,
      },
      {
        title: 'Add dependencies',
        // Analog compiles with Vite, so Tailwind's adapter is a different one.
        subtitle: 'Add the following dependencies to your project:',
        codeTabData: SETUP_ANALOG_DEPENDENCIES,
      },
      {
        title: 'Configure the Tailwind pipeline',
        subtitle:
          'Analog builds with Vite, so Tailwind is a Vite plugin and a .postcssrc.json would never be read. Register it in vite.config.ts:',
        codeBlockData: SETUP_ANALOG_VITE,
      },
      tsconfigStep('tsconfig.json', SETUP_ANALOG_TSCONFIG),
      stylesStep('src/styles.css'),
      providersStep('src/app/app.config.ts'),
      ...sharedManualSteps({
        corePath: 'src/app/shared/core',
        utilsPath: 'src/app/shared/utils',
        config: SETUP_ANALOG_CONFIG,
      }),
    ],
  },
  {
    environment: 'angular-library',
    title: 'Angular Library',
    description: 'Install and configure zard/ui inside a publishable Angular library.',
    cli: cliSteps({
      create: SETUP_ANGULAR_LIBRARY_CREATE,
      createSubtitle: 'Generate the library that will ship the components.',
      initSubtitle: 'Run the cli at the workspace root. Pick "Angular Library" on the first question:',
    }),
    manual: [
      {
        title: 'Create the library',
        subtitle: 'Generate the library that will ship the components.',
        codeBlockData: SETUP_ANGULAR_LIBRARY_CREATE,
      },
      {
        title: 'Add dependencies',
        // A library does not compile CSS: the consuming application processes Tailwind.
        subtitle: 'Add the following dependencies. There is no PostCSS setup here, the consuming app owns the build:',
        codeTabData: SETUP_ANGULAR_LIBRARY_DEPENDENCIES,
      },
      tsconfigStep('tsconfig.json', SETUP_ANGULAR_LIBRARY_TSCONFIG),
      stylesStep('projects/ui/src/styles.css'),
      {
        title: 'Ship the theme with the library',
        subtitle:
          'ng-packagr only publishes what the entry point reaches, so declare the theme as an asset. With output "/" it lands at the package root:',
        codeBlockData: SETUP_ANGULAR_LIBRARY_NG_PACKAGE,
      },
      ...sharedManualSteps({
        corePath: 'projects/ui/src/lib/shared/core',
        utilsPath: 'projects/ui/src/lib/shared/utils',
        config: SETUP_ANGULAR_LIBRARY_CONFIG,
      }),
      {
        title: 'Wire it up in the consuming app',
        subtitle:
          'The application that installs this library still has to register provideZard() in its app.config.ts and import the theme from the library styles.css.',
      },
    ],
  },
  {
    environment: 'nx-library',
    title: 'Nx Library',
    description: 'Install and configure zard/ui inside a library of an Nx workspace.',
    cli: cliSteps({
      create: SETUP_NX_LIBRARY_CREATE,
      createSubtitle: 'Generate the library that will hold the components.',
      initSubtitle:
        'Run the cli at the workspace root. Pick "Nx Library" on the first question, then the library that receives the components:',
    }),
    manual: [
      {
        title: 'Create the library',
        subtitle: 'Generate the library that will hold the components.',
        codeBlockData: SETUP_NX_LIBRARY_CREATE,
      },
      {
        title: 'Add dependencies',
        subtitle: 'Add the following dependencies. There is no PostCSS setup here, the consuming app owns the build:',
        codeTabData: SETUP_NX_LIBRARY_DEPENDENCIES,
      },
      tsconfigStep('tsconfig.base.json', SETUP_NX_LIBRARY_TSCONFIG),
      stylesStep('libs/ui/src/styles.css'),
      ...sharedManualSteps({
        corePath: 'libs/ui/src/lib/shared/core',
        utilsPath: 'libs/ui/src/lib/shared/utils',
        config: SETUP_NX_LIBRARY_CONFIG,
      }),
      {
        title: 'Wire it up in the consuming app',
        subtitle:
          'The application that imports this library still has to register provideZard() in its app.config.ts and import the theme from the library styles.css.',
      },
    ],
  },
];
