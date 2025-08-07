import { Injectable } from '@angular/core';
import { Step } from '../constants/install.constant';

@Injectable({
  providedIn: 'root',
})
export class DynamicInstallationService {
  generateInstallationSteps(componentName: string): { cli: Step[]; manual: Step[] } {
    return {
      cli: this.generateCliSteps(componentName),
      manual: this.generateManualSteps(componentName),
    };
  }

  private generateCliSteps(componentName: string): Step[] {
    const steps: Step[] = [];

    // Single step: Add component via CLI (assumes user already has base setup)
    steps.push({
      title: 'Run the CLI',
      subtitle: 'Use the CLI to add the component to your project.',
      file: {
        path: `/installation/cli/add-${componentName}.md`,
        lineNumber: false,
      },
    });

    return steps;
  }

  private generateManualSteps(componentName: string): Step[] {
    const steps: Step[] = [];

    // Check if component has dependencies
    const hasDependencies = this.checkIfComponentHasDependencies(componentName);
    if (hasDependencies) {
      // Step 1: Install dependencies
      steps.push({
        title: 'Install dependencies',
        subtitle: 'Install the required dependencies for this component.',
        file: {
          path: `/installation/manual/install-deps-${componentName}.md`,
          lineNumber: false,
        },
      });
    }

    // Step 2: Add utilities (conditional - only if component needs utils)
    const needsUtils = this.componentNeedsUtils(componentName);
    if (needsUtils) {
      steps.push({
        title: 'Add utility functions',
        subtitle: 'Add the following utility functions to your project. Create a `lib/utils.ts` file in your project and add the following code:',
        path: 'lib/utils.ts',
        file: {
          path: '/installation/manual/utils.md',
          lineNumber: true,
        },
      });
    }

    // Step 3: Add main component
    steps.push({
      title: 'Add the component files',
      subtitle: `Create the component directory structure and add the following files to your project.`,
      path: `components/${componentName}`,
      file: {
        path: `/installation/manual/${componentName}.md`,
        lineNumber: true,
      },
      expandable: true, // Nova propriedade que vamos implementar
    });

    return steps;
  }

  private componentNeedsUtils(componentName: string): boolean {
    // Components that need utils based on our analysis
    const utilsComponents = [
      'alert',
      'avatar',
      'badge',
      'breadcrumb',
      'button',
      'card',
      'checkbox',
      'command',
      'dialog',
      'divider',
      'loader',
      'popover',
      'progress-bar',
      'radio',
      'select',
      'slider',
      'switch',
      'toggle',
    ];

    return utilsComponents.includes(componentName);
  }

  private checkIfComponentHasDependencies(componentName: string): boolean {
    // Components that have external dependencies
    const componentsWithDeps = [
      'accordion',
      'alert',
      'avatar',
      'badge',
      'breadcrumb',
      'button',
      'card',
      'checkbox',
      'command',
      'dialog',
      'divider',
      'dropdown',
      'input',
      'loader',
      'popover',
      'progress-bar',
      'radio',
      'select',
      'slider',
      'switch',
      'tabs',
      'toggle',
      'tooltip',
    ];

    return componentsWithDeps.includes(componentName);
  }
}
