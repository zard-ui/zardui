import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationConfig } from '@zard/domain/components/dynamic-anchor/dynamic-anchor.component';
import { DocContentComponent } from '@zard/domain/components/doc-content/doc-content.component';
import { DocHeadingComponent } from '@zard/domain/components/doc-heading/doc-heading.component';
import { StepsComponent } from '@zard/domain/components/steps/steps.component';
import { Installation, installations } from '@zard/shared/constants/install.constant';

@Component({
  selector: 'z-install',
  templateUrl: './install.page.html',
  standalone: true,
  imports: [CommonModule, StepsComponent, DocContentComponent, DocHeadingComponent],
})
export class InstallPage implements OnInit {
  private readonly titleService = inject(Title);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly navigationConfig: NavigationConfig = {
    items: [{ id: 'overview', label: 'Overview', type: 'core' }],
  };
  activeAnchor?: string;

  activeTab = signal<'manual' | 'cli'>('cli');
  installGuide!: Installation;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(() => {
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
      const capitalizedText = environmentName[0].toUpperCase() + environmentName.slice(1);
      const pageTitle = `${capitalizedText} - zard/ui`;
      this.titleService.setTitle(pageTitle);
    }
  }
}
