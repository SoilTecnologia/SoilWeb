import { ICreateNodeService } from '@root/useCases/contracts/nodes/create';
import { inject, injectable } from 'tsyringe';
import { NodeModel } from '@database/model/Node';
import {
  ICreateBaseRepo,
  IGetByFarmAndNodeNumRepo,
  IGetByIdBaseRepo
} from '@root/database/protocols';
import {
  AlreadyExistsError,
  DatabaseErrorReturn,
  DATABASE_ERROR,
  DataNotFound,
  FailedCreateDataError
} from '@root/protocols/errors';
import {
  checkBooleans,
  checkNumbers,
  checkStrings
} from '@root/utils/decorators/check-types';
import { FarmModel } from '@root/database/model/Farm';

@injectable()
class CreateNodeUseCase implements ICreateNodeService {
  constructor(
    @inject('GetByFarmAndNodeNum') private getNode: IGetByFarmAndNodeNumRepo,
    @inject('GetByIdBase') private getById: IGetByIdBaseRepo,
    @inject('CreateBaseRepo') private createNode: ICreateBaseRepo
  ) {}

  @checkStrings(['farm_id'])
  @checkBooleans(['is_gprs'])
  @checkNumbers(['node_num'])
  async execute(node: ICreateNodeService.Params): ICreateNodeService.Response {
    const { node_num, farm_id, is_gprs, gateway } = node;

    if (!is_gprs && !gateway) {
      throw new Error('Node Type Gateway required a gateway ip');
    } else if (is_gprs && gateway) {
      throw new Error('Node Gprs not accept ip gateway');
    }

    const farm = await this.getById.get<FarmModel>({
      table: 'farms',
      column: 'farm_id',
      id: farm_id
    });

    if (farm === DATABASE_ERROR) throw new DatabaseErrorReturn();
    else if (!farm) throw new DataNotFound('Farm');

    const nodeAlreadyExits = await this.getNode.get({ farm_id, node_num });

    if (nodeAlreadyExits === DATABASE_ERROR) throw new DatabaseErrorReturn();
    else if (nodeAlreadyExits) throw new AlreadyExistsError('Node');
    else {
      const nodeModel = new NodeModel();

      Object.assign(nodeModel, {
        node_num: is_gprs ? node_num : 0,
        farm_id,
        is_gprs,
        gateway: is_gprs ? null : gateway
      });

      const response = await this.createNode.create<
        Omit<NodeModel, 'node_id'>,
        NodeModel
      >({
        table: 'nodes',
        data: nodeModel
      });

      if (response === DATABASE_ERROR) throw new DatabaseErrorReturn();
      else if (!response) throw new FailedCreateDataError('Node');
      else return response;
    }
  }
}

export { CreateNodeUseCase };
