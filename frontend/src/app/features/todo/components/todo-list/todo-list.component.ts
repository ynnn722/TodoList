import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Todo } from '../../models/todo.model';
import { TodoItemComponent } from '../todo-item/todo-item.component';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [TodoItemComponent],
  templateUrl: './todo-list.component.html'
})
export class TodoListComponent {
  @Input({ required: true }) items: Todo[] = [];
  @Output() toggle = new EventEmitter<number>();
  @Output() remove = new EventEmitter<number>();
}
