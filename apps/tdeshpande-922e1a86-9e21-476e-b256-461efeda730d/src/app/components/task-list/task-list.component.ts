import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';
import { TaskResponseDto, TaskStatus, TaskCategory } from '@tdeshpande-922e1a86-9e21-476e-b256-461efeda730d/data';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  private taskService = inject(TaskService);
  private authService = inject(AuthService);

  tasks: TaskResponseDto[] = [];
  filteredTasks: TaskResponseDto[] = [];
  selectedCategory: string = 'all';
  selectedStatus: string = 'all';
  currentUser: any;

  TaskStatus = TaskStatus;
  TaskCategory = TaskCategory;

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getAllTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
      }
    });
  }

  applyFilters(): void {
    this.filteredTasks = this.tasks.filter(task => {
      const categoryMatch = this.selectedCategory === 'all' || task.category === this.selectedCategory;
      const statusMatch = this.selectedStatus === 'all' || task.status === this.selectedStatus;
      return categoryMatch && statusMatch;
    });

    // Sort by order
    this.filteredTasks.sort((a, b) => a.order - b.order);
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.applyFilters();
  }

  onStatusChange(status: string): void {
    this.selectedStatus = status;
    this.applyFilters();
  }

  drop(event: CdkDragDrop<TaskResponseDto[]>): void {
    if (event.previousIndex !== event.currentIndex) {
      moveItemInArray(this.filteredTasks, event.previousIndex, event.currentIndex);
      
      // Update order for all affected tasks
      this.filteredTasks.forEach((task, index) => {
        if (task.order !== index) {
          this.taskService.updateTask(task.id, { order: index }).subscribe();
        }
      });
    }
  }

  updateTaskStatus(task: TaskResponseDto, newStatus: TaskStatus): void {
    this.taskService.updateTask(task.id, { status: newStatus }).subscribe({
      next: () => {
        this.loadTasks();
      },
      error: (error) => {
        console.error('Error updating task:', error);
      }
    });
  }

  deleteTask(taskId: string): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(taskId).subscribe({
        next: () => {
          this.loadTasks();
        },
        error: (error) => {
          console.error('Error deleting task:', error);
          alert('Failed to delete task. Only Owners can delete tasks.');
        }
      });
    }
  }

  canEdit(): boolean {
    return this.currentUser?.role === 'Owner' || this.currentUser?.role === 'Admin';
  }

  canDelete(): boolean {
    return this.currentUser?.role === 'Owner';
  }

  getStatusColor(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.COMPLETED:
        return 'bg-green-100 text-green-800';
      case TaskStatus.IN_PROGRESS:
        return 'bg-blue-100 text-blue-800';
      case TaskStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getCategoryColor(category: TaskCategory): string {
    return category === TaskCategory.WORK 
      ? 'bg-purple-100 text-purple-800' 
      : 'bg-pink-100 text-pink-800';
  }
}
