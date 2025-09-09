import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface ChangelogEntry {
  date: string;
  filename: string;
  content: string; // Raw markdown content
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
      console.log('Loading all changelog files:', filenames);

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
        // O z-markdown-renderer vai processar o conteúdo, então retornamos o raw content
        return {
          date: this.extractDateFromFilename(filename).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
          }),
          filename,
          content: rawContent, // Conteúdo raw para z-markdown-renderer
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
    // Listar arquivos conhecidos que realmente existem
    const knownFiles = ['03-2025.md', '04-2025.md', '05-2025.md', '06-2025.md', '07-2025.md', '08-2025.md', '09-2025.md'];

    const foundFiles: string[] = [];

    // Verificar quais arquivos realmente existem
    for (const filename of knownFiles) {
      try {
        const response = await this.http.get(`${this.changelogPath}${filename}`, { responseType: 'text' }).toPromise();
        if (response) {
          foundFiles.push(filename);
        }
      } catch {
        // Arquivo não encontrado, continuar
      }
    }

    // Ordenar por data (mais recente primeiro)
    return foundFiles.sort((a, b) => {
      const dateA = this.extractDateFromFilename(a);
      const dateB = this.extractDateFromFilename(b);
      return dateB.getTime() - dateA.getTime();
    });
  }

  extractDateFromFilename(filename: string): Date {
    // Assume formato: MM-YYYY.md
    const match = filename.match(/(\d{2})-(\d{4})\.md$/);
    if (match) {
      const month = parseInt(match[1], 10) - 1; // JavaScript months are 0-indexed
      const year = parseInt(match[2], 10);
      return new Date(year, month, 1);
    }
    return new Date(); // fallback
  }

  private generateIdFromFilename(filename: string): string {
    return filename.replace('.md', '').replace(/[^a-zA-Z0-9]/g, '-');
  }
}
