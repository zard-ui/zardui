import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface ChangelogEntry {
  date: string;
  filename: string;
  content: string;
  id: string;
}

@Injectable({
  providedIn: 'root',
})
export class ChangelogService {
  private readonly http = inject(HttpClient);
  private readonly changelogPath = '/documentation/change-log/';

  async loadAllEntries(): Promise<ChangelogEntry[]> {
    try {
      const filenames = await this.getAvailableFiles();
      const loadPromises = filenames.map(filename => this.loadSingleEntry(filename).toPromise());
      const entries = await Promise.all(loadPromises);

      return entries.filter(entry => entry !== null) as ChangelogEntry[];
    } catch (error) {
      console.error('Error loading all entries:', error);
      return [];
    }
  }

  private loadSingleEntry(filename: string): Observable<ChangelogEntry | null> {
    const filePath = `${this.changelogPath}${filename}`;

    return this.http.get(filePath, { responseType: 'text' }).pipe(
      map(rawContent => {
        return {
          date: this.extractDateFromFilename(filename).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
          }),
          filename,
          content: rawContent,
          id: this.generateIdFromFilename(filename),
        };
      }),
      catchError(error => {
        console.warn(`Failed to load ${filename}:`, error);
        return of(null);
      }),
    );
  }

  private async getAvailableFiles(): Promise<string[]> {
    const knownFiles = [
      '03-2025.md',
      '04-2025.md',
      '05-2025.md',
      '06-2025.md',
      '07-2025.md',
      '08-2025.md',
      '09-2025.md',
      '10-2025.md',
      '11-2025.md',
    ];

    const foundFiles: string[] = [];

    for (const filename of knownFiles) {
      try {
        const response = await this.http.get(`${this.changelogPath}${filename}`, { responseType: 'text' }).toPromise();
        if (response) {
          foundFiles.push(filename);
        }
      } catch {
        // File not found, skip
      }
    }

    return foundFiles.sort((a, b) => {
      const dateA = this.extractDateFromFilename(a);
      const dateB = this.extractDateFromFilename(b);
      return dateB.getTime() - dateA.getTime();
    });
  }

  extractDateFromFilename(filename: string): Date {
    const match = filename.match(/(\d{2})-(\d{4})\.md$/);
    if (match) {
      const month = parseInt(match[1], 10) - 1;
      const year = parseInt(match[2], 10);
      return new Date(year, month, 1);
    }
    return new Date();
  }

  private generateIdFromFilename(filename: string): string {
    return filename.replace('.md', '').replace(/[^a-zA-Z0-9]/g, '-');
  }
}
