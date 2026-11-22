import { ChangeDetectionStrategy, Component } from '@angular/core';

import { provideIcons } from '@ng-icons/core';
import { lucideCloudUpload } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardEmptyComponent } from '@zard/components/empty/empty.component';

@Component({
  selector: 'z-preview-02-file-upload',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardButtonComponent, ZardCardImports, ZardEmptyComponent],
  viewProviders: [provideIcons({ lucideCloudUpload })],
  host: { class: 'block' },
  template: `
    <z-card>
      <z-card-header>
        <z-card-title zTitle="File Upload" />
        <z-card-description zDescription="Drag and drop or browse" />
      </z-card-header>
      <z-card-content>
        <z-empty
          class="border"
          zIcon="lucideCloudUpload"
          zTitle="Upload files"
          zDescription="PNG, JPG, PDF up to 10MB"
          [zActions]="[browse]"
        />
        <ng-template #browse>
          <button type="button" z-button>Browse Files</button>
        </ng-template>
      </z-card-content>
    </z-card>
  `,
})
export class Preview02FileUploadComponent {}
