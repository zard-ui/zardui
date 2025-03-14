import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';

import { HeaderComponent } from '../../../domain/components/components/header/header.component';
import { FooterComponent } from '../../../domain/components/components/footer/footer.component';

@Component({
  selector: 'z-shell',
  templateUrl: './shell.layout.html',
  styleUrls: ['./shell.layout.scss'],
  standalone: true,
  imports: [RouterModule, HeaderComponent, FooterComponent],
})
export class ShellLayout {}
