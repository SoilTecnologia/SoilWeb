import { container } from 'tsyringe';
import { PivotModel } from '../../../../../database/model/Pivot';
import { GetOneNodeUseCase } from '../../../../../useCases/Nodes/GetOneNode/GetOneNodeUseCase';
import { FindAllUseCase } from '../../../../../useCases/Pivots/FindAll/FindAllUseCase';

const filterPivotsGateway = async (
  pivots: PivotModel[]
): Promise<PivotModel[]> => {
  try {
    const getNode = container.resolve(GetOneNodeUseCase);
    const allPivots: PivotModel[] = [];
    for (const pivot of pivots) {
      const node = await getNode.execute(pivot.node_id!!);
      if (node?.node_num !== 0) allPivots.push(pivot);
    }

    return allPivots;
  } catch (err) {
    console.log(err);
    return [];
  }
};

const loadPivots = async () => {
  const getAllPivots = container.resolve(FindAllUseCase);
  const pivots = await getAllPivots.execute();

  const allPivots = pivots && (await filterPivotsGateway(pivots!!));

  return allPivots;
};

const getPivotsGprs = async () => {
  const allPivots = await loadPivots();

  return allPivots;
};

export { getPivotsGprs };
