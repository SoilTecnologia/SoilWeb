import { IGetByIdBaseRepo, IUpdateBaseRepo } from '@root/database/protocols';
import {
  DatabaseErrorReturn,
  DATABASE_ERROR,
  DataNotFound,
  NotUpdateError,
  ParamsEquals
} from '@root/protocols/errors';
import {
  checkBooleans,
  checkNumbers,
  checkStrings
} from '@root/utils/decorators/check-types';
import { inject, injectable } from 'tsyringe';
import { NodeModel } from '@database/model/Node';
import { IUpdateNodeService } from '@root/useCases/contracts';

@injectable()
class UpdateNodeUseCase implements IUpdateNodeService {
  constructor(
    @inject('GetByIdBase') private getById: IGetByIdBaseRepo<NodeModel>,
    @inject('UpdateBase') private update: IUpdateBaseRepo<NodeModel>
  ) {}

  private checkObjectIsEquals(oldNode: NodeModel, newNode: NodeModel) {
    if (
      oldNode.farm_id === newNode.farm_id &&
      oldNode.node_id === newNode.node_id &&
      oldNode.node_num === newNode.node_num &&
      oldNode.gateway === newNode.gateway &&
      oldNode.is_gprs === newNode.is_gprs
    ) {
      return true;
    } else false;
  }

  @checkStrings(['farm_id', 'node_id'])
  @checkNumbers(['node_num'])
  @checkBooleans(['is_gprs'])
  async execute({
    node: { node_num, node_id, farm_id, is_gprs, gateway }
  }: IUpdateNodeService.Params): IUpdateNodeService.Response {
    const nodeAlreadyExists = await this.getById.get({
      table: 'nodes',
      column: 'node_id',
      id: node_id!!
    });

    if (nodeAlreadyExists === DATABASE_ERROR) throw new DatabaseErrorReturn();
    else if (!nodeAlreadyExists) throw new DataNotFound('Node');

    const nodeModel = new NodeModel();

    Object.assign(nodeModel, { node_num, node_id, farm_id, is_gprs, gateway });

    if (this.checkObjectIsEquals(nodeAlreadyExists, nodeModel)) {
      throw new ParamsEquals();
    }

    const putNode = await this.update.put({
      table: 'nodes',
      column: 'node_id',
      where: node_id!!,
      data: nodeModel
    });

    if (putNode === DATABASE_ERROR) throw new DatabaseErrorReturn();
    else if (!putNode) throw new NotUpdateError('Node');
    else return putNode;
  }
}

export { UpdateNodeUseCase };
