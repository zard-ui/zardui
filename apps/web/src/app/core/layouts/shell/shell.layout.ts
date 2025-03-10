import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'z-shell',
  templateUrl: './shell.layout.html',
  styleUrls: ['./shell.layout.scss'],
  standalone: true,
  imports: [RouterModule],
})
export class ShellLayout {
  sidebarOpen = true;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver.observe(['(max-width: 961px)']).subscribe((state: BreakpointState) => {
      this.sidebarOpen = !state.matches;
    });
  }
}
