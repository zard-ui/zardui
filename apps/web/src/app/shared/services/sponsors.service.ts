import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';

import { catchError, forkJoin, map, of } from 'rxjs';

import {
  SPONSOR_LOGINS,
  SPONSORS_FALLBACK,
  sponsorFallback,
  type SponsorProfile,
} from '@doc/shared/constants/sponsors.constant';

interface GithubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
}

/**
 * Kept out of `GithubService` on purpose: that one is in the initial bundle (the app
 * initializer injects it), while sponsors are only ever rendered by the About page.
 * Injecting this service from that lazy route keeps its code — and the 5 GitHub calls
 * it makes — off every other route.
 */
@Injectable({
  providedIn: 'root',
})
export class SponsorsService {
  private readonly http = inject(HttpClient);

  /**
   * One request per sponsor, all in parallel. `forkJoin` keeps the emission order of the
   * source array, so the rendered order always matches `SPONSOR_LOGINS` (required for a
   * deterministic prerender). Each request falls back on its own, so a rate-limited or
   * failing profile never takes the whole section down.
   */
  private readonly sponsorsResource = rxResource({
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

  readonly sponsors = computed<SponsorProfile[]>(() => {
    if (this.sponsorsResource.error()) return SPONSORS_FALLBACK;
    const sponsors = this.sponsorsResource.value();
    return sponsors.length ? sponsors : SPONSORS_FALLBACK;
  });

  readonly sponsorsLoading = computed(() => this.sponsorsResource.isLoading());
}
