import { FarmModel } from '../../model/Farm';

interface IFarmsRepository {
  findById(farm_id: FarmModel['farm_id']): Promise<FarmModel | undefined>;
  create(farm: FarmModel): Promise<FarmModel | undefined>;
  updateFarm(farm: FarmModel): Promise<FarmModel | undefined>;
  deleteFarm(farm_id: FarmModel['farm_id']): Promise<number | undefined>;
  getOneFarm(farm_id: FarmModel['farm_id']): Promise<FarmModel | undefined>;
}

export { IFarmsRepository };
