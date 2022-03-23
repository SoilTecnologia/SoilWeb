import { ActionModel } from '../../model/Action';
import { CreateAction } from '../../model/types/action';

interface IActionRepository {
  getNotSucess(): Promise<any[]>;
  create(action: CreateAction): Promise<ActionModel[]>;
  update(action_id: ActionModel['action_id'], success: boolean): Promise<void>;
}

export { IActionRepository };
