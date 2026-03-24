import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./features/todo/todo.routes').then((m) => m.TODO_ROUTES)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
