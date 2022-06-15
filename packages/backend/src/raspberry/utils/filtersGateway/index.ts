import { container } from 'tsyringe';
import { PivotModel } from '../../../database/model/Pivot';
import { ActionsResult } from '../../../protocols/actionsType';
import { GetOneNodeUseCase } from '../../../useCases/Nodes/GetOneNode/GetOneNodeUseCase';
import { messageErrorTryAction } from '../../../utils/types';

const filterActionGateway = async (actions: ActionsResult[]) => {
  const getNode = container.resolve(GetOneNodeUseCase);
  const allActions: ActionsResult[] = [];
  for (const action of actions) {
    try {
      const node = await getNode.execute(action.node_id!!);
      if (node?.node_num === 0) allActions.push(action);
    } catch (err) {
      messageErrorTryAction(
        err,
        false,
        'filterActionGateway',
        'Filter actions'
      );
    }
  }

  return allActions;
};

const filterPivotsGateway = async (
  pivots: PivotModel[]
): Promise<PivotModel[]> => {
  const getNode = container.resolve(GetOneNodeUseCase);
  const allPivots: PivotModel[] = [];
  for (const pivot of pivots) {
    const node = await getNode.execute(pivot.node_id!!);
    if (node?.node_num === 0) allPivots.push(pivot);
  }

  return allPivots;
};

export {
  filterActionGateway,
  filterPivotsGateway
}