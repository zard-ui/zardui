import { Component } from '@angular/core';

import { ZardCommandOptionComponent } from '../command-option.component';
import { ZardCommandComponent } from '../command.component';

@Component({
  standalone: true,
  imports: [ZardCommandComponent, ZardCommandOptionComponent],
  template: `
    <z-command zPlaceholder="Search...">
      <z-command-option zLabel="Home" zValue="home"></z-command-option>
      <z-command-option zLabel="About" zValue="about"></z-command-option>
      <z-command-option zLabel="Contact" zValue="contact"></z-command-option>
      <z-command-option zLabel="Services" zValue="services"></z-command-option>
    </z-command>
  `,
})
export class ZardDemoCommandBasicComponent {}
