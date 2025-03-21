import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardBadgeComponent } from '@zard/components/badge/badge.component';
import { SOCIAL_MEDIAS } from '@zard/shared/constants/medias.constant';
import { HEADER_PATHS } from '@zard/shared/constants/routes.contant';
import { environment } from 'apps/web/src/environments/environment';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'z-header',
  templateUrl: './header.component.html',
  standalone: true,
  imports: [RouterModule, ZardButtonComponent, ZardBadgeComponent],
})
export class HeaderComponent implements OnInit {
  private readonly storageKey = 'theme';
  readonly headerPaths = HEADER_PATHS;
  readonly socialMedias = SOCIAL_MEDIAS;
  readonly appVersion = environment.appVersion;

  ngOnInit(): void {
    this.initTheme();
  }

  initTheme(): void {
    const savedTheme = localStorage.getItem(this.storageKey);
    const html = document.documentElement;

    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      html.classList.add('dark');
      localStorage.setItem(this.storageKey, 'dark');
    } else {
      html.classList.remove('dark');
    }
  }

  toggleTheme(): void {
    const html = document.documentElement;
    const isDark = html.classList.contains('dark');

    if (isDark) {
      html.classList.remove('dark');
      localStorage.setItem(this.storageKey, 'light');
    } else {
      html.classList.add('dark');
      localStorage.setItem(this.storageKey, 'dark');
    }
  }

  getCurrentTheme(): 'light' | 'dark' {
    return localStorage.getItem(this.storageKey) as 'light' | 'dark';
  }
}
