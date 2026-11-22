import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCamera, lucideCirclePlus, lucideCloud, lucideGlobe } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@zard/components/button';
import { ZardCardImports } from '@zard/components/card';
import { ZardFieldImports } from '@zard/components/field';
import { ZardInputComponent } from '@zard/components/input';
import { ZardInputGroupImports } from '@zard/components/input-group';

const LINKS = [
  {
    id: 'p01-spotify-url',
    label: 'Spotify Artist URL',
    icon: 'lucideCirclePlus',
    value: 'spotify.com/artist/3j...2k',
    placeholder: '',
  },
  {
    id: 'p01-instagram-handle',
    label: 'Instagram Handle',
    icon: 'lucideCamera',
    value: '@julianduryea_music',
    placeholder: '',
  },
  {
    id: 'p01-soundcloud-url',
    label: 'SoundCloud URL',
    icon: 'lucideCloud',
    value: '',
    placeholder: 'soundcloud.com/username',
  },
  { id: 'p01-website-url', label: 'Website', icon: 'lucideGlobe', value: '', placeholder: 'https://yoursite.com' },
] as const;

@Component({
  selector: 'z-preview-01-social-links',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardCardImports, ZardFieldImports, ZardInputComponent, ZardInputGroupImports, ZardButtonComponent, NgIcon],
  viewProviders: [provideIcons({ lucideCamera, lucideCirclePlus, lucideCloud, lucideGlobe })],
  template: `
    <z-card>
      <z-card-header>
        <z-card-title zTitle="Social Links" />
      </z-card-header>
      <z-card-content>
        <z-field-group>
          @for (link of links; track link.id) {
            <z-field>
              <label z-field-label [for]="link.id">{{ link.label }}</label>
              <z-input-group>
                <input z-input [id]="link.id" [value]="link.value" [placeholder]="link.placeholder" />
                <z-input-group-addon>
                  <ng-icon [name]="link.icon" />
                </z-input-group-addon>
              </z-input-group>
            </z-field>
          }
        </z-field-group>
      </z-card-content>
      <z-card-footer class="style-sera:justify-center justify-end gap-2">
        <button type="button" z-button zType="secondary" class="style-sera:flex-1">Discard</button>
        <button type="button" z-button class="style-sera:flex-1">Save Changes</button>
      </z-card-footer>
    </z-card>
  `,
})
export class Preview01SocialLinksComponent {
  protected readonly links = LINKS;
}
