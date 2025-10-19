import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskListComponent } from '../task-list/task-list.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TaskFormComponent, TaskListComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  @ViewChild(TaskListComponent) taskList!: TaskListComponent;

  currentUser$ = this.authService.currentUser$;

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  canCreateTasks(): boolean {
    const user = this.authService.getCurrentUser();
    return user?.role === 'Owner' || user?.role === 'Admin';
  }

  onTaskCreated(): void {
    // Reload tasks when a new task is created
    if (this.taskList) {
      this.taskList.loadTasks();
    }
  }
}
