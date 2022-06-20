import { container } from 'tsyringe';
import { filterActionGateway, filterPivotsGateway } from '..';
import { GetAllActionsUseCase } from '../../../useCases/data/Actions/GetAllActions/GetAllActionUseCase';
import { FindAllUseCase } from '../../../useCases/data/Pivots/FindAll/FindAllUseCase';
import { ActionData, IdleData } from '../../protocols';
import GenericQueue from '../../../utils/generic_queue';

const loadActions = async (activeQueue: GenericQueue<ActionData>) => {
  const readPivots = container.resolve(GetAllActionsUseCase);
  const actions = await readPivots.execute();
  const allActions = await filterActionGateway(actions!!);

  for (const action of allActions!!) {
    activeQueue.enqueue({ action, attempts: 1, timestamp: new Date() });
  }
};

const loadPivots = async (idleQueue: GenericQueue<IdleData>) => {
  const getAllPivots = container.resolve(FindAllUseCase);
  const pivots = await getAllPivots.execute();

  const allPivots = await filterPivotsGateway(pivots!!);

  for (const pivot of allPivots) {
    idleQueue.enqueue({
      pivot_id: pivot.pivot_id,
      radio_id: pivot.radio_id,
      attempts: 1
    });
  }
};

export { loadActions, loadPivots };
