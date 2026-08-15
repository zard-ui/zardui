export interface RegistryIndex {
  $schema: string;
  /**
   * A forma do arquivo, não a versão do pacote (que é `version`). Ausente nos
   * registries anteriores ao campo, que por definição são a v1.
   */
  schemaVersion?: number;
  name: string;
  homepage: string;
  version: string;
  items: RegistryItem[];
}

/**
 * Os ícones que o componente desenha e a família em que eles estão escritos.
 *
 * `symbols`/`tokens` são os do componente em si; `demos`, os que só aparecem
 * nos exemplos. As listas vêm vazias quando não há ícone nenhum — o campo está
 * sempre presente.
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
 * O item completo do registry: o que o componente instala.
 *
 * Documentação e exemplos não estão aqui — vêm do `.md` da página, via
 * `docs.service`. Ver a nota naquele arquivo sobre por que saíram daqui.
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
