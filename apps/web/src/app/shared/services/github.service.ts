import { HttpClient, httpResource } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';

import { catchError, forkJoin, map, of } from 'rxjs';

import {
  SPONSOR_LOGINS,
  SPONSORS_FALLBACK,
  sponsorFallback,
  type SponsorProfile,
} from '@doc/shared/constants/sponsors.constant';

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

interface GithubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
}

@Injectable({
  providedIn: 'root',
})
export class GithubService {
  private readonly http = inject(HttpClient);
  private readonly repoUrl = 'https://api.github.com/repos/zard-ui/zardui';

  private readonly repoResource = httpResource<RepoData>(() => this.repoUrl, {
    defaultValue: { stargazers_count: 0, forks_count: 0, watchers_count: 0 },
  });

  private readonly contributorsResource = httpResource<Contributor[]>(() => `${this.repoUrl}/contributors`, {
    defaultValue: [],
  });

  /**
   * Only the About page shows sponsors, and every prerendered route boots its own app
   * instance — leaving this always-on would spend 5 extra GitHub calls per route and
   * burn the unauthenticated 60 req/h budget long before the build ends. Idle until
   * `loadSponsors()` is called (`params` returning `undefined` keeps a resource idle).
   */
  private readonly sponsorsRequested = signal(false);

  /**
   * One request per sponsor, all in parallel. `forkJoin` keeps the emission order of the
   * source array, so the rendered order always matches `SPONSOR_LOGINS` (required for a
   * deterministic prerender). Each request falls back on its own, so a rate-limited or
   * failing profile never takes the whole section down.
   */
  private readonly sponsorsResource = rxResource({
    params: () => (this.sponsorsRequested() ? SPONSOR_LOGINS : undefined),
    stream: () =>
      forkJoin(
        SPONSOR_LOGINS.map(login =>
          this.http.get<GithubUser>(`https://api.github.com/users/${login}`).pipe(
            map(user => ({
              login,
              name: user.name?.trim() || login,
              avatar_url: user.avatar_url || `https://github.com/${login}.png?size=200`,
              html_url: user.html_url || `https://github.com/${login}`,
            })),
            catchError(() => of(sponsorFallback(login))),
          ),
        ),
      ),
    defaultValue: SPONSORS_FALLBACK,
  });

  readonly starsCount = computed(() => {
    if (this.repoResource.error()) return 0;
    return this.repoResource.value().stargazers_count;
  });

  readonly starsCountFormatted = computed(() => {
    const count = this.starsCount();
    return count > 0 ? formatCompactCount(count) : '';
  });

  readonly contributors = computed(() => {
    if (this.contributorsResource.error()) return [];
    return this.contributorsResource.value();
  });

  readonly sponsors = computed<SponsorProfile[]>(() => {
    if (this.sponsorsResource.error()) return SPONSORS_FALLBACK;
    const sponsors = this.sponsorsResource.value();
    return sponsors.length ? sponsors : SPONSORS_FALLBACK;
  });

  readonly sponsorsLoading = computed(() => this.sponsorsResource.isLoading());

  /** Starts the sponsor requests. Called by the only page that renders them. */
  loadSponsors(): void {
    this.sponsorsRequested.set(true);
  }

  async init() {
    this.repoResource.value();
    this.contributorsResource.value();
  }
}

function formatCompactCount(value: number): string {
  if (value < 1000) return String(value);
  const thousands = Math.floor(value / 100) / 10;
  return `${thousands.toFixed(1).replace(/\.0$/, '')}k`;
}
