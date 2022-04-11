import { container } from 'tsyringe';
import { PivotModel } from '../../database/model/Pivot';
import { GetOneNodeUseCase } from '../../useCases/Nodes/GetOneNode/GetOneNodeUseCase';
import { FindAllUseCase } from '../../useCases/Pivots/FindAll/FindAllUseCase';

class CheckGprs {
  private allPivots: PivotModel[];

  private filterPivotsGateway = async (
    pivots: PivotModel[]
  ): Promise<PivotModel[]> => {
    const getNode = container.resolve(GetOneNodeUseCase);
    const allPivots: PivotModel[] = [];
    for (const pivot of pivots) {
      const node = await getNode.execute(pivot.node_id!!);
      if (node?.node_num !== 0) allPivots.push(pivot);
    }

    return allPivots;
  };

  private loadPivots = async () => {
    const getAllPivots = container.resolve(FindAllUseCase);
    const pivots = await getAllPivots.execute();

    const allPivots = await this.filterPivotsGateway(pivots!!);

    this.allPivots = allPivots;
  };

  async starting(): Promise<PivotModel[]> {
    await this.loadPivots();

    return this.allPivots;
  }
}

export { CheckGprs };
