export interface RegistryIndex {
  $schema: string;
  name: string;
  homepage: string;
  version: string;
  items: RegistryItem[];
}

export interface RegistryItem {
  name: string;
  type: string;
  basePath?: string;
  files: string[];
  registryDependencies?: string[];
  dependencies?: string[];
  devDependencies?: string[];
}

export interface ComponentFile {
  name: string;
  content: string;
}

export interface ComponentData {
  name: string;
  type: string;
  files: ComponentFile[];
  registryDependencies?: string[];
  dependencies?: string[];
  devDependencies?: string[];
  docs?: {
    overview: string;
    api: string;
  };
  demos?: ComponentFile[];
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
