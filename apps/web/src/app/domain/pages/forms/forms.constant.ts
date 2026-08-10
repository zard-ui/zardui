/**
 * The three ways Angular lets you build a form. Each one gets its own guide page
 * under `/docs/forms/<slug>`; this list drives the index page cards, the sidebar
 * and the prerender route list.
 */
export interface FormApproach {
  /** URL slug under `/docs/forms`. */
  slug: string;
  /** Sidebar / card label. */
  name: string;
  /** Page title. */
  title: string;
  /** Page description, also used for SEO. */
  description: string;
  /** Angular entry point the approach is built on. */
  api: string;
  /** Whether the guide is published. */
  available: boolean;
}

export const FORM_APPROACHES: FormApproach[] = [
  {
    slug: 'signal-forms',
    name: 'Signal Forms',
    title: 'Signal Forms',
    description: 'Build forms in Angular using Signal Forms and zard/ui.',
    api: '@angular/forms/signals',
    available: true,
  },
  {
    slug: 'reactive-forms',
    name: 'Reactive Forms',
    title: 'Reactive Forms',
    description: 'Build forms in Angular using Reactive Forms and zard/ui.',
    api: '@angular/forms',
    available: true,
  },
  {
    slug: 'template-driven-forms',
    name: 'Template-driven Forms',
    title: 'Template-driven Forms',
    description: 'Build forms in Angular using Template-driven Forms and zard/ui.',
    api: '@angular/forms',
    available: true,
  },
];

export const FORMS_BASE_PATH = '/docs/forms';

export function formApproachPath(slug: string): string {
  return `${FORMS_BASE_PATH}/${slug}`;
}
