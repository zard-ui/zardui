export interface SponsorProfile {
  login: string;
  name: string;
  avatar_url: string;
  html_url: string;
}

/**
 * GitHub Sponsors of the project, in display order.
 *
 * This list is intentionally independent from founders/maintainers/contributors:
 * someone can show up in both places and must NOT be deduplicated across sections.
 */
export const SPONSOR_LOGINS = ['Nurech', 'neopavan', 'kelverarruda', 'craftfirecode', 'asyncLucas'] as const;

export const SPONSORS_URL = 'https://github.com/sponsors/zard-ui';

/**
 * Profile used before (and when) the GitHub API is unavailable — the public API is
 * rate limited to 60 req/h per IP without a token, so the section must render anyway.
 * `github.com/{login}.png` is a stable redirect to the user avatar and needs no API call.
 */
export function sponsorFallback(login: string): SponsorProfile {
  return {
    login,
    name: login,
    avatar_url: `https://github.com/${login}.png?size=200`,
    html_url: `https://github.com/${login}`,
  };
}

export const SPONSORS_FALLBACK: SponsorProfile[] = SPONSOR_LOGINS.map(sponsorFallback);
