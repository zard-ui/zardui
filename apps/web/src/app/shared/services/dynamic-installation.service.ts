import { Injectable } from '@angular/core';

import type { CodeBlockData, CodeTabData } from '@highlight/types';

import { Step } from '../constants/install.constant';

@Injectable({
  providedIn: 'root',
})
export class DynamicInstallationService {
  generateInstallationSteps(
    componentName: string,
    cliAddData?: CodeTabData,
    manualCodeData?: CodeBlockData[],
    manualDepsData?: CodeTabData,
  ): { cli: Step[]; manual: Step[] } {
    return {
      cli: this.generateCliSteps(componentName, cliAddData),
      manual: this.generateManualSteps(componentName, manualCodeData, manualDepsData),
    };
  }

  private generateCliSteps(componentName: string, cliAddData?: CodeTabData): Step[] {
    const steps: Step[] = [];

    const step: Step = {
      title: 'Run the CLI',
      subtitle: 'Use the CLI to add the component to your project.',
    };
    if (cliAddData) {
      step.codeTabData = cliAddData;
    }
    steps.push(step);

    if (this.checkIfComponentHasRegisterStep(componentName)) {
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

  private generateManualSteps(
    componentName: string,
    manualCodeData?: CodeBlockData[],
    manualDepsData?: CodeTabData,
  ): Step[] {
    const steps: Step[] = [];

    if (this.checkIfComponentHasDependencies(componentName) && manualDepsData) {
      steps.push({
        title: 'Install dependencies',
        subtitle: 'Install the required dependencies for this component.',
        codeTabData: manualDepsData,
      });
    }

    const manualStep: Step = {
      title: 'Add the component files',
      subtitle: 'Create the component directory structure and add the following files to your project.',
      path: `components/${componentName}`,
      expandable: true,
    };
    if (manualCodeData) {
      manualStep.codeBlockData = manualCodeData;
    }
    steps.push(manualStep);

    if (this.checkIfComponentHasRegisterStep(componentName)) {
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
    const componentsWithDeps = ['toast', 'carousel'];
    return componentsWithDeps.includes(componentName);
  }

  private checkIfComponentHasRegisterStep(componentName: string): boolean {
    const componentsWithDeps = ['toast'];
    return componentsWithDeps.includes(componentName);
  }
}
