import { TaskStatus } from '../task.model';

//one of the can be empty
export class GetTasksFilteringDto {
  status?: TaskStatus;
  search?: string;
}
