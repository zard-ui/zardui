import { httpResource } from '@angular/common/http';
import { computed, Injectable } from '@angular/core';

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
  private readonly repoUrl = 'https://api.github.com/repos/zard-ui/zardui';

  private readonly repoResource = httpResource<RepoData>(() => this.repoUrl, {
    defaultValue: { stargazers_count: 0, forks_count: 0, watchers_count: 0 },
  });

  private readonly contributorsResource = httpResource<Contributor[]>(() => `${this.repoUrl}/contributors`, {
    defaultValue: [],
  });

  readonly starsCount = computed(() => this.repoResource.value().stargazers_count);
  readonly contributors = this.contributorsResource.value;
}
