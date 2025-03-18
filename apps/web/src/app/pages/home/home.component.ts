import { ZardButtonComponent } from '@zard/components/button/button.component';
import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'z-home',
  standalone: true,
  imports: [RouterModule, ZardButtonComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {}
