import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
  private readonly http = inject(HttpClient);
  private readonly repoUrl = 'https://api.github.com/repos/zard-ui/zardui';
  private readonly contributorsEnpoint = '/contributors';

  getStarsCount(): Observable<number> {
    return this.http.get<RepoData>(this.repoUrl).pipe(map(repo => repo.stargazers_count));
  }

  getContributors(): Observable<Contributor[]> {
    return this.http.get<Contributor[]>(`${this.repoUrl}${this.contributorsEnpoint}`);
  }
}
