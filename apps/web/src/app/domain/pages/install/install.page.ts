import { Installation, installations } from '@zard/shared/constants/install.constant';
import { SidebarComponent } from '@zard/domain/components/sidebar/sidebar.component';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { StepsComponent } from '@zard/domain/components/steps/steps.component';
import { CommonModule, ViewportScroller } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'z-install',
  templateUrl: './install.page.html',
  standalone: true,
  imports: [CommonModule, SidebarComponent, StepsComponent, ZardButtonComponent],
})
export class InstallPage {
  activeTab = signal<'manual' | 'cli'>('manual');
  installGuide!: Installation;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private viewportScroller: ViewportScroller,
  ) {
    this.activatedRoute.params.subscribe(_ => {
      this.loadData();
    });
  }

  private loadData() {
    this.viewportScroller.scrollToPosition([0, 0]);
    const guideName = this.activatedRoute.snapshot.paramMap.get('envName');
    if (!guideName) this.router.navigateByUrl('/');

    const installGuide = installations.find(x => x.environment === guideName);
    if (!installGuide) this.router.navigateByUrl('/');
    else this.installGuide = installGuide;
  }
}
