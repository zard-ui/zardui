import { appendToArray, locateValue } from '@cli/utils/json-text.js';

const ANGULAR_JSON = `{
  // a comment with a "quote" and a ] bracket
  "projects": {
    "demo": {
      "architect": {
        "build": {
          "options": {
            "polyfills": ["zone.js"],
            "assets": [
              {
                "glob": "**/*",
                "input": "public"
              }
            ],
            "styles": ["src/styles.css"]
          }
        }
      }
    }
  }
}
`;

const KEYS = ['projects', 'demo', 'architect', 'build', 'options', 'assets'];

describe('locateValue', () => {
  it('finds a value by its key path, skipping comments and strings that look like syntax', () => {
    const range = locateValue(ANGULAR_JSON, KEYS);

    expect(range).not.toBeNull();
    expect(ANGULAR_JSON.slice(range!.start, range!.end)).toMatch(/^\[\s*\{\s*"glob": "\*\*\/\*"/);
    expect(ANGULAR_JSON[range!.end - 1]).toBe(']');
  });

  it('returns null for a path that does not exist', () => {
    expect(locateValue(ANGULAR_JSON, ['projects', 'other'])).toBeNull();
    expect(locateValue(ANGULAR_JSON, ['projects', 'demo', 'architect', 'build', 'options', 'scripts'])).toBeNull();
  });

  it('throws on text that is not JSON, so the caller falls back to printing the snippet', () => {
    expect(() => locateValue('{ "a": ', ['a'])).toThrow(SyntaxError);
  });
});

describe('appendToArray', () => {
  const item = { glob: 'a.mjs', input: 'node_modules/x', output: '/' };

  it('appends to an existing array and touches nothing else', () => {
    const updated = appendToArray(ANGULAR_JSON, KEYS, [item])!;

    expect(JSON.parse(updated.replace(/^\s*\/\/.*$/m, '')).projects.demo.architect.build.options.assets).toEqual([
      { glob: '**/*', input: 'public' },
      item,
    ]);
    // The inline arrays and the comment survive: this is a splice, not a re-serialization.
    expect(updated).toContain('"polyfills": ["zone.js"]');
    expect(updated).toContain('// a comment with a "quote" and a ] bracket');
    const range = locateValue(ANGULAR_JSON, KEYS)!;
    expect(updated.startsWith(ANGULAR_JSON.slice(0, range.start + 1))).toBe(true);
    expect(updated.endsWith(ANGULAR_JSON.slice(range.end))).toBe(true);
  });

  it('creates the array when the options object has none', () => {
    const text =
      '{\n  "targets": {\n    "build": {\n      "options": {\n        "outputPath": "dist"\n      }\n    }\n  }\n}\n';
    const updated = appendToArray(text, ['targets', 'build', 'options', 'assets'], [item])!;

    expect(JSON.parse(updated).targets.build.options).toEqual({ outputPath: 'dist', assets: [item] });
  });

  it('fills an empty array', () => {
    const updated = appendToArray('{ "options": { "assets": [] } }', ['options', 'assets'], [item])!;

    expect(JSON.parse(updated).options.assets).toEqual([item]);
  });

  it('returns null when the parent object is missing', () => {
    expect(appendToArray('{ "targets": {} }', ['targets', 'build', 'options', 'assets'], [item])).toBeNull();
  });

  it('keeps CRLF line endings', () => {
    const crlf = ANGULAR_JSON.replace(/\n/g, '\r\n');
    const updated = appendToArray(crlf, KEYS, [item])!;

    expect(updated.replace(/\r\n/g, '')).not.toContain('\n');
  });

  it('writes with the tab indentation the file already uses', () => {
    const tabbed = '{\n\t"options": {\n\t\t"assets": [\n\t\t\t"public"\n\t\t]\n\t}\n}\n';
    const updated = appendToArray(tabbed, ['options', 'assets'], [item])!;

    expect(updated).toContain('\n\t\t\t{\n\t\t\t\t"glob": "a.mjs"');
  });
});
