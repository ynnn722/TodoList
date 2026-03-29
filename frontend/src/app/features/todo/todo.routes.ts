import { Routes } from '@angular/router';
import { TodoListPageComponent } from './pages/todo-list-page/todo-list-page.component';

export const TODO_ROUTES: Routes = [
  {
    path: '',
    component: TodoListPageComponent
  }
];
