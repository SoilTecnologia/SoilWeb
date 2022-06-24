import {
  DatabaseErrorReturn,
  DATABASE_ERROR,
  DataNotFound
} from '@root/protocols/errors';
import { inject, injectable } from 'tsyringe';
import { messageErrorTryAction } from '@utils/types';
import { IGetAllFarmsService } from '@root/useCases/contracts';
import { IGetAllFarmsRepo } from '@root/database/protocols';

@injectable()
class GetAllFarmsUseCase implements IGetAllFarmsService {
  constructor(@inject('GetAllFarms') private findFarms: IGetAllFarmsRepo) {}

  private async applyQueryGetAll() {
    try {
      return await this.findFarms.getAll();
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        GetAllFarmsUseCase.name,
        'Get All Farms'
      );
      return DATABASE_ERROR;
    }
  }

  async execute(): IGetAllFarmsService.Response {
    const farms = await this.applyQueryGetAll();

    if (farms === DATABASE_ERROR) throw new DatabaseErrorReturn();
    else if (!farms) throw new DataNotFound('Farm');
    else return farms;
  }
}

export { GetAllFarmsUseCase };
