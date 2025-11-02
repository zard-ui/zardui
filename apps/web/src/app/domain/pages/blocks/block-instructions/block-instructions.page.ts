import { Component, inject, type OnInit } from '@angular/core';

import { DocContentComponent } from '@docs/domain/components/doc-content/doc-content.component';
import { DocHeadingComponent } from '@docs/domain/components/doc-heading/doc-heading.component';
import { NavigationConfig } from '@docs/domain/components/dynamic-anchor/dynamic-anchor.component';
import { MarkdownRendererComponent } from '@docs/domain/components/render/markdown-renderer.component';
import { ScrollSpyItemDirective } from '@docs/domain/directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '@docs/domain/directives/scroll-spy.directive';
import { SeoService } from '@docs/shared/services/seo.service';

interface Category {
  id: string;
  name: string;
  description: string;
}

interface BestPractice {
  title: string;
  description: string;
}

interface Technology {
  name: string;
  description: string;
}

@Component({
  selector: 'z-block-instructions',
  standalone: true,
  imports: [DocContentComponent, DocHeadingComponent, ScrollSpyDirective, ScrollSpyItemDirective, MarkdownRendererComponent],
  templateUrl: './block-instructions.page.html',
})
export class BlocksInstructionPage implements OnInit {
  private readonly seoService = inject(SeoService);
  activeAnchor?: string;

  readonly navigationConfig: NavigationConfig = {
    items: [
      { id: 'overview', label: 'Overview', type: 'core' },
      { id: 'available-blocks', label: 'Available Blocks', type: 'custom' },
      { id: 'block-structure', label: 'Block Structure', type: 'custom' },
      { id: 'adding-block', label: 'Adding New Block', type: 'custom' },
      { id: 'categories', label: 'Categories', type: 'custom' },
      { id: 'best-practices', label: 'Best Practices', type: 'custom' },
      { id: 'testing', label: 'Testing', type: 'custom' },
      { id: 'technologies', label: 'Technologies', type: 'custom' },
    ],
  };

  readonly categories: Category[] = [
    { id: 'featured', name: 'Featured', description: 'Highlighted blocks on the main page' },
    { id: 'dashboard', name: 'Dashboard', description: 'Dashboard and analytics layouts' },
    { id: 'sidebar', name: 'Sidebar', description: 'Sidebar navigation patterns' },
    { id: 'login', name: 'Login', description: 'Login page designs' },
    { id: 'signup', name: 'Signup', description: 'Registration and signup flows' },
    { id: 'otp', name: 'OTP', description: 'OTP verification screens' },
    { id: 'calendar', name: 'Calendar', description: 'Calendar and scheduling interfaces' },
  ];

  readonly bestPractices: BestPractice[] = [
    { title: 'Unique IDs', description: 'Ensure each block has a unique identifier' },
    { title: 'Multiple Categories', description: 'Blocks can appear in multiple categories if relevant' },
    { title: 'Complete Code', description: 'Include all necessary files in the files array' },
    { title: 'Standalone Components', description: 'Always use standalone components with explicit imports' },
    { title: 'Responsive Design', description: 'Ensure blocks work well across all viewport sizes' },
    { title: 'Accessibility', description: 'Follow ARIA guidelines and semantic HTML' },
    { title: 'Documentation', description: 'Provide clear descriptions and use cases' },
    { title: 'Form Validation', description: 'Use ZardUI form components for proper validation and error handling' },
  ];

  readonly technologies: Technology[] = [
    { name: 'Angular', description: 'Component framework' },
    { name: 'TailwindCSS', description: 'Styling and design system' },
    { name: 'ZardUI Components', description: 'Base component library' },
    { name: 'DarkModeService', description: 'Theme management' },
    { name: 'Nx', description: 'Monorepo tooling' },
  ];

  ngOnInit(): void {
    this.seoService.setDocsSeo(
      'Blocks Library',
      'Learn how to create and contribute pre-built, production-ready UI blocks to ZardUI. Complete guide with step-by-step instructions.',
      '/docs/blocks',
      'og-blocks-instructions.jpg',
    );
  }
}
