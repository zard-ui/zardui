import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Import code tabs functionality
import './app/shared/utils/code-tabs';

bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err));
