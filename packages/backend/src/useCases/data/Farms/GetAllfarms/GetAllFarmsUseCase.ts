import {
  DatabaseErrorReturn,
  DATABASE_ERROR,
  DataNotFound
} from '@root/protocols/errors';
import { inject, injectable } from 'tsyringe';
import { messageErrorTryAction } from '@utils/types';
import { IGetAllFarmsService } from '@root/useCases/contracts';
import { IGetAllBaseRepo } from '@root/database/protocols';
import { FarmModel } from '@root/database/model/Farm';

@injectable()
class GetAllFarmsUseCase implements IGetAllFarmsService {
  constructor(
    @inject('GetAllBase') private findFarms: IGetAllBaseRepo<FarmModel>
  ) {}

  private async applyQueryGetAll() {
    try {
      return await this.findFarms.get({ table: 'farms' });
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
