import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import { DocContentComponent } from '@doc/domain/components/doc-content/doc-content.component';
import { DocHeadingComponent } from '@doc/domain/components/doc-heading/doc-heading.component';
import { NavigationConfig } from '@doc/domain/components/dynamic-anchor/dynamic-anchor.component';
import { StepsComponent } from '@doc/domain/components/steps/steps.component';
import { Installation, installations } from '@doc/shared/constants/install.constant';
import { SeoService } from '@doc/shared/services/seo.service';

@Component({
  selector: 'z-install',
  templateUrl: './install.page.html',
  standalone: true,
  imports: [StepsComponent, DocContentComponent, DocHeadingComponent],
})
export class InstallPage implements OnInit {
  private readonly seoService = inject(SeoService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly navigationConfig: NavigationConfig = {
    items: [{ id: 'overview', label: 'Overview', type: 'core' }],
  };

  activeAnchor!: string;

  activeTab = signal<'manual' | 'cli'>('cli');
  installGuide!: Installation;

  ngOnInit(): void {
    this.activatedRoute.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.loadData();
    });
  }

  private loadData() {
    const guideName = this.activatedRoute.snapshot.paramMap.get('envName');
    if (!guideName) this.router.navigateByUrl('/');

    const installGuide = installations.find(x => x.environment === guideName);
    if (!installGuide) this.router.navigateByUrl('/');
    else this.installGuide = installGuide;

    this.setPageTitle();
  }

  setPageTitle() {
    const environmentName = this.installGuide?.title;
    if (environmentName) {
      this.seoService.setDocsSeo(
        `${environmentName}`,
        `Learn how to install and set up Zard UI in your ${environmentName} project. Step-by-step guide with CLI and manual installation options.`,
        `/docs/installation/${this.installGuide.environment}`,
        `og-${environmentName.toLocaleLowerCase()}.jpg`,
      );
    }
  }
}
