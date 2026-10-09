import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardCardImports } from '@/shared/components/card/card.imports';

@Component({
  selector: 'z-demo-card-terms-of-service',
  imports: [ZardCardImports, ZardButtonComponent],
  template: `
    <z-card class="mx-auto w-full max-w-sm">
      <z-card-header>
        <z-card-title zTitle="Terms of Service" />
        <z-card-description zDescription="Review the terms before accepting the agreement." />
      </z-card-header>
      <z-card-content class="-mb-4">
        <div class="bg-muted/50 -mx-4 max-h-48 space-y-4 overflow-y-auto border-t p-4 text-sm/relaxed">
          <p>
            These terms govern your use of the workspace, including access to shared documents, project files, and
            collaboration tools.
          </p>
          <p>
            You are responsible for the content you upload and for ensuring that your team has the appropriate
            permissions to view or edit it.
          </p>
          <p>
            We may update features or limits as the service evolves. When those changes materially affect your workflow,
            we will notify your workspace administrators.
          </p>
          <p>
            By continuing, you agree to keep your account credentials secure and to follow your organization's
            acceptable use policies.
          </p>
        </div>
      </z-card-content>
      <z-card-footer zFooterBorder class="justify-end gap-2">
        <z-button zType="outline">Decline</z-button>
        <z-button>Accept</z-button>
      </z-card-footer>
    </z-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCardTermsOfServiceComponent {}
