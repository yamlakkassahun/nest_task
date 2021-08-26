import { Controller, Get } from '@nestjs/common';
import { Task } from './task.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  //this is to add more type safe
  @Get()
  getAllTasks(): Task[] {
    return this.tasksService.getAllTasks();
  }
}
