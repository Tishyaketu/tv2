import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { CreateTaskDto, UpdateTaskDto, TaskResponseDto } from '@tdeshpande-922e1a86-9e21-476e-b256-461efeda730d/data';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api';

  private tasksSubject = new BehaviorSubject<TaskResponseDto[]>([]);
  public tasks$ = this.tasksSubject.asObservable();

  getAllTasks(): Observable<TaskResponseDto[]> {
    return this.http.get<TaskResponseDto[]>(`${this.apiUrl}/tasks`).pipe(
      tap(tasks => this.tasksSubject.next(tasks))
    );
  }

  createTask(task: CreateTaskDto): Observable<TaskResponseDto> {
    return this.http.post<TaskResponseDto>(`${this.apiUrl}/tasks`, task).pipe(
      tap(newTask => {
        const currentTasks = this.tasksSubject.value;
        this.tasksSubject.next([...currentTasks, newTask]);
      })
    );
  }

  updateTask(id: string, task: UpdateTaskDto): Observable<TaskResponseDto> {
    return this.http.put<TaskResponseDto>(`${this.apiUrl}/tasks/${id}`, task).pipe(
      tap(updatedTask => {
        const currentTasks = this.tasksSubject.value;
        const index = currentTasks.findIndex(t => t.id === id);
        if (index !== -1) {
          currentTasks[index] = updatedTask;
          this.tasksSubject.next([...currentTasks]);
        }
      })
    );
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/tasks/${id}`).pipe(
      tap(() => {
        const currentTasks = this.tasksSubject.value;
        this.tasksSubject.next(currentTasks.filter(t => t.id !== id));
      })
    );
  }
}
