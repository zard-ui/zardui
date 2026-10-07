import { SETUP_ANALOG_CONFIG } from '@generated/documentation/setup/analog/config';
import { SETUP_ANALOG_CREATE } from '@generated/documentation/setup/analog/create';
import { SETUP_ANALOG_DEPENDENCIES } from '@generated/documentation/setup/analog/dependencies';
import { SETUP_ANALOG_DEV_DEPENDENCIES } from '@generated/documentation/setup/analog/dev-dependencies';
import { SETUP_ANALOG_TSCONFIG } from '@generated/documentation/setup/analog/tsconfig';
import { SETUP_ANALOG_VITE } from '@generated/documentation/setup/analog/vite';
import { SETUP_ANGULAR_CONFIG } from '@generated/documentation/setup/angular/config';
import { SETUP_ANGULAR_CREATE } from '@generated/documentation/setup/angular/create';
import { SETUP_ANGULAR_DEPENDENCIES } from '@generated/documentation/setup/angular/dependencies';
import { SETUP_ANGULAR_DEV_DEPENDENCIES } from '@generated/documentation/setup/angular/dev-dependencies';
import { SETUP_ANGULAR_TSCONFIG } from '@generated/documentation/setup/angular/tsconfig';
import { SETUP_ANGULAR_LIBRARY_CONFIG } from '@generated/documentation/setup/angular-library/config';
import { SETUP_ANGULAR_LIBRARY_CREATE } from '@generated/documentation/setup/angular-library/create';
import { SETUP_ANGULAR_LIBRARY_DEPENDENCIES } from '@generated/documentation/setup/angular-library/dependencies';
import { SETUP_ANGULAR_LIBRARY_DEV_DEPENDENCIES } from '@generated/documentation/setup/angular-library/dev-dependencies';
import { SETUP_ANGULAR_LIBRARY_NG_PACKAGE } from '@generated/documentation/setup/angular-library/ng-package';
import { SETUP_ANGULAR_LIBRARY_TSCONFIG } from '@generated/documentation/setup/angular-library/tsconfig';
import { SETUP_NX_CONFIG } from '@generated/documentation/setup/nx/config';
import { SETUP_NX_CREATE } from '@generated/documentation/setup/nx/create';
import { SETUP_NX_DEPENDENCIES } from '@generated/documentation/setup/nx/dependencies';
import { SETUP_NX_DEV_DEPENDENCIES } from '@generated/documentation/setup/nx/dev-dependencies';
import { SETUP_NX_TSCONFIG } from '@generated/documentation/setup/nx/tsconfig';
import { SETUP_NX_LIBRARY_CONFIG } from '@generated/documentation/setup/nx-library/config';
import { SETUP_NX_LIBRARY_CREATE } from '@generated/documentation/setup/nx-library/create';
import { SETUP_NX_LIBRARY_DEPENDENCIES } from '@generated/documentation/setup/nx-library/dependencies';
import { SETUP_NX_LIBRARY_DEV_DEPENDENCIES } from '@generated/documentation/setup/nx-library/dev-dependencies';
import { SETUP_NX_LIBRARY_TSCONFIG } from '@generated/documentation/setup/nx-library/tsconfig';
import { SETUP_SHARED_CLI_INIT } from '@generated/documentation/setup/shared/cli-init';
import { SETUP_SHARED_CORE_CSS } from '@generated/documentation/setup/shared/core-css';
import { SETUP_SHARED_CORE_DIRECTIVES } from '@generated/documentation/setup/shared/core-directives';
import { SETUP_SHARED_CORE_EVENT_MANAGER } from '@generated/documentation/setup/shared/core-event-manager';
import { SETUP_SHARED_CORE_INDEX } from '@generated/documentation/setup/shared/core-index';
import { SETUP_SHARED_CORE_OVERLAY } from '@generated/documentation/setup/shared/core-overlay';
import { SETUP_SHARED_CORE_PROVIDER } from '@generated/documentation/setup/shared/core-provider';
import { SETUP_SHARED_HELPERS } from '@generated/documentation/setup/shared/helpers';
import { SETUP_SHARED_POSTCSS } from '@generated/documentation/setup/shared/postcss';
import { SETUP_SHARED_PROVIDERS } from '@generated/documentation/setup/shared/providers';
import { SETUP_SHARED_STYLES } from '@generated/documentation/setup/shared/styles';
import { SETUP_SHARED_STYLES_LIBRARY } from '@generated/documentation/setup/shared/styles-library';
import type { CodeBlockData, CodeTabData } from '@highlight/types';

