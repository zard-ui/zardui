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
import { SETUP_ANGULAR_LIBRARY_PACKAGE } from '@generated/documentation/setup/angular-library/package';
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
import { SETUP_SHARED_CLI_CREATE } from '@generated/documentation/setup/shared/cli-create';
import { SETUP_SHARED_CLI_INIT } from '@generated/documentation/setup/shared/cli-init';
import { SETUP_SHARED_CORE_CSS } from '@generated/documentation/setup/shared/core-css';
import { SETUP_SHARED_CORE_DIRECTIVES } from '@generated/documentation/setup/shared/core-directives';
import { SETUP_SHARED_CORE_EVENT_MANAGER } from '@generated/documentation/setup/shared/core-event-manager';
import { SETUP_SHARED_CORE_I18N } from '@generated/documentation/setup/shared/core-i18n';
import { SETUP_SHARED_CORE_I18N_LOCALES } from '@generated/documentation/setup/shared/core-i18n-locales';
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
  /** Applications only: `init` for a project that already exists, shown apart from the steps that create one. */
  existingProject?: { subtitle: string; codeTabData: CodeTabData };
}

const TAILWIND_NOTE = {
  text: 'Since Tailwind is the core of the project, we do not recommend using other pre-processors.',
  href: '/docs/pre-processors',
  external: false,
};

const THEMING_NOTE = { text: 'theming section.', href: '/docs/theming' };

const COMPONENTS_NOTE = {
  text: 'Open the components page and select what component you want to install',
  href: '/docs/components',
  external: false,
};

/** The files the `core` registry item ships, one step per destination folder. */
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
      title: 'Add the i18n service',
      subtitle: `Create ${corePath}/i18n/ with:`,
      codeBlockData: SETUP_SHARED_CORE_I18N,
    },
    {
      title: 'Add the i18n locales',
      subtitle: `Create ${corePath}/i18n/locales/ with:`,
      codeBlockData: SETUP_SHARED_CORE_I18N_LOCALES,
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

/**
 * The guided path of an application: `zard-cli create` scaffolds it with the framework's own generator and configures
 * zard/ui. No `--template`: the CLI asks, and the guide says what to pick.
 */
function appCliSteps(template: string): Step[] {
  return [
    {
      title: 'Create project',
      subtitle: `One command creates the application and configures zard/ui in it. Pick "${template}" when it asks for the template. It starts from the default design; to choose your own, build it on the create page and run the command it gives you instead.`,
      url: { text: 'Open the create page', href: '/create' },
      codeTabData: SETUP_SHARED_CLI_CREATE,
    },
    {
      title: "That's it",
      subtitle: 'You can now start adding components to your project.',
      url: COMPONENTS_NOTE,
    },
  ];
}

function existingProject(question: string): Installation['existingProject'] {
  return {
    subtitle: `Run init at its root instead. ${question} It configures zard/ui with the default design and asks only for the theme color.`,
    codeTabData: SETUP_SHARED_CLI_INIT,
  };
}

/** The steps of the guided path of a library: create it inside the workspace, run init, then use. */
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
    subtitle: `Add these lines inside compilerOptions on your ${file}. If it already has a paths object, add the entry to it instead of a second one. Do not add baseUrl, it is an error from TypeScript 6 on.`,
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
    cli: appCliSteps('Angular'),
    existingProject: existingProject('Pick "Angular" on the first question.'),
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
    cli: appCliSteps('Nx'),
    existingProject: existingProject('Pick "Nx" on the first question, then the app that receives the components.'),
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
    cli: appCliSteps('Analog'),
    existingProject: existingProject('Pick "Analog.js" on the first question.'),
    manual: [
      {
        title: 'Create project',
        subtitle:
          'Create an Analog.js application from the full-stack template, without its Tailwind setup: the steps below configure it.',
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
          'Analog builds with Vite, so Tailwind is a Vite plugin and a .postcssrc.json would never be read. Register it in the vite.config.ts the template created (the file below is that one with the additions, so keep its test block), and set build.cssTarget: without it Vite lowers the logical CSS the components use to left/right rules chosen by the lang attribute, and right-to-left layouts break. Also alias @ to an absolute path: on Windows Analog resolves the tsconfig @/ paths with backslashes and relative imports with forward slashes, so Vite bundles each component twice and anything that injects a parent component (input-otp, context-menu, chart) stops working.',
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
          'The build only publishes what the entry point reaches, so declare every CSS file of the library as an asset: the theme imports the core one. With output "/" they land at the package root. A library generated by Angular 22 or later builds with @angular/build:library and has no ng-package.json, so the assets go in its build options in angular.json; an older one declares them in projects/ui/ng-package.json:',
        codeBlockData: SETUP_ANGULAR_LIBRARY_NG_PACKAGE,
      },
      {
        title: 'Export the theme',
        subtitle:
          'The published package has an exports map, and Node refuses any path it does not list, so @import "ui/styles.css" fails until the library lists it. Add this to the library package.json; the build merges it into the published one:',
        codeBlockData: SETUP_ANGULAR_LIBRARY_PACKAGE,
      },
      configStep(SETUP_ANGULAR_LIBRARY_CONFIG),
      FINAL_STEP,
      {
        title: 'Wire it up in the consuming app',
        subtitle:
          'The application that installs this library compiles its CSS, so it needs the Tailwind PostCSS pipeline: install it with npm install -D tailwindcss @tailwindcss/postcss postcss tailwindcss-animate (the theme loads that plugin) and add this .postcssrc.json at its root. Then it registers provideZard() in its app.config.ts, imports the theme with @import "<your-library>/styles.css", and imports the components from the library entry point. CSS does not read tsconfig paths, so the package has to be installed in the app: inside the same workspace, run ng build ui and then npm install ./dist/ui. Export the components from public-api.ts together with the core and utils folders, which they depend on, or the build stops with NG3001. When you copy a component into the library by hand, change its @/ imports to relative paths (the CLI does it for you): the build leaves @/ as it is, and the published package would not resolve it. In the app, always import from the package name: reaching into the library source through @/ makes the app compile those files itself, and Angular rejects their imports arrays with NG3004.',
        codeBlockData: SETUP_SHARED_POSTCSS,
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
          'The application that imports this library compiles its CSS, so it needs the Tailwind PostCSS pipeline: install it with npm install -D tailwindcss @tailwindcss/postcss postcss tailwindcss-animate (the theme loads that plugin) and add this .postcssrc.json at its root. Then it registers provideZard() in its app.config.ts, imports the theme from the library styles.css with a relative path, such as @import "../../../libs/ui/src/styles.css" in apps/my-app/src/styles.css (CSS does not read the tsconfig path alias), and imports the components from the library entry point (src/index.ts), which has to export them along with the core and utils folders. Always import from the library path alias, such as @acme/ui: reaching into its source through @/ makes the app compile those files itself, and Angular rejects their imports arrays with NG3004.',
        codeBlockData: SETUP_SHARED_POSTCSS,
      },
    ],
  },
];
