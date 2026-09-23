export interface RegistryIndex {
  $schema: string;
  /**
   * The shape of the file, not the version of the package (that is `version`).
   * Absent in registries that predate the field, which are v1 by definition.
   */
  schemaVersion?: number;
  name: string;
  homepage: string;
  version: string;
  items: RegistryItem[];
}

/**
 * The icons the component draws, and the family they are written in.
 *
 * `symbols`/`tokens` are the component's own; `demos` are the ones that only
 * appear in the examples. The lists come back empty when there are no icons at
 * all — the field is always present.
 */
export interface RegistryIcons {
  family: string;
  symbols: string[];
  tokens: string[];
  demos?: { symbols: string[]; tokens: string[] };
}

export interface RegistryItem {
  name: string;
  type: string;
  basePath?: string;
  files: string[];
  registryDependencies?: string[];
  dependencies?: string[];
  devDependencies?: string[];
  icons?: RegistryIcons;
}

export interface ComponentFile {
  name: string;
  content: string;
}

/**
 * The complete registry item: what the component installs.
 *
 * Documentation and examples are not here — they come from the page markdown,
 * through `docs.service`. See the note in that file on why they left.
 */
export interface ComponentData {
  name: string;
  type: string;
  files: ComponentFile[];
  registryDependencies?: string[];
  dependencies?: string[];
  devDependencies?: string[];
  icons?: RegistryIcons;
}

export interface BlockMeta {
  id: string;
  title: string;
  description: string;
  category: string;
}

export interface BlockData extends BlockMeta {
  files: {
    name: string;
    path: string;
    content: string;
    language: string;
  }[];
}

export interface BlocksRegistry {
  blocks: BlockMeta[];
}
