import { Routes } from '@angular/router';

export const FORMS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./forms.page').then(m => m.FormsPage),
  },
  {
    path: 'signal-forms',
    loadComponent: () => import('./signal-forms/signal-forms.page').then(m => m.SignalFormsPage),
  },
  {
    path: 'reactive-forms',
    loadComponent: () => import('./reactive-forms/reactive-forms.page').then(m => m.ReactiveFormsPage),
  },
  {
    path: 'template-driven-forms',
    loadComponent: () =>
      import('./template-driven-forms/template-driven-forms.page').then(m => m.TemplateDrivenFormsPage),
  },
  { path: '**', redirectTo: '' },
];
