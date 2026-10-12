/** The documentation navigation shadcn's `sidebar-example` and `sidebar-floating-example` both list. */
export interface SidebarDocsSection {
  readonly title: string;
  readonly url: string;
  readonly items: readonly { readonly title: string; readonly url: string; readonly isActive?: boolean }[];
}

export const SIDEBAR_DOCS_NAV: readonly SidebarDocsSection[] = [
  {
    title: 'Getting Started',
    url: '#',
    items: [
      { title: 'Installation', url: '#' },
      { title: 'Project Structure', url: '#' },
    ],
  },
  {
    title: 'Build Your Application',
    url: '#',
    items: [
      { title: 'Routing', url: '#' },
      { title: 'Data Fetching', url: '#', isActive: true },
      { title: 'Rendering', url: '#' },
      { title: 'Caching', url: '#' },
      { title: 'Styling', url: '#' },
      { title: 'Optimizing', url: '#' },
      { title: 'Configuring', url: '#' },
      { title: 'Testing', url: '#' },
      { title: 'Authentication', url: '#' },
      { title: 'Deploying', url: '#' },
      { title: 'Upgrading', url: '#' },
      { title: 'Examples', url: '#' },
    ],
  },
  {
    title: 'API Reference',
    url: '#',
    items: [
      { title: 'Components', url: '#' },
      { title: 'File Conventions', url: '#' },
      { title: 'Functions', url: '#' },
      { title: 'next.config.js Options', url: '#' },
      { title: 'CLI', url: '#' },
      { title: 'Edge Runtime', url: '#' },
    ],
  },
  {
    title: 'Architecture',
    url: '#',
    items: [
      { title: 'Accessibility', url: '#' },
      { title: 'Fast Refresh', url: '#' },
      { title: 'Next.js Compiler', url: '#' },
      { title: 'Supported Browsers', url: '#' },
      { title: 'Turbopack', url: '#' },
    ],
  },
];
