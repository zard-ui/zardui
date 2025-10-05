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

    steps.push({
      title: 'Run the CLI',
      subtitle: 'Use the CLI to add the component to your project.',
      file: {
        path: `/installation/cli/add-${componentName}.md`,
        lineNumber: false,
      },
    });

    const hasExtraSteps = this.checkIfComponentHasRegisterStep(componentName);
    if (hasExtraSteps) {
      steps.push({
        title: `Register ${componentName} to your project`,
        file: {
          path: `/installation/cli/register-${componentName}.md`,
          lineNumber: true,
        },
      });
    }

    return steps;
  }

  private generateManualSteps(componentName: string): Step[] {
    const steps: Step[] = [];

    const hasDependencies = this.checkIfComponentHasDependencies(componentName);
    if (hasDependencies) {
      steps.push({
        title: 'Install dependencies',
        subtitle: 'Install the required dependencies for this component.',
        file: {
          path: `/installation/manual/install-deps-${componentName}.md`,
          lineNumber: false,
        },
      });
    }

    steps.push({
      title: 'Add the component files',
      subtitle: `Create the component directory structure and add the following files to your project.`,
      path: `components/${componentName}`,
      file: {
        path: `/installation/manual/${componentName}.md`,
        lineNumber: true,
      },
      expandable: true,
    });

    const hasExtraSteps = this.checkIfComponentHasRegisterStep(componentName);
    if (hasExtraSteps) {
      steps.push({
        title: `Register ${componentName}  to your project`,
        file: {
          path: `/installation/cli/register-${componentName}.md`,
          lineNumber: true,
        },
      });
    }

    return steps;
  }

  private checkIfComponentHasDependencies(componentName: string): boolean {
    const componentsWithDeps = ['toast'];
    return componentsWithDeps.includes(componentName);
  }

  private checkIfComponentHasRegisterStep(componentName: string): boolean {
    const componentsWithDeps = ['toast'];
    return componentsWithDeps.includes(componentName);
  }
}
