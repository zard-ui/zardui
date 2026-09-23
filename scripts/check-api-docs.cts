/**
 * Keeps every component's `doc/api.ts` honest against the component itself.
 *
 * The API tables on the docs site are hand-written, so they drift silently: a new
 * input ships undocumented, a removed one keeps its row, and half the library
 * wrote prop names as `[zType]` while the other half wrote `zType`. This checks
 * all three.
 *
 * Conventions enforced:
 *   - inputs and models are written `[name]`, outputs `(name)`
 *   - every input/model/output declared by a documented selector has a row
 *   - a documented row that names nothing the component declares is reported
 *
 * Method rows (`dismiss(id?)`) and service-option rows are left alone: they
 * document an imperative API, not a binding.
 *
 *   npm run check:api-docs
 */

import * as fs from 'fs';
import * as path from 'path';

const COMPONENTS = path.resolve(__dirname, '../libs/zard/src/lib/shared/components');

/**
 * Members a props table is right not to list, by `<selector>.<member>`.
 *
 * Two kinds only:
 *   - wiring inputs the parent sets, never the consumer
 *   - shadcn-parity aliases that duplicate a `z*` input the table already
 *     documents. Dropdown accepts three names for one concept
 *     (`variant` / `zType` / `zVariant`); settling on one is a public-API
 *     decision, and until it is made the table documents `zType`.
 */
const UNDOCUMENTED_BY_DESIGN = new Set([
  'z-command-option.parentCommand',
  'z-command-option.commandGroup',
  'z-dropdown-menu-item.zVariant',
  'z-dropdown-menu-label.inset',
  'z-dropdown-menu-checkbox-item.disabled',
  'z-dropdown-menu-checkbox-item.variant',
  'z-dropdown-menu-checkbox-item.zVariant',
  'z-dropdown-menu-radio-item.disabled',
  'z-dropdown-menu-radio-item.variant',
  'z-dropdown-menu-radio-item.zVariant',
  'button[z-input-group-button].zVariant',
]);

interface Declared {
  inputs: Set<string>;
  outputs: Set<string>;
}

const problems: string[] = [];
const report = (component: string, message: string) => problems.push(`${component}: ${message}`);

/** Source files of a component, excluding demos, docs and specs. */
function sourceFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of fs.readdirSync(dir)) {
    if (entry === 'demo' || entry === 'doc') continue;
    const absolute = path.join(dir, entry);
    if (fs.statSync(absolute).isDirectory()) files.push(...sourceFiles(absolute));
    else if (entry.endsWith('.ts') && !entry.endsWith('.spec.ts')) files.push(absolute);
  }
  return files;
}

/**
 * What each selector declares.
 *
 * A file can hold several components, so it is split on the decorators first and
 * each chunk is read on its own — otherwise `item.component.ts` would credit all
 * ten of its components with every input in the file.
 */
function declarationsBySelector(dir: string): Map<string, Declared> {
  const bySelector = new Map<string, Declared>();

  for (const file of sourceFiles(dir)) {
    const source = fs.readFileSync(file, 'utf8');

    for (const chunk of source.split(/(?=@Component\(\{|@Directive\(\{)/)) {
      const selectorMatch = chunk.match(/selector: '([^']+)'/);
      if (!selectorMatch) continue;

      const declared: Declared = { inputs: new Set(), outputs: new Set() };
      for (const match of chunk.matchAll(/(?:readonly\s+)?([A-Za-z0-9_]+)\s*=\s*(input|model|output)[.<(]/g)) {
        const [, name, kind] = match;
        (kind === 'output' ? declared.outputs : declared.inputs).add(name);
      }

      for (const selector of selectorMatch[1].split(',').map(value => value.trim())) {
        const existing = bySelector.get(selector);
        if (existing) {
          declared.inputs.forEach(name => existing.inputs.add(name));
          declared.outputs.forEach(name => existing.outputs.add(name));
        } else {
          bySelector.set(selector, declared);
        }
      }
    }
  }

  return bySelector;
}

/**
 * The props a file declares once and reuses, by identifier.
 *
 * `class` is on every component, so a table that repeats the same row a dozen
 * times usually hoists it into a `const`. Read as text, that row is just a bare
 * identifier inside `props`, and without this it looks like nothing at all.
 */
function sharedProps(api: string): Map<string, string> {
  const shared = new Map<string, string>();

  for (const match of api.matchAll(/^const (\w+) = \{[^}]*name: '([^']+)'/gm)) {
    shared.set(match[1], match[2]);
  }

  return shared;
}

/** The `{ selector, props }` pairs of a `doc/api.ts`, read as text. */
function documentedSections(api: string): Array<{ selector: string; props: string[] }> {
  const sections: Array<{ selector: string; props: string[] }> = [];
  const shared = sharedProps(api);

  for (const match of api.matchAll(/selector: '([^']+)',/g)) {
    const propsStart = api.indexOf('props: [', match.index);
    if (propsStart === -1) continue;

    let depth = 0;
    let index = api.indexOf('[', propsStart);
    const open = index;
    for (; index < api.length; index++) {
      if (api[index] === '[') depth++;
      else if (api[index] === ']' && --depth === 0) break;
    }

    const block = api.slice(open, index);
    const props = [...block.matchAll(/name: '([^']+)'/g)].map(prop => prop[1]);

    for (const [identifier, name] of shared) {
      if (new RegExp(`\\b${identifier}\\b`).test(block)) props.push(name);
    }

    sections.push({ selector: match[1], props });
  }

  return sections;
}

for (const component of fs.readdirSync(COMPONENTS).sort()) {
  const dir = path.join(COMPONENTS, component);
  const apiPath = path.join(dir, 'doc', 'api.ts');

  if (!fs.existsSync(apiPath)) {
    report(component, 'has no doc/api.ts');
    continue;
  }

  const declarations = declarationsBySelector(dir);
  const sections = documentedSections(fs.readFileSync(apiPath, 'utf8'));

  for (const section of sections) {
    const declared = declarations.get(section.selector);

    for (const prop of section.props) {
      // Imperative API (`dismiss(id?)`) and service options are documented as prose.
      if (!prop.startsWith('[') && !prop.startsWith('(')) continue;

      const bare = prop.slice(1, -1);
      if (!declared) continue;

      const isInput = declared.inputs.has(bare);
      const isOutput = declared.outputs.has(bare);
      if (!isInput && !isOutput) continue;

      const expected = isOutput ? `(${bare})` : `[${bare}]`;
      if (prop !== expected) {
        report(
          component,
          `${section.selector} documents "${prop}" — ${bare} is ${isOutput ? 'an output' : 'an input'}, so write "${expected}"`,
        );
      }
    }

    if (!declared) continue;

    const documented = new Set(section.props.map(prop => prop.replace(/^[[(]|[\])]$/g, '')));
    for (const name of [...declared.inputs, ...declared.outputs]) {
      if (documented.has(name) || UNDOCUMENTED_BY_DESIGN.has(`${section.selector}.${name}`)) continue;
      report(component, `${section.selector} declares "${name}" but the API table does not list it`);
    }
  }
}

if (problems.length > 0) {
  console.error(`\n✖ the API tables do not match the components — ${problems.length} problem(s):\n`);
  for (const problem of problems) console.error(`  ${problem}`);
  console.error('\nInputs are written [name], outputs (name). See libs/zard/src/lib/shared/components/*/doc/api.ts.\n');
  process.exit(1);
}

console.log('✔ every documented selector matches its component');
