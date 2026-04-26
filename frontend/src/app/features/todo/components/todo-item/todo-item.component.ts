import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { Todo } from '../../todo.types';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [MatCheckboxModule, MatButtonModule, MatIconModule, DatePipe],
  templateUrl: './todo-item.component.html'
})
export class TodoItemComponent {
  @Input({ required: true }) todo!: Todo;
  @Output() toggle = new EventEmitter<number>();
  @Output() remove = new EventEmitter<number>();

  onToggle(): void {
    this.toggle.emit(this.todo.id);
  }

  onRemove(): void {
    this.remove.emit(this.todo.id);
  }
}
