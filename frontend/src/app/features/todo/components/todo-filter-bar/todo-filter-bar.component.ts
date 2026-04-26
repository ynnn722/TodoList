import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { TodoFilter } from '../../todo.types';

@Component({
  selector: 'app-todo-filter-bar',
  standalone: true,
  imports: [MatButtonToggleModule],
  templateUrl: './todo-filter-bar.component.html'
})
export class TodoFilterBarComponent {
  @Input({ required: true }) selected: TodoFilter = 'all';
  @Output() selectedChange = new EventEmitter<TodoFilter>();

  changeFilter(value: string): void {
    this.selectedChange.emit(value as TodoFilter);
  }
}
