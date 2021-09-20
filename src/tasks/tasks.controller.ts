/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilteringDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
//to protect the entire route we can use the auth gard like this
@UseGuards(AuthGuard())
export class TasksController {
  //every time we all the logger it needs a context to reference 
  private logger = new Logger('TasksController');
  constructor(
    private tasksService: TasksService
    ) {}

  //this is to add more type safe
  @Get()
  getTasks(
    @Query() filerDto: GetTasksFilteringDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    this.logger.verbose(`User "${user.username}" retrieving all Tasks. Filters: ${JSON.stringify(filerDto)}`);
    //if we have any filters define, call taskService.getTasksWilFilters
    //otherwise, just get all tasks
    return this.tasksService.getTasks(filerDto, user);
  }

  //this will get task by Id
  @Get('/:id')
  getTaskById(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
    return this.tasksService.getTaskById(id, user);
  }

  @Post()
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    //with this decorator we will have the user from the request hadar
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.verbose(`User "${user.username}" retrieving all Tasks. Task: ${JSON.stringify(createTaskDto)}`);
    return this.tasksService.createTask(createTaskDto, user);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string, @GetUser() user: User): Promise<void> {
    return this.tasksService.deleteTask(id, user);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    //with this decorator we will have the user from the request hadar
    @GetUser() user: User,
  ): Promise<Task> {
    const { status } = updateTaskStatusDto;
    return this.tasksService.updateTaskStatus(id, status, user);
  }
}