export interface Step {
  title: string;
  subtitle?: string;
  url?: {
    text: string;
    href: string;
    external?: boolean;
  };
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

/** The six files the `core` registry item ships, one step per destination folder. */
function coreManualSteps(corePath: string): Step[] {
  return [
    {
      title: 'Add the core directives',
      subtitle: `Create ${corePath}/directives/ with:`,
      codeBlockData: SETUP_SHARED_CORE_DIRECTIVES,
    },
    {
      title: 'Add the overlay stack',
      subtitle: `Create ${corePath}/overlay/ with:`,
      codeBlockData: SETUP_SHARED_CORE_OVERLAY,
    },
    {
      title: 'Add the event manager plugins',
      subtitle: `Create ${corePath}/provider/event-manager-plugins/ with:`,
      codeBlockData: SETUP_SHARED_CORE_EVENT_MANAGER,
    },
    {
      title: 'Add the zard/ui provider',
      subtitle: `Create ${corePath}/provider/ with:`,
      codeBlockData: SETUP_SHARED_CORE_PROVIDER,
    },
    {
      title: 'Add the core styles',
      subtitle: `Create ${corePath}/css/ with:`,
      codeBlockData: SETUP_SHARED_CORE_CSS,
    },
    {
      title: 'Add the core barrel',
      subtitle: `Create ${corePath}/index.ts with:`,
      codeBlockData: SETUP_SHARED_CORE_INDEX,
    },
  ];
}

/** The four files the `utils` registry item ships, all in the same folder. */
function utilsManualStep(utilsPath: string): Step {
  return {
    title: 'Add a lib helper',
    subtitle: `Create a utils folder at ${utilsPath} with:`,
    codeBlockData: SETUP_SHARED_HELPERS,
  };
}

function configStep(config: CodeBlockData): Step {
  return {
    title: 'Create a components.json file',
    subtitle: 'Create a components.json file in the root of your workspace.',
    codeBlockData: config,
  };
}

const FINAL_STEP: Step = {
  title: "That's it",
  subtitle: 'You can now start adding components to your project.',
};

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

function stylesStep(path: string, options: { replace?: boolean; block?: CodeBlockData } = {}): Step {
  const verb = options.replace ? 'Replace the contents of' : 'Add the following to';
  return {
    title: 'Configure styles',
    subtitle: `${verb} ${path}. You can learn more about using CSS variables for theming in the`,
    url: THEMING_NOTE,
    codeBlockData: options.block ?? SETUP_SHARED_STYLES,
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
        subtitle:
          'Start the cli and create an application that uses Tailwind as default styling. This already installs Tailwind and configures the PostCSS pipeline for you.',
        url: TAILWIND_NOTE,
        codeBlockData: SETUP_ANGULAR_CREATE,
      },
      {
        title: 'Add dependencies',
        subtitle: 'Add the following dependencies to your project:',
        codeTabData: SETUP_ANGULAR_DEPENDENCIES,
      },
      {
        title: 'Add dev dependencies',
        subtitle: 'Add the following dev dependencies to your project:',
        codeTabData: SETUP_ANGULAR_DEV_DEPENDENCIES,
      },
      tsconfigStep('tsconfig.json', SETUP_ANGULAR_TSCONFIG),
      ...coreManualSteps('src/app/shared/core'),
      utilsManualStep('src/app/shared/utils'),
      stylesStep('src/styles.css', { replace: true }),
      providersStep('src/app/app.config.ts'),
      configStep(SETUP_ANGULAR_CONFIG),
      FINAL_STEP,
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
        title: 'Add dev dependencies',
        subtitle: 'Add the following dev dependencies at the root of the workspace:',
        codeTabData: SETUP_NX_DEV_DEPENDENCIES,
      },
      {
        title: 'Configure the Tailwind pipeline',
        // At the repository root the file would apply to every app at once.
        subtitle:
          'Create a .postcssrc.json inside the application, at apps/my-app/. The Angular build looks for it from the stylesheet upwards.',
        codeBlockData: SETUP_SHARED_POSTCSS,
      },
      tsconfigStep('tsconfig.base.json', SETUP_NX_TSCONFIG),
      ...coreManualSteps('apps/my-app/src/app/shared/core'),
      utilsManualStep('apps/my-app/src/app/shared/utils'),
      stylesStep('apps/my-app/src/styles.css'),
      providersStep('apps/my-app/src/app/app.config.ts'),
      configStep(SETUP_NX_CONFIG),
      FINAL_STEP,
    ],
  },
  {
    environment: 'analog',
    title: 'Analog.js',
    description: 'Install and configure zard/ui for Analog.js.',
    cli: cliSteps({
      create: SETUP_ANALOG_CREATE,
      createSubtitle:
        'Create an Analog.js application. When asked to add Tailwind, answer No — the steps below configure it.',
      initSubtitle: 'Prepare your entire project using the zard/ui cli. Pick "Analog.js" on the first question:',
    }),
    manual: [
      {
        title: 'Create project',
        subtitle:
          'Create an Analog.js application. When asked to add Tailwind, answer No — the steps below configure it.',
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
        title: 'Add dev dependencies',
        subtitle: 'Add the following dev dependencies to your project:',
        codeTabData: SETUP_ANALOG_DEV_DEPENDENCIES,
      },
      {
        title: 'Configure the Tailwind pipeline',
        subtitle:
          'Analog builds with Vite, so Tailwind is a Vite plugin and a .postcssrc.json would never be read. Register it in vite.config.ts:',
        codeBlockData: SETUP_ANALOG_VITE,
      },
      tsconfigStep('tsconfig.json', SETUP_ANALOG_TSCONFIG),
      ...coreManualSteps('src/app/shared/core'),
      utilsManualStep('src/app/shared/utils'),
      stylesStep('src/styles.css'),
      providersStep('src/app/app.config.ts'),
      configStep(SETUP_ANALOG_CONFIG),
      FINAL_STEP,
    ],
  },
  {
    environment: 'angular-library',
    title: 'Angular Library',
    description: 'Install and configure zard/ui inside a publishable Angular library.',
    cli: cliSteps({
      create: SETUP_ANGULAR_LIBRARY_CREATE,
      createSubtitle: 'Inside an existing Angular workspace, generate the library that will ship the components.',
      initSubtitle: 'Run the cli at the workspace root. Pick "Angular Library" on the first question:',
    }),
    manual: [
      {
        title: 'Create the library',
        subtitle: 'Inside an existing Angular workspace, generate the library that will ship the components.',
        codeBlockData: SETUP_ANGULAR_LIBRARY_CREATE,
      },
      {
        title: 'Add dependencies',
        // A library does not compile CSS: the consuming application processes Tailwind.
        subtitle: 'Add the following dependencies. There is no PostCSS setup here, the consuming app owns the build:',
        codeTabData: SETUP_ANGULAR_LIBRARY_DEPENDENCIES,
      },
      {
        title: 'Add dev dependencies',
        subtitle: 'Add the following dev dependencies:',
        codeTabData: SETUP_ANGULAR_LIBRARY_DEV_DEPENDENCIES,
      },
      tsconfigStep('tsconfig.json', SETUP_ANGULAR_LIBRARY_TSCONFIG),
      ...coreManualSteps('projects/ui/src/lib/shared/core'),
      utilsManualStep('projects/ui/src/lib/shared/utils'),
      stylesStep('projects/ui/src/styles.css', { block: SETUP_SHARED_STYLES_LIBRARY }),
      {
        title: 'Ship the theme with the library',
        subtitle:
          'ng-packagr only publishes what the entry point reaches, so declare the theme as an asset. With output "/" it lands at the package root:',
        codeBlockData: SETUP_ANGULAR_LIBRARY_NG_PACKAGE,
      },
      configStep(SETUP_ANGULAR_LIBRARY_CONFIG),
      FINAL_STEP,
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
      createSubtitle: 'Inside an existing Nx workspace, generate the library that will hold the components.',
      initSubtitle:
        'Run the cli at the workspace root. Pick "Nx Library" on the first question, then the library that receives the components:',
    }),
    manual: [
      {
        title: 'Create the library',
        subtitle: 'Inside an existing Nx workspace, generate the library that will hold the components.',
        codeBlockData: SETUP_NX_LIBRARY_CREATE,
      },
      {
        title: 'Add dependencies',
        subtitle: 'Add the following dependencies. There is no PostCSS setup here, the consuming app owns the build:',
        codeTabData: SETUP_NX_LIBRARY_DEPENDENCIES,
      },
      {
        title: 'Add dev dependencies',
        subtitle: 'Add the following dev dependencies:',
        codeTabData: SETUP_NX_LIBRARY_DEV_DEPENDENCIES,
      },
      tsconfigStep('tsconfig.base.json', SETUP_NX_LIBRARY_TSCONFIG),
      ...coreManualSteps('libs/ui/src/lib/shared/core'),
      utilsManualStep('libs/ui/src/lib/shared/utils'),
      stylesStep('libs/ui/src/styles.css', { block: SETUP_SHARED_STYLES_LIBRARY }),
      configStep(SETUP_NX_LIBRARY_CONFIG),
      FINAL_STEP,
      {
        title: 'Wire it up in the consuming app',
        subtitle:
          'The application that imports this library still has to register provideZard() in its app.config.ts and import the theme from the library styles.css.',
      },
    ],
  },
];
