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
    registerData?: CodeBlockData,
  ): { cli: Step[]; manual: Step[] } {
    return {
      cli: this.generateCliSteps(componentName, cliAddData, registerData),
      manual: this.generateManualSteps(componentName, manualCodeData, manualDepsData, registerData),
    };
  }

  private generateCliSteps(componentName: string, cliAddData?: CodeTabData, registerData?: CodeBlockData): Step[] {
    const steps: Step[] = [];

    const step: Step = {
      title: 'Run the CLI',
      subtitle: 'Use the CLI to add the component to your project.',
    };
    if (cliAddData) {
      step.codeTabData = cliAddData;
    }
    steps.push(step);

    if (registerData) {
      steps.push({
        title: `Register ${componentName} to your project`,
        codeBlockData: registerData,
      });
    }

    return steps;
  }

  private generateManualSteps(
    componentName: string,
    manualCodeData?: CodeBlockData[],
    manualDepsData?: CodeTabData,
    registerData?: CodeBlockData,
  ): Step[] {
    const steps: Step[] = [];

    if (manualDepsData) {
      steps.push({
        title: 'Install dependencies',
        subtitle: 'Install the required dependencies for this component.',
        codeTabData: manualDepsData,
      });
    }

    if (manualCodeData) {
      const files = manualCodeData.filter(block => block.title !== 'index.ts');

      for (const block of files) {
        steps.push({
          title: `Add ${block.title ?? 'file'}`,
          subtitle: `Create the following file in your project.`,
          codeBlockData: block,
        });
      }
    }

    if (registerData) {
      steps.push({
        title: `Register ${componentName} to your project`,
        codeBlockData: registerData,
      });
    }

    return steps;
  }
}
