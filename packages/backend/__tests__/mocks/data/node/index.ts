import { NodeModel } from '@root/database/model/Node';
import { addFarms } from '../farms/farms-values-mock';

export const addNode: Omit<NodeModel, 'node_id'> = {
  farm_id: addFarms.farm_id,
  is_gprs: true,
  node_num: 1,
  gateway: undefined
};

export const nodeCreated: NodeModel = {
  ...addNode,
  node_id: 'p8a16ff7-4a31-11eb-be7b-8344edc8f36b'
};

export const arrayNode: NodeModel[] = [
  {
    ...addNode,
    node_num: 2,
    node_id: 'p9a16ff7-4a31-11eb-be7b-8344edc8f36b'
  },
  {
    ...addNode,
    node_num: 3,
    node_id: 'p7a16ff7-4a31-11eb-be7b-8344edc8f36b'
  }
];
