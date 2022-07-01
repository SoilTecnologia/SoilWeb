import {
  DatabaseErrorReturn,
  DATABASE_ERROR,
  DataNotFound
} from '@root/protocols/errors';
import { inject, injectable } from 'tsyringe';
import { IGetAllFarmsService } from '@root/useCases/contracts';
import { IGetAllBaseRepo } from '@root/database/protocols';
import { FarmModel } from '@root/database/model/Farm';

@injectable()
class GetAllFarmsUseCase implements IGetAllFarmsService {
  constructor(@inject('GetAllBase') private getAll: IGetAllBaseRepo) {}

  async execute(): IGetAllFarmsService.Response {
    const farms = await this.getAll.get<FarmModel>({ table: 'farms' });

    if (farms === DATABASE_ERROR) throw new DatabaseErrorReturn();
    else if (!farms) throw new DataNotFound('Farm');
    else return farms;
  }
}

export { GetAllFarmsUseCase };
