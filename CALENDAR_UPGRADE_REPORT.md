# Relatório — Update do componente Calendar (zard/ui)

Alinhamento visual do `Calendar` do zard/ui com o `Calendar` atual do shadcn/ui, conforme `PROMPT.md`.
Branch: `feat/calendar-update`. Apenas commits locais — nenhum push, PR, tag ou release.

> **Segunda passada (revisão visual).** As seções 1–10 descrevem o update original. A
> [seção 11](#11-segunda-passada--o-que-a-revisão-visual-encontrou-e-corrigiu) registra o que a inspeção visual —
> que ficara pendente — encontrou depois, e o que foi feito a respeito.

---

## 1. Tabela "antes → depois" das classes por slot

| Slot                                               | Antes (zard)                                                                                                                                                                                                                                                     | Depois                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **root** (`calendarVariants`)                      | `bg-background p-3 w-fit rounded-lg border`                                                                                                                                                                                                                      | `group/calendar w-fit bg-background p-2` + `[--cell-radius:var(--radius-md)] [--cell-size:--spacing(7)]` + `in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent`                                                                                                                                                                                                                                                                            |
| **month** (`calendarMonthVariants`)                | `flex flex-col w-fit gap-4` — **não usada**                                                                                                                                                                                                                      | `relative flex w-full flex-col gap-4` — usada no template                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **nav** (`calendarNavVariants`)                    | `flex items-center justify-between gap-2 w-fit mb-4`                                                                                                                                                                                                             | `absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1`                                                                                                                                                                                                                                                                                                                                                                                                        |
| **nav button** (`calendarNavButtonVariants`)       | CSS do botão duplicado à mão (`ring-offset-*`, `hover:bg-accent`, `size-7 bg-transparent p-0 opacity-50`)                                                                                                                                                        | `size-(--cell-size) p-0 select-none aria-disabled:opacity-50` — o resto vem do `buttonVariants`, via `<button z-button [zType]="zButtonVariant()">`                                                                                                                                                                                                                                                                                                                              |
| **caption** (`calendarCaptionVariants`)            | — (não existia)                                                                                                                                                                                                                                                  | `flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)`                                                                                                                                                                                                                                                                                                                                                                                                       |
| **dropdowns** (`calendarDropdownsVariants`)        | — (não existia)                                                                                                                                                                                                                                                  | `flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-sm font-medium`                                                                                                                                                                                                                                                                                                                                                                                            |
| **caption label** (`calendarCaptionLabelVariants`) | — (não existia)                                                                                                                                                                                                                                                  | base `font-medium select-none`; `layout: label` → `text-sm`; `layout: dropdown` → `flex items-center gap-1 rounded-(--cell-radius) text-sm [&>svg]:size-3.5 [&>svg]:text-muted-foreground`                                                                                                                                                                                                                                                                                       |
| **dropdown trigger** (`calendarDropdownVariants`)  | — (não existia)                                                                                                                                                                                                                                                  | `w-auto rounded-(--cell-radius)` + `[&_button]:h-(--cell-size) [&_button]:gap-1 [&_button]:rounded-(--cell-radius) [&_button]:px-2 [&_button]:text-sm [&_button]:font-medium [&_button]:shadow-xs` + `[&_button_ng-icon]:size-3.5!`                                                                                                                                                                                                                                              |
| **weekdays** (`calendarWeekdaysVariants`)          | `flex` — **não usada**                                                                                                                                                                                                                                           | `grid w-full grid-cols-7` — usada no grid                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **weekday** (`calendarWeekdayVariants`)            | `text-muted-foreground font-normal text-center text-[0.8rem] w-8`                                                                                                                                                                                                | `flex h-(--cell-size) w-full min-w-(--cell-size) items-center justify-center rounded-(--cell-radius) text-[0.8rem] font-normal text-muted-foreground select-none`                                                                                                                                                                                                                                                                                                                |
| **week** (`calendarWeekVariants`)                  | `flex w-full mt-2` — **não usada**                                                                                                                                                                                                                               | `mt-2 grid w-full grid-cols-7 gap-x-0 gap-y-2` — usada como container das linhas                                                                                                                                                                                                                                                                                                                                                                                                 |
| **day** (`calendarDayVariants`)                    | `p-0 relative focus-within:relative focus-within:z-20 flex mt-1 size-8 text-sm` — sem variantes                                                                                                                                                                  | `group/day relative aspect-square h-full w-full rounded-(--cell-radius) p-0 text-center select-none` + `[&:nth-child(7n+1)]:rounded-s-(--cell-radius) [&:nth-child(7n)]:rounded-e-(--cell-radius)` + variantes de range/today (abaixo)                                                                                                                                                                                                                                           |
| ↳ `today`                                          | (estava no botão) `bg-accent text-accent-foreground`                                                                                                                                                                                                             | `rounded-(--cell-radius) bg-muted text-foreground`                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ↳ `rangeStart`                                     | (estava no botão) `rounded-r-none bg-primary`                                                                                                                                                                                                                    | `relative isolate z-0 rounded-s-(--cell-radius) bg-muted after:absolute after:inset-y-0 after:end-0 after:w-4 after:bg-muted [&:nth-child(7n)]:after:hidden`                                                                                                                                                                                                                                                                                                                     |
| ↳ `rangeMiddle`                                    | (era `inRange`, no botão) `rounded-none bg-accent`                                                                                                                                                                                                               | `rounded-none bg-muted`                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ↳ `rangeEnd`                                       | (estava no botão) `rounded-l-none bg-primary`                                                                                                                                                                                                                    | `relative isolate z-0 rounded-e-(--cell-radius) bg-muted after:absolute after:inset-y-0 after:start-0 after:w-4 after:bg-muted [&:nth-child(7n+1)]:after:hidden`                                                                                                                                                                                                                                                                                                                 |
| **day button** (`calendarDayButtonVariants`) base  | `p-0 font-normal flex items-center justify-center whitespace-nowrap rounded-md ring-offset-background transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-accent hover:text-accent-foreground size-full text-sm` | `relative isolate z-10 flex aspect-square size-auto w-full min-w-(--cell-size) flex-col items-center justify-center gap-1 rounded-(--cell-radius) border border-transparent p-0 text-sm leading-none font-normal transition-colors outline-none hover:bg-muted hover:text-foreground dark:hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&>span]:text-xs [&>span]:opacity-70` |
| ↳ `selected`                                       | `bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground`                                                                                                                               | `bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground`                                                                                                                                                                                                                                                                                                                                                                                              |
| ↳ `rangeStart`                                     | `rounded-r-none bg-primary text-primary-foreground`                                                                                                                                                                                                              | `rounded-(--cell-radius) rounded-s-(--cell-radius) bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground`                                                                                                                                                                                                                                                                                                                                            |
| ↳ `rangeEnd`                                       | `rounded-l-none bg-primary text-primary-foreground`                                                                                                                                                                                                              | `rounded-(--cell-radius) rounded-e-(--cell-radius) bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground`                                                                                                                                                                                                                                                                                                                                            |
| ↳ `rangeMiddle`                                    | (era `inRange`) `rounded-none bg-accent hover:bg-accent`                                                                                                                                                                                                         | `rounded-none bg-muted text-foreground hover:bg-muted hover:text-foreground`                                                                                                                                                                                                                                                                                                                                                                                                     |
| ↳ `outside`                                        | `text-muted-foreground opacity-50`                                                                                                                                                                                                                               | `text-muted-foreground aria-selected:text-muted-foreground` (**sem `opacity-50`**)                                                                                                                                                                                                                                                                                                                                                                                               |
| ↳ `disabled`                                       | `text-muted-foreground opacity-50 cursor-not-allowed`                                                                                                                                                                                                            | inalterado                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ↳ `today`                                          | `bg-accent text-accent-foreground`                                                                                                                                                                                                                               | **removida do botão** — o destaque de hoje passou para o wrapper `gridcell`                                                                                                                                                                                                                                                                                                                                                                                                      |

### Regras transversais aplicadas

- Nenhuma medida hardcoded: `size-8`, `w-8`, `size-7`, `size-3.5!`, `mt-1`, `p-3` sumiram; tudo deriva de `--cell-size` / `--cell-radius`.
- `bg-accent` → `bg-muted` e `text-accent-foreground` → `text-foreground` em `today` e `range-middle`.
- Foco: `focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50`; nenhum `ring-offset-*` restou no componente.
- Utilitários lógicos (`rounded-s-*`, `rounded-e-*`, `after:start-*`, `after:end-*`) no lugar dos físicos (`rounded-l/r`).
- Nenhuma variante CVA exportada ficou sem uso — `calendarMonthVariants`, `calendarWeekdaysVariants` e `calendarWeekVariants`, que eram exports mortos, passaram a ser usadas de verdade.

---

## 2. Arquivos criados / modificados / removidos

### Criados

| Arquivo                                                                 | O quê                                             |
| ----------------------------------------------------------------------- | ------------------------------------------------- |
| `libs/zard/src/lib/shared/components/calendar/demo/preview.ts`          | demo herói (`single` + `dropdown` + borda)        |
| `libs/zard/src/lib/shared/components/calendar/demo/basic.ts`            | calendar mínimo                                   |
| `libs/zard/src/lib/shared/components/calendar/demo/caption.ts`          | seletor de mês/ano                                |
| `libs/zard/src/lib/shared/components/calendar/demo/presets.ts`          | card + rodapé de presets                          |
| `libs/zard/src/lib/shared/components/calendar/demo/with-time.ts`        | card + `z-field`/`z-input-group` + `lucideClock2` |
| `libs/zard/src/lib/shared/components/calendar/demo/custom-cell-size.ts` | `--cell-size` responsivo, modo range              |
| `libs/zard/src/lib/shared/components/calendar/doc/snippets.md`          | snippets de "Custom Cell Size"                    |
| `CALENDAR_UPGRADE_REPORT.md`                                            | este relatório                                    |

### Modificados

| Arquivo                                                                              | O quê                                                                     |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| `.../calendar/calendar.variants.ts`                                                  | reescrito (ver tabela acima)                                              |
| `.../calendar/calendar.types.ts`                                                     | novo tipo `ZardCalendarCaptionLayout`                                     |
| `.../calendar/calendar.component.ts`                                                 | estrutura root → month → nav/grid, 3 inputs novos, `data-slot="calendar"` |
| `.../calendar/calendar-navigation.component.ts`                                      | nav absoluto + caption centralizado com 4 layouts                         |
| `.../calendar/calendar-grid.component.ts`                                            | grid derivado de `--cell-size`, `data-*` de estado, `zShowOutsideDays`    |
| `.../calendar/demo/{range,multiple,with-constraints,expand-year-selection-range}.ts` | padronizados, sem `console.log`, datas relativas ao ano corrente          |
| `.../calendar/demo/calendar.ts`                                                      | registry no padrão `preview` + `examples[]` com `description`             |
| `.../calendar/doc/api.ts`                                                            | inputs novos, `resetNavigation()` e as CSS vars documentados              |
| `.../calendar/*.spec.ts` (3)                                                         | assertivas atualizadas + cobertura nova                                   |
| `.../date-picker/date-picker.component.ts`                                           | sem `class="border-0"`, com `zCaptionLayout="dropdown"`                   |
| `.../popover/popover.component.ts`                                                   | `data-slot="popover-content"` no host                                     |
| `apps/web/src/app/shared/constants/components.constant.ts`                           | `description` do calendar corrigida                                       |
| `packages/cli/src/core/registry/registry-data.ts`                                    | `registryDependencies: ['button', 'select']`                              |
| `packages/highlight/src/generator/usage-data.ts`                                     | snippet de uso com `zMode` e a borda opcional                             |

### Removidos

| Arquivo                                                        | Motivo                                         |
| -------------------------------------------------------------- | ---------------------------------------------- |
| `libs/zard/src/lib/shared/components/calendar/demo/default.ts` | substituído por `preview.ts` + `basic.ts`      |
| `apps/web/src/generated/components/calendar/demo/default.ts`   | órfão limpo automaticamente pelo `demo-writer` |

### Gerados (produzidos pelos comandos, nunca editados à mão)

`apps/web/src/generated/components/calendar/**` (7 demos + `snippets.ts`), `apps/web/src/generated/installation/manual/{calendar,popover}.ts`, `apps/web/public/r/{calendar,date-picker,popover,registry}.json`.

---

## 3. Inputs novos e seus defaults

| Input              | Tipo                                                             | Default   | Efeito                                                                                               |
| ------------------ | ---------------------------------------------------------------- | --------- | ---------------------------------------------------------------------------------------------------- |
| `zCaptionLayout`   | `'label' \| 'dropdown' \| 'dropdown-months' \| 'dropdown-years'` | `'label'` | Como o caption de mês/ano é renderizado                                                              |
| `zButtonVariant`   | `ZardButtonTypeVariants`                                         | `'ghost'` | Variante dos botões de navegação                                                                     |
| `zShowOutsideDays` | `boolean` (`booleanAttribute`)                                   | `true`    | Quando `false`, os dias fora do mês ficam `invisible` — a célula continua no grid, o layout não pula |

Nenhum input, output, método ou `exportAs` existente foi removido ou renomeado. `zMode`, `value`, `minDate`, `maxDate`, `disabled`, `class`, `(dateChange)`, `resetNavigation()`, `zCalendar`, `zCalendarGrid` e `zCalendarNavigation` continuam com a mesma semântica.

### Contrato de CSS vars (novo, público)

| Variável        | Default            | Uso                                                  |
| --------------- | ------------------ | ---------------------------------------------------- |
| `--cell-size`   | `--spacing(7)`     | largura/altura da célula — escala o calendar inteiro |
| `--cell-radius` | `var(--radius-md)` | raio da célula                                       |

Ex.: `<z-calendar class="[--cell-size:--spacing(12)]" />`.

---

## 4. Impacto em consumidores

### `date-picker`

- `class="border-0"` removido — só existia para anular a borda que o calendar não tem mais. O `z-popover` do date-picker já é `p-0`, então o `p-2` próprio do calendar passa a fornecer o respiro (antes era `p-3`, agora 8px em vez de 12px).
- Passa `zCaptionLayout="dropdown"` explicitamente, preservando o comportamento anterior (o date-picker sempre teve selects de mês/ano; o novo default do calendar é `label`).
- `date-picker.component.spec.ts` não precisou de mudança — ele não assertava classes do calendar. Os 8 testes seguem verdes.

### `popover`

- `ZardPopoverComponent` passou a emitir `data-slot="popover-content"` no host, o que faz `in-data-[slot=popover-content]:bg-transparent` funcionar e deixa o calendar transparente dentro do popover. Mudança mínima e coerente com o que o `card` já faz. Todos os testes do popover continuam passando; nenhum deles assertava atributos do host.

### CLI (`registry-data.ts`)

- `files[]` do calendar já estava sincronizado com a pasta (7 arquivos) e continua assim — nenhum `.ts` foi criado ou removido no componente.
- `registryDependencies` passou de `['select']` para `['button', 'select']`. O `button` já era usado por `calendar-navigation.component.ts` antes deste update; a dependência estava faltando no registry.

---

## 5. Escopo opcional

**Nada do escopo opcional foi feito.** Todos os seis itens (`zDisabledDates`, `zShowWeekNumber`, template customizável de dia, `zNumberOfMonths`, `zFixedWeeks`, locale/RTL) exigem mexer em `generateCalendarDays` ou na geração do grid, ou seja, na camada de comportamento — fora do escopo de um update de design e com risco real para a navegação por teclado, que o prompt exige preservar intacta. O escopo obrigatório foi priorizado e entregue por inteiro.

Consequências diretas, todas previstas pelo próprio prompt:

- `range.ts` usa **um** mês (o exemplo do shadcn usa `numberOfMonths={2}`).
- `presets.ts` **não** usa `fixedWeeks`, então o card muda de altura ao trocar de mês entre um mês de 5 e um de 6 linhas.
- Os exemplos `booked-dates` e `week-numbers` não existem.
- `custom-cell-size.ts` não traz preço no rodapé da célula (precisaria do template customizável de dia); demonstra apenas o redimensionamento, que é o ponto do exemplo.

---

## 6. Decisões tomadas sob ambiguidade

1. **`border-0` → `border border-transparent` no botão do dia.** O prompt especifica `border-0` na base e, ao mesmo tempo, `focus-visible:border-ring` — que é inerte com `border-width: 0`. Escolhi `border border-transparent` (o mesmo que `buttonVariants` do repo faz) para que o anel de foco de 3px venha acompanhado da borda, como no resto do design system. `box-sizing: border-box` garante que o 1px não desloca nada.

2. **Weekday com `h-(--cell-size) w-full min-w-(--cell-size)` em vez de `size-(--cell-size)`.** Com `size-*`, um calendar esticado (ex.: `class="w-full"`) manteria o header em `cell-size` enquanto as colunas do corpo cresceriam, desalinhando os dois grids. `w-full` + `min-w-(--cell-size)` produz exatamente o mesmo resultado no caso padrão e continua alinhado quando o calendar é esticado. `size-*` foi mantido nos botões de navegação, onde não há esse risco.

3. **`[&:nth-child(7n)]:after:hidden` no `rangeStart` (e o simétrico no `rangeEnd`).** O `after:w-4` do shadcn existe para emendar o trilho entre células. Na última coluna da semana não há vizinho para emendar, e o pseudo-elemento vazaria 16px para fora do grid. Esconder o `after` só nas pontas mantém a paridade visual e elimina o vazamento.

4. **`today` deixou de ter variante no botão.** No shadcn o destaque de "hoje" vive no `<td>`; replicar isso no botão duplicaria o fundo. Em compensação, adicionei um `compoundVariant` no wrapper: quando o dia é **hoje e selecionado fora de um range**, o wrapper vira `bg-transparent` e só o botão `bg-primary` aparece. Sem isso, um "hoje selecionado" mostraria cantos cinza do wrapper por trás do botão arredondado — comportamento que o shadcn tem hoje e que considerei um artefato, não uma intenção de design.

5. **`data-*` emitidos apenas quando verdadeiros.** `data-selected="true"` / atributo ausente, em vez de `"true"`/`"false"`, seguindo o react-day-picker. É o que faz os seletores `data-[selected=true]:` funcionarem e mantém o DOM limpo.

6. **Composição com `buttonVariants` via componente, não via concatenação.** O prompt sugere `buttonVariants({ zType }) + 'size-(--cell-size) …'`. Como as setas já são `<button z-button>`, e o `ZardButtonComponent` faz `mergeClasses(buttonVariants({...}), this.class())` internamente, passar as classes extras pelo `class` produz exatamente o mesmo resultado sem duplicar a chamada. `calendarNavButtonVariants` ficou só com o delta.

7. **`z-select` do caption recebe `[zDisabled]="disabled()"`.** Antes não recebia, então um calendar desabilitado ainda permitia abrir os dropdowns de mês/ano. Está alinhado com `isPreviousDisabled`/`isNextDisabled`, que já consideravam `disabled()`.

8. **Ícone das setas com `class="size-4!"`, não `size-4`.** O `@ng-icons/core` define `:host { width/height: var(--ng-icon__size, 1em) }` em estilos de componente **fora** de `@layer`, e as utilities do Tailwind v4 ficam em `@layer utilities` — ou seja, o CSS do ng-icon vence. O `!` é necessário e é o padrão já usado em todo o repo (`select`, `date-picker`, etc.).

9. **`fullWidth: true` removido do registry do calendar.** O campo não é consumido em lugar nenhum da página de componente (`fullWidth` só é lido pelo `z-code-box` via um input que a página não passa). Era configuração morta.

10. **Gerados não relacionados revertidos.** `npm run generate:highlight` também reescreveu `apps/web/src/generated/{components/table,documentation/theming,pages/theming}/**`, porque esses artefatos estão desatualizados em relação às suas fontes desde antes deste trabalho. Revertidos para manter o diff focado no calendar — ver "Bugs não relacionados" abaixo.

---

## 7. Saída dos comandos de verificação

| Comando                                           | Resultado                                                            |
| ------------------------------------------------- | -------------------------------------------------------------------- |
| `npx nx test zard` (baseline, antes)              | ✅ 77 suites, 1118 testes                                            |
| `npx nx test zard` (depois)                       | ✅ 77 suites, **1141** testes (23 novos), 0 falhas                   |
| `npx nx build zard`                               | ✅ `Successfully ran target build for project zard`                  |
| `npx nx run web:build --configuration=production` | ✅ bundle completo, **79 rotas prerenderizadas** — os demos compilam |
| `npm run generate:highlight`                      | ✅ 12 demo files, 2 installation files, 1 snippet file               |
| `npm run build:registry`                          | ✅ 50 componentes, 0 falhas                                          |
| `npx nx lint zard`                                | ⚠️ ver abaixo                                                        |

### Sobre o lint

`npx nx lint zard` **falha neste ambiente, e já falhava antes de qualquer alteração**: o clone está com `core.autocrlf=true` e sem `.gitattributes`, então todo arquivo do working tree tem CRLF, e a regra `prettier/prettier` reporta `Delete \`␍\`` em cada linha de cada arquivo — 52.779 erros na baseline, nenhum deles relacionado a código. No CI (Linux, LF) isso não ocorre.

Para verificar de fato o código, rodei o ESLint com saída JSON filtrando exclusivamente as mensagens `Delete \`␍\``/`Insert \`␍\``da regra`prettier/prettier`:

- **Baseline:** 2 warnings — `@typescript-eslint/no-explicit-any` em `calendar-navigation.component.spec.ts:34` e `:55`.
- **Depois:** **0 problemas** nos arquivos do calendar, date-picker, popover e nos três registros. Os dois `any` foram eliminados na reescrita do spec. Restam 2 warnings idênticos em `popover.component.spec.ts`, arquivo que não foi tocado.

Todos os arquivos modificados passaram por `prettier --write`, e o hook `pre-commit` (lint-staged → `eslint --fix` + `prettier --write`) rodou em cada commit sem `--no-verify`.

### Verificação visual

O dev server (`npx nx run web:serve --configuration=local`) subiu normalmente em `http://localhost:4222` e foi encerrado ao final. **A inspeção visual em browser não foi possível neste ambiente**: a extensão Claude-in-Chrome está desconectada e o `chrome-devtools` MCP não conecta por haver uma instância órfã segurando o perfil (`The browser is already running for …/chrome-profile`). Não encerrei processos do Chrome por conta própria.

Como o risco técnico concreto de um redesign feito com utilities arbitrárias é o Tailwind **não gerar** a classe, verifiquei isso diretamente no bundle CSS de produção (`dist/apps/web/browser/styles-*.css`, 211 KB):

| Utility                                         | Regra gerada                                                                                |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `size-(--cell-size)`                            | `width:var(--cell-size);height:var(--cell-size)`                                            |
| `h-(--cell-size)`                               | `height:var(--cell-size)`                                                                   |
| `min-w-(--cell-size)`                           | `min-width:var(--cell-size)`                                                                |
| `px-(--cell-size)`                              | `padding-inline:var(--cell-size)`                                                           |
| `rounded-(--cell-radius)`                       | `border-radius:var(--cell-radius)`                                                          |
| `[&:nth-child(7n+1)]:rounded-s-(--cell-radius)` | `…:nth-child(7n+1){border-start-start-radius:var(--cell-radius);border-end-start-radius:…}` |
| `[&:nth-child(7n)]:after:hidden`                | `…:nth-child(7n):after{content:var(--tw-content);display:none}`                             |
| `in-data-[slot=popover-content]:bg-transparent` | `…[data-slot=popover-content]) .in-data-…\:bg-transparent{background-color:#0000}`          |

Também conferi a ordem de cascata que sustenta o trilho de range (índices no bundle): `.rounded-(--cell-radius)` (37299) → `.rounded-none` (37952) → `.rounded-s-(--cell-radius)` (38128) / `.rounded-e-(--cell-radius)` (38245) → regras `:nth-child(7n±)` (188287, e com especificidade maior). Ou seja: `rounded-none` do range-middle zera o raio base, os lados lógicos do range-start/end vencem depois, e o arredondamento das pontas de semana vence por último — exatamente o comportamento pretendido.

Os estados visuais em si (hoje, selecionado, hoje+selecionado, range de um dia, fora do mês, desabilitado, `data-*`) estão cobertos por testes de unidade que verificam as classes resultantes em cada combinação. **Ainda assim, uma passada de olho em light e dark na página `/components/calendar` e `/components/date-picker` continua pendente e é recomendada antes do merge.**

---

## 8. Riscos de regressão visual

1. **A borda deixou de ser default** — este é o breaking visual relevante. Quem já usa `<z-calendar />` solto vai vê-lo sem `rounded-lg border`. A correção é de uma linha: `<z-calendar class="rounded-lg border" />`. Todos os demos e o snippet de "Usage" já mostram essa forma.

2. **Padding do root: `p-3` → `p-2`.** O calendar ficou 8px mais estreito e mais baixo. Dentro do popover do date-picker isso é visível (o popover é `p-0`, então o padding vinha inteiro do calendar).

3. **Célula: `size-8` (32px) → `--spacing(7)` (28px).** O calendar inteiro encolheu ~12%. Quem dependia da largura anterior pode restaurá-la com `class="[--cell-size:--spacing(8)]"`.

4. **Caption default mudou de dois selects para um label.** Qualquer consumidor que dependia dos dropdowns precisa passar `zCaptionLayout="dropdown"` — o date-picker já foi ajustado.

5. **Dias fora do mês perderam `opacity-50`.** Ficam apenas `text-muted-foreground`, portanto mais legíveis (e menos distinguíveis dos dias do mês) do que antes. É o comportamento do shadcn.

6. **Setas de navegação agora desabilitam de verdade.** `[disabled]` estava sendo sobrescrito pelo host binding `[attr.disabled]` do `ZardButtonComponent`, então `minDate`/`maxDate` nunca desabilitavam as setas na prática. Passaram a usar `[zDisabled]`. Quem contava com o comportamento anterior (setas sempre clicáveis) verá a diferença — mas o anterior era o bug.

7. **Ordem de tabulação do header.** Com o `nav` absoluto contendo os dois botões, a ordem passou de `prev → mês → ano → next` para `prev → next → mês → ano`. É a estrutura do shadcn; a navegação por teclado do grid não foi tocada.

8. **`zShowOutsideDays=false` e o foco.** Os dias escondidos usam `invisible`, que os torna não focáveis. O roving tabindex continua contando esses índices (a lógica de foco não podia ser alterada por escopo), então, com a opção ligada, a navegação por setas pode passar por uma célula invisível. É o mesmo comportamento do shadcn/react-day-picker, mas vale como ponto de atenção se a opção for muito usada.

---

## 9. Bugs não relacionados encontrados (não corrigidos)

Conforme a regra de decisão, apenas anotados:

1. **Artefatos gerados desatualizados no repo.** `npm run generate:highlight` reescreve `apps/web/src/generated/components/table/demo/{simple,actions}.ts` (o fonte do table mudou de `'../table.imports'` para `'@/shared/components/table/table.imports'` sem regerar) e todo `apps/web/src/generated/{documentation,pages}/theming/**` (os arquivos commitados estão formatados com aspas simples; o gerador emite JSON com aspas duplas). Nada disso tem a ver com o calendar; revertidos para não poluir o diff.

2. **`calendar.component.spec.ts` importa `type CalendarDay` de `./calendar.component`**, que não exporta esse tipo. Passa apenas porque o `@swc/jest` faz transpile-only, sem type-check. Mantido como estava para não misturar escopos.

3. **O `build:registry` embute o line ending do working tree nos JSONs.** Com `core.autocrlf=true`, os 50 arquivos de `apps/web/public/r/` saem com `\r\n` escapado, divergindo do que o CI produz. Normalizei os `\r\n` → `\n` na saída antes de commitar, o que deixou o diff restrito exatamente aos 4 arquivos que mudaram de verdade (`calendar`, `date-picker`, `popover`, `registry`). Um `.gitattributes` com `* text=auto eol=lf` resolveria isso de forma permanente — fora do escopo.

---

## 10. Checklist de aceite

**Design**

- [x] Root usa `p-2`, `w-fit`, sem borda, com `--cell-size` e `--cell-radius` declarados
- [x] Nenhuma medida hardcoded (`size-8`, `w-8`, `size-7` sumiram)
- [x] `class="[--cell-size:--spacing(12)]"` redimensiona o calendar inteiro (coberto por teste)
- [x] Header: setas nas bordas (nav absoluto), caption centralizado, altura de uma célula
- [x] Espaço vertical entre semanas = `gap-y-2`; `gap-x-0`
- [x] `today` = `bg-muted text-foreground`; `range-middle` = `bg-muted text-foreground`
- [x] Range: trilho contínuo, pontas arredondadas, `bg-primary` nas extremidades, quebra entre semanas
- [x] Range de um dia só = dia selecionado normal, com raio completo
- [x] Fora do mês sem `opacity-50`; desabilitado com `opacity-50`
- [x] Foco = `border-ring ring-3 ring-ring/50`, sem `ring-offset`
- [x] Utilitários lógicos no lugar dos físicos
- [x] Fundo transparente dentro de `z-card` e do popover (classes verificadas no bundle CSS)
- [x] Sem variant CVA exportada e não utilizada
- [ ] **Light e dark conferidos visualmente** — não foi possível (ver §7)

**Funcional**

- [x] Nenhum input/output/método público removido ou renomeado
- [x] Navegação por teclado preservada (`onKeyDown`, `navigate`, `findEnabledInRange`, `setFocus`, `getFocusedDayIndex`, `setFocusedDayIndex`, `resetFocus` intactos)
- [x] `zCaptionLayout` funciona nos 4 valores
- [x] `zShowOutsideDays=false` esconde os dias externos sem quebrar o grid
- [x] `zButtonVariant` altera as setas
- [x] Date-picker idêntico em comportamento (com `zCaptionLayout="dropdown"`)

**Docs**

- [x] `demo/calendar.ts` usa `preview` + `examples[]` com `description`
- [x] Todos os demos da tabela da Fase 4 existem, estão registrados e compilam
- [x] `demo/default.ts` removido e o gerado órfão limpo
- [x] Zero `console.log` nos demos
- [x] `doc/api.ts` cobre 100% dos inputs, com defaults corretos
- [x] `doc/snippets.md` criado e usado por `custom-cell-size`
- [x] `description` corrigida em `components.constant.ts` e em `demo/calendar.ts`
- [x] `registry-data.ts` sincronizado
- [x] `usage-data.ts` revisado

**Build**

- [x] `npx nx test zard` ✅ (1141 testes)
- [x] `npx nx build zard` ✅
- [x] `npx nx run web:build --configuration=production` ✅
- [~] `npx nx lint zard` — falha só por CRLF do ambiente, igual à baseline; 0 problemas reais (ver §7)
- [x] `npm run generate:highlight` rodado e resultado commitado
- [x] `npm run build:registry` rodado e resultado commitado
- [x] Nenhum arquivo gerado editado à mão
- [x] Commits locais no padrão emoji+conventional; **nenhum push**
- [x] `CALENDAR_UPGRADE_REPORT.md` escrito

---

## 11. Segunda passada — o que a revisão visual encontrou (e corrigiu)

A inspeção em browser, listada como pendente na §7, foi feita depois com o dev server em
`http://localhost:4200/docs/components/calendar`, em light e dark. Três defeitos apareceram, além de duas lacunas de
conteúdo.

### 11.1 Idioma do header seguia o locale do navegador

`calendar-navigation.component.ts` montava o nome do mês com `toLocaleString(undefined, { month: 'long' })`, ou seja,
o locale do navegador. Num navegador `pt-BR` o caption saía **"agosto 2026"** — em português e minúsculo — ao lado dos
weekdays (`Su Mo Tu …`) e dos dropdowns (`Jan`, `Feb`, …), que são arrays hardcoded em inglês. O calendar exibia duas
línguas ao mesmo tempo.

**Por que os testes não pegaram:** o jsdom roda em `en-US`, então `toLocaleString` devolvia "August" e a assertiva
`getByText('January 2024')` passava. O defeito só existia fora do ambiente de teste.

**Correção:** novo `calendarMonthsLong` em `calendar.utils.ts`, ao lado de `calendarMonths` e `calendarWeekdays`, e o
caption passou a lê-lo. Pelo mesmo motivo, o `data-day` do botão de dia fixou `'en-US'` (o `aria-label` já fixava).
Agora todas as strings do componente vêm da mesma fonte. Um teste novo cobre o caption independentemente do locale.

> **Consequência assumida:** o calendar é monolíngue em inglês, como o resto do design system. Localização de verdade
> (input de `locale`) continua no escopo opcional — a diferença é que antes ela estava meio implementada e
> inconsistente, e agora está coerentemente ausente.

### 11.2 Data em formato local no demo `with-constraints`

O demo imprimia `Available dates: {{ minDate.toLocaleDateString() }} …`, que num navegador `pt-BR` virava
`13/08/2026 - 12/09/2026` dentro de uma frase em inglês. O parágrafo foi removido junto com a reforma do demo (11.4).

### 11.3 `preview` e `caption` eram o mesmo exemplo

Ambos os demos eram `zMode="single" zCaptionLayout="dropdown" class="rounded-lg border"`. O exemplo "Caption" não
mostrava nada que o herói do topo já não mostrasse. `demo/caption.ts` foi removido; o herói continua sendo a vitrine
do `zCaptionLayout="dropdown"` e o `basic` mostra o default `label` — agora visualmente distintos.

### 11.4 Demos exclusivos do zard fora do padrão da página

`with-constraints` e `expand-year-selection-range` traziam `<h3>` e parágrafos que nenhum outro exemplo do repo usa, e
`range` exibia um card "From/To" que não existe no shadcn. Os três foram reduzidos ao calendar em si; a explicação
passou para o campo `description` do registry, que é onde a página já renderiza texto.

### 11.5 Exemplos que faltavam da página do shadcn

Dois itens do escopo opcional foram implementados para fechar as duas lacunas mais visíveis:

| Input novo        | Tipo     | Default | O que habilita                                                                                                                                                                                                                               |
| ----------------- | -------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `zDisabledDates`  | `Date[]` | `[]`    | Dias bloqueados individualmente, além do intervalo `minDate`/`maxDate`. Cada um mantém a célula no grid e recebe `data-disabled="true"` — o demo `booked-dates` usa esse seletor para riscá-los, como o shadcn faz com `modifiersClassNames` |
| `zNumberOfMonths` | `number` | `1`     | N meses lado a lado (`months: relative flex flex-col gap-4 md:flex-row`). O demo `range` passou a mostrar dois meses, como o exemplo do shadcn                                                                                               |

Detalhes de implementação:

- `generateCalendarDays` ganhou `disabledDates` opcional; `isDateDisabled` compara por dia, ignorando a hora.
- Cada mês renderiza seu próprio `z-calendar-navigation` + `z-calendar-grid`. Só o primeiro mês carrega a seta
  "previous" e só o último a "next" (`zShowPreviousButton` / `zShowNextButton`); o lado escondido vira um spacer
  `size-(--cell-size)` com `aria-hidden`, para o caption continuar centralizado.
- `getDayId` recebeu um `monthIndex` opcional, então os ids dos dias continuam únicos no documento com vários grids.
  Com um mês só, o id continua sendo exatamente `calendar-day-N`.
- Os dropdowns de um mês posterior reposicionam a navegação: escolher "Maio" no segundo caption puxa o primeiro mês
  para abril (`rebaseNavigation`).
- O foco roving continua vivendo no primeiro grid; `onKeyDown`, `navigate`, `findEnabledInRange`, `setFocus`,
  `getFocusedDayIndex`, `setFocusedDayIndex` e `resetFocus` não foram tocados.

**Continuam de fora do escopo opcional:** `zShowWeekNumber` (exemplo "Week Numbers"), template customizável de dia,
`zFixedWeeks` e locale/RTL (exemplo "RTL").

### 11.6 Conjunto final de exemplos

| Exemplo                       | Equivalente na página do shadcn |
| ----------------------------- | ------------------------------- |
| `preview` (herói)             | Demo                            |
| `basic`                       | Basic                           |
| `range` (2 meses)             | Range Calendar                  |
| `multiple`                    | — (exclusivo do zard)           |
| `presets`                     | Presets                         |
| `with-time`                   | Date and Time Picker            |
| `booked-dates`                | Booked dates                    |
| `custom-cell-size`            | Custom Cell Size                |
| `with-constraints`            | — (exclusivo do zard)           |
| `expand-year-selection-range` | — (exclusivo do zard)           |

Sem equivalente no zard: **Week Numbers** e **RTL**.

### 11.7 Verificação da segunda passada

| Comando                               | Resultado                                                                                                                                                                            |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `npx nx test zard`                    | ✅ 77 suites, **1152** testes (11 novos), 0 falhas                                                                                                                                   |
| `npx nx build zard`                   | ✅ `Successfully ran target build for project zard`                                                                                                                                  |
| `npx eslint` nos arquivos do calendar | ✅ 0 problemas (filtrando o ruído de CRLF descrito na §7)                                                                                                                            |
| `npm run generate:highlight`          | ✅ 5 demos + 1 installation; `caption.ts` gerado removido, `booked-dates.ts` criado                                                                                                  |
| `npm run build:registry`              | ✅ 50 componentes; após normalizar CRLF, só `calendar.json` mudou                                                                                                                    |
| Inspeção visual em light e dark       | ✅ feita — herói, basic, range (2 meses), multiple, presets, with-time, booked-dates, custom-cell-size, with-constraints, expand-year, e o calendar dentro do popover do date-picker |

Com isso, o único item aberto da checklist da §10 (_"Light e dark conferidos visualmente"_) está fechado.

---

## 12. Terceira passada — borda dupla e saída do `z-select`

### 12.1 A borda era desenhada duas vezes

`<z-calendar class="rounded-lg border" />` produzia **duas bordas de 1px**: o atributo `class` estático fica no host
`<z-calendar>` (comportamento normal do DOM) e o mesmo valor era lido pelo `input class` e reaplicado ao
`div[data-slot="calendar"]` interno. No `basic` as duas larguras coincidiam e o resultado era uma linha grossa; no
`with-constraints`, onde o host esticava com o container flex, a borda externa aparecia claramente maior que o grid.

**Correção:** o host virou o root, como no shadcn — cujo componente `Root` é o próprio `div[data-slot="calendar"]`.
O wrapper interno deixou de existir:

```
antes:  <z-calendar class="…">        ← borda do atributo estático
          <div data-slot="calendar" class="…">   ← borda de novo, via input class
            <div class="months">…

depois: <z-calendar data-slot="calendar" class="…">   ← um elemento só
          <div class="months">…
```

`calendarVariants` ganhou `block` porque um custom element é `display: inline` por padrão, e sem isso `w-fit`, `p-2` e
a borda não se comportam como no `div` do shadcn. Um teste garante que não existe mais nenhum `[data-slot="calendar"]`
descendente do host.

### 12.2 O caption abandonou o `z-select`

Os dropdowns de mês e ano usavam `<z-select>`, um componente com overlay CDK próprio. O shadcn usa um `<select>`
**nativo** invisível (`absolute inset-0 opacity-0`) sobreposto ao label visível — o browser fornece o popup, o
`<span>` fornece o visual. A estrutura passou a ser a mesma:

```html
<div data-slot="calendar-dropdown-root">
  <!-- relative, borda, sombra, has-[:focus-visible]:ring -->
  <select class="bg-popover absolute inset-0 z-10 cursor-pointer opacity-0">
    …
  </select>
  <span aria-hidden="true">
    Aug
    <ng-icon name="lucideChevronDown" />
  </span>
</div>
```

Consequências:

- `registryDependencies` do calendar caiu de `['button', 'select']` para `['button']` — quem instala o calendar pelo
  CLI não leva mais o `select` junto.
- `calendarDropdownVariants` deixou de estilizar o trigger de outro componente por fora e passou a descrever o próprio
  select; entrou `calendarDropdownRootVariants` para o wrapper.
- O `<select>` é o controle acessível (com `aria-label="Choose the month"` / `"Choose the year"`), o `<span>` é
  decorativo. Em telas pequenas o usuário ganha o seletor nativo do sistema.
- `monthChange` / `yearChange` agora emitem a partir do evento `change` do select. Como o `z-select` era a única fonte
  capaz de emitir array, as guardas `Array.isArray` de `onMonthChange` / `onYearChange` viraram código morto e saíram.

### 12.3 Um falso positivo que vale registrar

Durante a verificação, o calendar dentro do popover do date-picker apareceu no browser sem `data-slot` e sem classes,
com as células colapsadas. **Não era um defeito do código:** o dev server estava servindo um bundle incremental
defasado — o template novo já tinha sido aplicado, mas os metadados de host do componente, não. Um teste novo no
`date-picker.component.spec.ts` abre o popover e verifica `data-slot="calendar"`, `[--cell-size:--spacing(7)]`, `p-2`
e os dois `<select>`; ele passa. O sintoma sumiu depois de derrubar o processo do dev server (que sobrevivera a um
`Ctrl+C`, mantendo a porta 4200) e subir um novo.

### 12.4 Verificação da terceira passada

| Comando                                                 | Resultado                                                                                                                           |
| ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `npx nx test zard`                                      | ✅ 77 suites, **1157** testes, 0 falhas                                                                                             |
| `npx nx build zard`                                     | ✅                                                                                                                                  |
| `npx eslint` nos arquivos tocados                       | ✅ 0 problemas reais                                                                                                                |
| `npm run generate:highlight` + `npm run build:registry` | ✅ diff restrito a `calendar.json` e `registry.json` (perda da dep `select`)                                                        |
| Inspeção visual                                         | ✅ uma borda só no `basic`, `with-constraints` e demais; caption nativo funcionando; calendar transparente dentro de card e popover |
