import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';

import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

export interface RepoData {
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
}

export interface Contributor {
  login: string;
  avatar_url: string;
  contributions: number;
  html_url: string;
}

@Injectable({
  providedIn: 'root',
})
export class GithubService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly http = inject(HttpClient);
  private readonly repoUrl = 'https://api.github.com/repos/zard-ui/zardui';
  private readonly contributorsEnpoint = '/contributors';

  getStarsCount(): Observable<number> {
    // Durante SSR/prerender, retorna um valor placeholder
    if (!this.isBrowser) {
      return of(0);
    }
    return this.http.get<RepoData>(this.repoUrl).pipe(map(repo => repo.stargazers_count));
  }

  getContributors(): Observable<Contributor[]> {
    // Durante SSR/prerender, retorna um array vazio
    if (!this.isBrowser) {
      return of([]);
    }
    return this.http.get<Contributor[]>(`${this.repoUrl}${this.contributorsEnpoint}`);
  }
}
