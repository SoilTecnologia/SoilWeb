import { FarmModel } from '../../model/Farm';
import { UserModel } from '../../model/User';

interface IFarmsRepository {
  findById(farm_id: FarmModel['farm_id']): Promise<FarmModel | undefined>;
  create(farm: FarmModel): Promise<FarmModel | undefined>;
  updateFarm(farm: FarmModel): Promise<FarmModel | undefined>;
  deleteFarm(farm_id: FarmModel['farm_id']): Promise<number | undefined>;
  getFarmsByUser(
    user_id: UserModel['user_id']
  ): Promise<FarmModel[] | undefined>;

  getAllFarms(): Promise<FarmModel[]>;
  getMapFarm(farm_id: FarmModel['farm_id']): Promise<any | undefined>;
}

export { IFarmsRepository };
