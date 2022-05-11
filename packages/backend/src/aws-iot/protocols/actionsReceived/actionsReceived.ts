import { ActionModel } from '../../../database/model/Action';
import { FarmModel } from '../../../database/model/Farm';
import { NodeModel } from '../../../database/model/Node';
import { PivotModel } from '../../../database/model/Pivot';

interface ActionReceived {
  farm_id: FarmModel['farm_id'];
  is_gprs: NodeModel['is_gprs'];
  node_num: NodeModel['node_num'];
  payload: {
    action_id: ActionModel['action_id'];
    pivot_id: PivotModel['pivot_id'];
    radio_id: PivotModel['radio_id'];
    author: ActionModel['author'];
    power: ActionModel['power'];
    water: ActionModel['water'];
    direction: ActionModel['direction'];
    percentimeter: ActionModel['percentimeter'];
    timestamp: Date;
  };
  angle?: number;
}

export { ActionReceived };
