/*
 * Names people bring from the docs or from other libraries that point at a
 * registry item under a different name.
 *
 * Only unambiguous one-to-one aliases belong here: each one is an install name.
 * An alias can never shadow a real item — `resolveInstallAliases` is told which
 * names the registry really has and leaves those alone.
 */
export const INSTALL_ALIASES: Readonly<Record<string, string>> = {
  /**
   * Toast has a page in the components list but no files of its own: shadcn/ui
   * deprecated it in favour of Sonner, so `add toast` installs `sonner`.
   */
  toast: 'sonner',
};

export interface ResolvedAliases {
  /** The names to install, aliases replaced and duplicates removed, in the order given. */
  names: string[];
  /** Each alias that was replaced, as `[given, installed]`. */
  replaced: Array<[string, string]>;
}

export function resolveInstallAliases(names: readonly string[], registryNames: ReadonlySet<string>): ResolvedAliases {
  const resolved: string[] = [];
  const replaced: Array<[string, string]> = [];

  for (const name of names) {
    const target = !registryNames.has(name) ? INSTALL_ALIASES[name] : undefined;
    if (target) replaced.push([name, target]);

    const final = target ?? name;
    if (!resolved.includes(final)) resolved.push(final);
  }

  return { names: resolved, replaced };
}
