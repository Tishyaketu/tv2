import { Component, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { TaskCategory, TaskStatus } from '@tdeshpande-922e1a86-9e21-476e-b256-461efeda730d/data';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent {
  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);

  @Output() taskCreated = new EventEmitter<void>();

  taskForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  showForm = false;

  TaskCategory = TaskCategory;
  TaskStatus = TaskStatus;

  constructor() {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      category: [TaskCategory.WORK, Validators.required],
      status: [TaskStatus.PENDING, Validators.required]
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.taskForm.reset({
        category: TaskCategory.WORK,
        status: TaskStatus.PENDING
      });
      this.errorMessage = '';
    }
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = '';

      this.taskService.createTask(this.taskForm.value).subscribe({
        next: () => {
          this.taskForm.reset({
            category: TaskCategory.WORK,
            status: TaskStatus.PENDING
          });
          this.isSubmitting = false;
          this.showForm = false;
          this.taskCreated.emit();
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Failed to create task';
          this.isSubmitting = false;
        }
      });
    }
  }
}
