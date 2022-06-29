import { IGetByFarmAndNodeNumRepo } from '@root/database/protocols';
import {
  DatabaseErrorReturn,
  DATABASE_ERROR,
  DataNotFound
} from '@root/protocols/errors';
import { IGetByFarmAndNodeNumService } from '@root/useCases/contracts/nodes/getByFarmAndNodeNum';
import { checkUndefinedNull } from '@root/utils/decorators/check-types';
import { inject, injectable } from 'tsyringe';

@injectable()
class GetByNumByFarmUseCase implements IGetByFarmAndNodeNumService {
  constructor(
    @inject('GetByFarmAndNodeNum') private getNode: IGetByFarmAndNodeNumRepo
  ) {}

  @checkUndefinedNull()
  async execute({
    farm_id,
    node_num
  }: IGetByFarmAndNodeNumService.Params): IGetByFarmAndNodeNumService.Response {
    const response = await this.getNode.get({ farm_id, node_num });

    if (response === DATABASE_ERROR) throw new DatabaseErrorReturn();
    else if (!response) throw new DataNotFound('Node');
    else return response;
  }
}

export { GetByNumByFarmUseCase };
