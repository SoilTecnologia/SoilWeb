import { FarmModel } from '@root/database/model/Farm';
import { NodeModel } from '@root/database/model/Node';
import { IGetMapFarmRepo } from '@root/database/protocols/farms/get-map';
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

export const farmMap: IGetMapFarmRepo.MapFarm[] = [
  {
    farm_id: 'soil',
    farm_name: 'Soiltech',
    farm_city: 'Santa Rita',
    farm_lng: -46.62551,
    farm_lat: -21.20767,
    user_id: '0897e788-0977-460f-ad90-d39ae6dd0c17',
    node_id: 'fba9e37f-b3c3-4454-84b2-707f6ce765ef',
    node_num: 0,
    is_gprs: false,
    gateway: '192.168.100.104'
  },
  {
    farm_id: 'soil2',
    farm_name: 'Soiltech2',
    farm_city: 'Santa Rita2',
    farm_lng: -46.625512,
    farm_lat: -21.207672,
    user_id: '0897e788-0977-460f-ad90-d39ae6dd0c12',
    node_id: 'fba9e37f-b3c3-4454-84b2-707f6ce762ef',
    node_num: 1,
    is_gprs: true,
    gateway: undefined
  }
];
