import { IGetByIdBaseRepo } from '@root/database/protocols';
import {
  DatabaseErrorReturn,
  DATABASE_ERROR,
  DataNotFound
} from '@root/protocols/errors';
import { IGetOneNodeService } from '@root/useCases/contracts/nodes/get-one';
import { checkUndefinedNull } from '@root/utils/decorators/check-types';
import { inject, injectable } from 'tsyringe';

@injectable()
class GetOneNodeUseCase implements IGetOneNodeService {
  constructor(@inject('GetByIdBase') private getById: IGetByIdBaseRepo) {}

  @checkUndefinedNull()
  async execute({
    node_id
  }: IGetOneNodeService.Params): IGetOneNodeService.Response {
    const node = await this.getById.get({
      table: 'nodes',
      column: 'node_id',
      id: node_id
    });

    if (node === DATABASE_ERROR) throw new DatabaseErrorReturn();
    else if (!node) throw new DataNotFound('Node');
    else return node;
  }
}

export { GetOneNodeUseCase };
