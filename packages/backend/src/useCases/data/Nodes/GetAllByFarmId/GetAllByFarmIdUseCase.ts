import {
  IGetAllByDataBaseRepo,
  IGetByIdBaseRepo
} from '@root/database/protocols';
import {
  DatabaseErrorReturn,
  DATABASE_ERROR,
  DataNotFound
} from '@root/protocols/errors';
import { inject, injectable } from 'tsyringe';
import { IGetAllByFarmService } from '@root/useCases/contracts';
import { NodeModel } from '@root/database/model/Node';
import { FarmModel } from '@root/database/model/Farm';
import { checkUndefinedNull } from '@root/utils/decorators/check-types';

@injectable()
class GetAllByFarmIdUseCase implements IGetAllByFarmService {
  constructor(
    @inject('GetAllByDataBase')
    private getAll: IGetAllByDataBaseRepo<NodeModel>,
    @inject('GetByIdBase') private getById: IGetByIdBaseRepo<FarmModel>
  ) {}

  @checkUndefinedNull()
  async execute({
    farm_id
  }: IGetAllByFarmService.Params): IGetAllByFarmService.Response {
    const farm = await this.getById.get({
      table: 'farms',
      column: 'farm_id',
      id: farm_id
    });

    if (farm === DATABASE_ERROR) throw new DatabaseErrorReturn();
    else if (!farm) throw new DataNotFound('Farm');

    const nodes = await this.getAll.get({
      table: 'nodes',
      column: 'farm_id',
      where: farm_id
    });

    if (nodes === DATABASE_ERROR) throw new DatabaseErrorReturn();
    else if (!nodes) throw new DataNotFound('Node');
    else return nodes;
  }
}

export { GetAllByFarmIdUseCase };
