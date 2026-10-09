```typescript title="de-de.ts" expandable="true" copyButton showLineNumbers
import type { ZardI18nInterface } from '../i18n.types';

export const de_DE: ZardI18nInterface = {
  locale: 'de-DE',
  calendar: {
    weekStartsOn: 1,
    labels: {
      today: 'Heute',
      nextMonth: 'Nächster Monat',
      previousMonth: 'Vorheriger Monat',
      nextYear: 'Nächstes Jahr',
      previousYear: 'Vorheriges Jahr',
      chooseMonth: 'Monat auswählen',
      chooseYear: 'Jahr auswählen',
      selected: 'Ausgewählt',
      rangeStart: 'Bereichsbeginn',
      rangeEnd: 'Bereichsende',
      inRange: 'Im Bereich',
      outsideMonth: 'Außerhalb des Monats',
      disabled: 'Deaktiviert',
    },
  },
};
```

```typescript title="en-us.ts" expandable="true" copyButton showLineNumbers
import { DEFAULT_CALENDAR_I18N } from '../i18n.constants';
import type { ZardI18nInterface } from '../i18n.types';

export const en_US: ZardI18nInterface = {
  locale: 'en-US',
  calendar: DEFAULT_CALENDAR_I18N,
};
```

```typescript title="es-es.ts" expandable="true" copyButton showLineNumbers
import type { ZardI18nInterface } from '../i18n.types';

export const es_ES: ZardI18nInterface = {
  locale: 'es-ES',
  calendar: {
    weekStartsOn: 1,
    labels: {
      today: 'Hoy',
      nextMonth: 'Mes siguiente',
      previousMonth: 'Mes anterior',
      nextYear: 'Año siguiente',
      previousYear: 'Año anterior',
      chooseMonth: 'Elegir el mes',
      chooseYear: 'Elegir el año',
      selected: 'Seleccionado',
      rangeStart: 'Inicio de rango',
      rangeEnd: 'Fin de rango',
      inRange: 'En rango',
      outsideMonth: 'Fuera de mes',
      disabled: 'Deshabilitado',
    },
  },
};
```

```typescript title="fr-fr.ts" expandable="true" copyButton showLineNumbers
import type { ZardI18nInterface } from '../i18n.types';

export const fr_FR: ZardI18nInterface = {
  locale: 'fr-FR',
  calendar: {
    weekStartsOn: 1,
    labels: {
      today: "Aujourd'hui",
      nextMonth: 'Mois suivant',
      previousMonth: 'Mois précédent',
      nextYear: 'Année suivante',
      previousYear: 'Année précédente',
      chooseMonth: 'Choisir le mois',
      chooseYear: "Choisir l'année",
      selected: 'Sélectionné',
      rangeStart: 'Début de plage',
      rangeEnd: 'Fin de plage',
      inRange: 'Dans la plage',
      outsideMonth: 'Hors du mois',
      disabled: 'Désactivé',
    },
  },
};
```

```typescript title="it-it.ts" expandable="true" copyButton showLineNumbers
import type { ZardI18nInterface } from '../i18n.types';

export const it_IT: ZardI18nInterface = {
  locale: 'it-IT',
  calendar: {
    weekStartsOn: 1,
    labels: {
      today: 'Oggi',
      nextMonth: 'Mese successivo',
      previousMonth: 'Mese precedente',
      nextYear: 'Anno successivo',
      previousYear: 'Anno precedente',
      chooseMonth: 'Scegli il mese',
      chooseYear: "Scegli l'anno",
      selected: 'Selezionato',
      rangeStart: 'Inizio intervallo',
      rangeEnd: 'Fine intervallo',
      inRange: "Nell'intervallo",
      outsideMonth: 'Fuori mese',
      disabled: 'Disabilitato',
    },
  },
};
```

```typescript title="pt-br.ts" expandable="true" copyButton showLineNumbers
import type { ZardI18nInterface } from '../i18n.types';

export const pt_BR: ZardI18nInterface = {
  locale: 'pt-BR',
  calendar: {
    weekStartsOn: 0,
    labels: {
      today: 'Hoje',
      nextMonth: 'Próximo mês',
      previousMonth: 'Mês anterior',
      nextYear: 'Próximo ano',
      previousYear: 'Ano anterior',
      chooseMonth: 'Escolher mês',
      chooseYear: 'Escolher ano',
      selected: 'Selecionado',
      rangeStart: 'Início do intervalo',
      rangeEnd: 'Fim do intervalo',
      inRange: 'No intervalo',
      outsideMonth: 'Fora do mês',
      disabled: 'Desativado',
    },
  },
};
```

```typescript title="pt-pt.ts" expandable="true" copyButton showLineNumbers
import type { ZardI18nInterface } from '../i18n.types';

export const pt_PT: ZardI18nInterface = {
  locale: 'pt-PT',
  calendar: {
    weekStartsOn: 1,
    labels: {
      today: 'Hoje',
      nextMonth: 'Mês seguinte',
      previousMonth: 'Mês anterior',
      nextYear: 'Ano seguinte',
      previousYear: 'Ano anterior',
      chooseMonth: 'Escolher mês',
      chooseYear: 'Escolher ano',
      selected: 'Selecionado',
      rangeStart: 'Início do intervalo',
      rangeEnd: 'Fim do intervalo',
      inRange: 'No intervalo',
      outsideMonth: 'Fora do mês',
      disabled: 'Desativado',
    },
  },
};
```

```typescript title="registry.ts" expandable="true" copyButton showLineNumbers
import type { ZardI18nInterface } from '../i18n.types';
import { de_DE } from './de-de';
import { en_US } from './en-us';
import { es_ES } from './es-es';
import { fr_FR } from './fr-fr';
import { it_IT } from './it-it';
import { pt_BR } from './pt-br';
import { pt_PT } from './pt-pt';

export const STANDARD_LOCALES: Record<string, ZardI18nInterface> = {
  'en-US': en_US,
  en: en_US,
  'fr-FR': fr_FR,
  fr: fr_FR,
  'es-ES': es_ES,
  es: es_ES,
  'de-DE': de_DE,
  de: de_DE,
  'it-IT': it_IT,
  it: it_IT,
  'pt-BR': pt_BR,
  'pt-PT': pt_PT,
  pt: pt_BR,
};

export function getPresetLocale(locale: string): ZardI18nInterface | undefined {
  if (!locale) {
    return undefined;
  }
  return (
    STANDARD_LOCALES[locale] ??
    STANDARD_LOCALES[locale.toLowerCase()] ??
    STANDARD_LOCALES[locale.split(/[-_]/)[0].toLowerCase()]
  );
}
```
