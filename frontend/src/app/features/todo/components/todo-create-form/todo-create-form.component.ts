import { Component, EventEmitter, Output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-todo-create-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './todo-create-form.component.html'
})
export class TodoCreateFormComponent {
  @Output() create = new EventEmitter<string>();
  readonly form = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(120)]
    })
  });
  readonly submitting = signal(false);
  get title(): FormControl<string> {
    return this.form.controls.title;
  }
  submit(): void {
    const value = this.title.value.trim();
    if (!value || this.submitting()) return;
    this.submitting.set(true);
    this.create.emit(value);
    this.form.reset({ title: '' });
    this.submitting.set(false);
  }
}