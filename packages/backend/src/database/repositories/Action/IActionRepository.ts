import { ActionModel } from '../../model/Action';
import { CreateAction } from '../../model/types/action';

interface IActionRepository {
  getNotSucess(): Promise<any[]>;
  findById(
    action_id: ActionModel['action_id']
  ): Promise<ActionModel | undefined>;
  create(action: CreateAction): Promise<ActionModel[]>;
  update(action_id: ActionModel['action_id'], success: boolean): Promise<void>;
  delete(action_id: ActionModel['action_id']): Promise<number>;
}

export { IActionRepository };
