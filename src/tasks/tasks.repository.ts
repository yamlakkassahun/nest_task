import { EntityRepository, Repository } from 'typeorm';
import { Task } from './task.entity';

//the repository will tack the decorator entityRepository and tack entity
@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {}
