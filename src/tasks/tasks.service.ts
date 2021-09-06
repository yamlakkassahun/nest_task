import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilteringDto } from './dto/get-tasks-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TasksRepository } from './tasks.repository';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  //in order to use the repository we need to inject it using dependance injection
  constructor(
    @InjectRepository(TasksRepository)
    private taskRepository: TasksRepository,
  ) {}

  // private tasks: Task[] = [];
  // getAllTasks() {
  //   return this.tasks;
  // }
  // getTasksWithFilters(filterDto: GetTasksFilteringDto): Task[] {
  //   const { status, search } = filterDto;
  //   // define a temporary array to hold the result
  //   let tasks = this.getAllTasks();
  //   // do something with status
  //   if (status) {
  //     tasks = tasks.filter((task) => task.status === status);
  //   }
  //   // do something with search
  //   if (search) {
  //     tasks = tasks.filter((task) => {
  //       if (task.title.includes(search) || task.description.includes(search)) {
  //         return true;
  //       }
  //       return false;
  //     });
  //   }
  //   // return final result
  //   return tasks;
  // }

  async getTaskById(id: string): Promise<Task> {
    const task = await this.taskRepository.findOne(id);
    if (!task) {
      // ....we can use the build in not found exception
      throw new NotFoundException(`Task With Id ${id} Not Found`);
    }
    return task;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    //this will distract the dto to title and description
    const { title, description } = createTaskDto;
    const task = this.taskRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });
    await this.taskRepository.save(task);
    return task;
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;
    await this.taskRepository.save(task);
    return task;
  }

  async deleteTask(id: string): Promise<void> {
    const result = await this.taskRepository.delete(id);
    //based on the result we weill handel the error
    if (result.affected === 0) {
      // ....we can use the build in not found exception
      throw new NotFoundException(`Task With Id ${id} Not Found`);
    }
  }
}
