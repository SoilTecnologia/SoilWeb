import knex from '@root/database';
import { FarmModel } from '@root/database/model/Farm';
import { NodeModel } from '@root/database/model/Node';
import { PivotModel } from '@root/database/model/Pivot';
import { UserModel } from '@root/database/model/User';
import { BcryptAdapter } from '@root/useCases/data';
import { addFarms } from '../farms/farms-values-mock';
import { addNode } from '../node';
import { addPivot } from '../pivots';
import { addUser } from '../users/user-values-for-mocks';

const createUser = async () => {
  const user = await knex<UserModel>('users')
    .select('*')
    .where('login', addUser.login)
    .first();

  if (!user) {
    const encrypted = new BcryptAdapter();

    const password = await encrypted.encrypt({ value: addUser.password });

    const newUser = await knex<UserModel>('users')
      .insert({ ...addUser, password })
      .returning('*');

    return newUser[0];
  } else return user;
};

const createFarm = async () => {
  const farm = await knex<FarmModel>('farms')
    .select('*')
    .where('farm_id', addFarms.farm_id)
    .first();

  if (!farm) {
    const user = await createUser();

    const newFarm = await knex('farms')
      .insert({ ...addFarms, user_id: user?.user_id! })
      .returning('*');

    return newFarm[0];
  } else return farm;
};

const createNode = async () => {
  let node = await knex<NodeModel>('nodes')
    .select('*')
    .where({ farm_id: addFarms.farm_id, node_num: addNode.node_num })
    .first();

  if (!node) {
    const farm = await createFarm();

    const newNode = await knex('nodes')
      .insert({ ...addNode, farm_id: addFarms.farm_id })
      .returning('*');

    return newNode[0];
  } else return node;
};

const createPivot = async () => {
  let pivot = await knex<PivotModel>('pivots')
    .select('*')
    .where({ pivot_id: addPivot.pivot_id })
    .first();

  if (!pivot) {
    const node = await createNode();
    return await knex('pivots').insert({
      ...addPivot,
      node_id: node?.node_id!!
    });
  } else return pivot;
};

export { createUser, createFarm, createNode, createPivot };
