import { Injectable, signal } from '@angular/core';

/**
 * What the site header and the `/create` page share: the header's "Get Code" button opens the dialog that the page
 * hosts, so the request has to live above both of them.
 */
@Injectable({ providedIn: 'root' })
export class CreateShellService {
  readonly getCodeOpen = signal(false);

  openGetCode(): void {
    this.getCodeOpen.set(true);
  }
}
