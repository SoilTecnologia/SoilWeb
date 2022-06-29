import { FarmModel } from '@root/database/model/Farm';
import { NodeModel } from '@root/database/model/Node';
import { uuidGlobal } from '../global';

export const addFarms: FarmModel = {
  farm_id: 'farm_soil',
  user_id: 'soiltech',
  farm_city: 'soil_city',
  farm_lat: 19.45,
  farm_lng: 45.76,
  farm_name: 'soil'
};

export const farmsArray: FarmModel[] = [
  {
    farm_id: 'farm_soil',
    user_id: 'soiltech',
    farm_city: 'soil_city',
    farm_lat: 19.45,
    farm_lng: 45.76,
    farm_name: 'soil'
  },
  {
    farm_id: 'farm_soil2',
    user_id: 'soiltech2',
    farm_city: 'soil_city2',
    farm_lat: 19.45,
    farm_lng: 45.76,
    farm_name: 'soil2'
  },
  {
    farm_id: 'farm_soil3',
    user_id: 'soiltech3',
    farm_city: 'soil_city3',
    farm_lat: 19.45,
    farm_lng: 45.76,
    farm_name: 'soil3'
  }
];
