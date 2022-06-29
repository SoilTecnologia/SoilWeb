import { inject, injectable } from 'tsyringe';
import { IDeleteBaseRepo, IGetByIdBaseRepo } from '@root/database/protocols';
import {
  DatabaseErrorReturn,
  DATABASE_ERROR,
  DataNotFound
} from '@root/protocols/errors';
import { checkUndefinedNull } from '@root/utils/decorators/check-types';
import { IDeleteNodeService } from '@root/useCases/contracts/nodes/delete';

@injectable()
class DeleteNodeUseCase implements IDeleteNodeService {
  constructor(
    @inject('GetByIdBase') private getById: IGetByIdBaseRepo,
    @inject('DeleteBase') private deleteNode: IDeleteBaseRepo
  ) {}

  @checkUndefinedNull()
  async execute({
    node_id
  }: IDeleteNodeService.Params): IDeleteNodeService.Response {
    const nodeFind = await this.getById.get({
      table: 'nodes',
      column: 'node_id',
      id: node_id
    });

    if (nodeFind === DATABASE_ERROR) throw new DatabaseErrorReturn();
    else if (!nodeFind) throw new DataNotFound('Node');

    const del = await this.deleteNode.del({
      table: 'nodes',
      column: 'node_id',
      data: node_id
    });

    if (del === DATABASE_ERROR) throw new DatabaseErrorReturn();
    else return { status: del ? 'OK' : 'FAIL' };
  }
}

export { DeleteNodeUseCase };
