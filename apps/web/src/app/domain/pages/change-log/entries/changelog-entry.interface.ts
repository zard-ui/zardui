import { Type } from '@angular/core';

export interface ChangelogEntryMeta {
  month: string; // 'November 2025'
  year: number;
  monthNumber: number;
  date: Date;
  id: string; // '11-2025'
}

export interface ChangelogExample {
  name: string;
  description?: string;
  component: Type<unknown>;
  componentName: string; // Nome do componente para instalação (ex: 'carousel')
}

export interface ChangelogHighlight {
  title: string;
  description: string;
  icon: 'zap' | 'terminal' | 'moon' | 'package' | 'rocket' | 'shield' | 'code' | 'settings';
  code?: string; // Código opcional para exibir (ex: comando CLI)
}

export interface ChangelogEntryComponent {
  meta: ChangelogEntryMeta;
  overview: string; // Descrição geral das mudanças do mês
  examples: ChangelogExample[]; // Componentes novos ou exemplos de features
  highlights?: ChangelogHighlight[]; // Melhorias estruturais/DX (sem componentes visuais)
}

export interface ChangelogEntryConfig {
  id: string;
  component: Type<ChangelogEntryComponent>;
  meta: ChangelogEntryMeta;
  overview: string;
  examples: ChangelogExample[];
  highlights?: ChangelogHighlight[];
}
