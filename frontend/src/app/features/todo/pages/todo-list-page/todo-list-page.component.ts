import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TodoCreateFormComponent } from '../../components/todo-create-form/todo-create-form.component';
import { TodoFilterBarComponent } from '../../components/todo-filter-bar/todo-filter-bar.component';
import { TodoListComponent } from '../../components/todo-list/todo-list.component';
import { TodoFilter } from '../../todo.types';
import { TodoFacade } from '../../state/todo.facade';

@Component({
  selector: 'app-todo-list-page',
  standalone: true,
  imports: [MatCardModule, MatSnackBarModule, TodoCreateFormComponent, TodoFilterBarComponent, TodoListComponent],
  templateUrl: './todo-list-page.component.html',
  styleUrl: './todo-list-page.component.scss'
})
export class TodoListPageComponent {
  private readonly todoFacade = inject(TodoFacade);

  readonly selectedFilter = this.todoFacade.selectedFilter;
  readonly filteredTodos = this.todoFacade.filteredTodos;
  readonly stats = this.todoFacade.stats;
  readonly loading = this.todoFacade.loading;

  constructor() {
    this.todoFacade.loadTodos();
  }

  createTodo(title: string): void {
    this.todoFacade.createTodo(title);
  }

  toggleTodo(id: number): void {
    this.todoFacade.toggleTodo(id);
  }

  removeTodo(id: number): void {
    this.todoFacade.removeTodo(id);
  }

  setFilter(filter: TodoFilter): void {
    this.todoFacade.setFilter(filter);
  }
}
