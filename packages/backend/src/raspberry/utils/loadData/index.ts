import { messageErrorTryAction } from './../../../utils/types';
import { container } from 'tsyringe';
import { filterActionGateway, filterPivotsGateway } from '..';
import { ActionData, IdleData } from '../../protocols';
import GenericQueue from '../../../utils/generic_queue';
import { PivotModel } from '../../../database/model/Pivot';
import { GetPivotByNode } from '../../../useCases/Pivots/GetByNode/GetByIdUseCase';
import { NODE_ID_GATEWAY } from '../../..';
import { GetAllActionByPivot } from '../../../useCases/Actions/GetAllActionByPivotId/GetAllActionUseCase';

export const pivotsThisNode: PivotModel[] = [];

const loadActions = async (activeQueue: GenericQueue<ActionData>) => {
  try {
    const readPivots = container.resolve(GetAllActionByPivot);

    if (pivotsThisNode && pivotsThisNode.length > 0) {
      for (const pivot of pivotsThisNode) {
        const actions = await readPivots.execute(pivot.pivot_id);
        const allActions = await filterActionGateway(actions!!);

        for (const action of allActions!!) {
          activeQueue.enqueue({ action, attempts: 1, timestamp: new Date() });
        }
      }
    }
  } catch (err) {
    messageErrorTryAction(err, false, 'Raspberry', 'Load Actions');
  }
};

const loadPivots = async (idleQueue: GenericQueue<IdleData>) => {
  try {
    const getAllPivots = container.resolve(GetPivotByNode);
    const pivots = await getAllPivots.execute(NODE_ID_GATEWAY);

    if (pivots && pivots.length > 0) {
      const allPivots = await filterPivotsGateway(pivots);

      for (const pivot of allPivots) {
        pivotsThisNode.push(pivot);
        idleQueue.enqueue({
          pivot_id: pivot.pivot_id,
          radio_id: pivot.radio_id,
          attempts: 1
        });
      }
    }
  } catch (err) {
    messageErrorTryAction(err, false, 'Raspberry', 'Load Pivots');
  }
};

export { loadActions, loadPivots };
