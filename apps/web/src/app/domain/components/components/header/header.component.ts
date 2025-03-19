import { ZardButtonComponent } from '@zard/components/button/button.component';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone: true,
  imports: [RouterModule, ZardButtonComponent],
})
export class HeaderComponent implements OnInit {
  private readonly storageKey = 'theme';

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
