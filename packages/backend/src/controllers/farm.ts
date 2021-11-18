import { Prisma, PrismaClient, User, UserType, FarmUser, Farm } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import user from '../middlewares/auth';
import { isUserTypeOf } from '../utils/farm';

import db from '../database';

export const createFarmController = async (
  farm_name: Farm['farm_name'],
  city: Farm['city'],
  lng: Farm['lng'],
  lat: Farm['lat'],
  gateway: Farm['gateway']
): Promise<Farm | null> => {

  const newFarm = await db.farm.create({
    data: {
      farm_name,
      city,
      lng,
      lat,
      gateway
    }
  });
  return newFarm;
};

export const readAllFarmController = async (
  user_id: User['user_id']
): Promise<FarmUser[]> => {
  const farms = await db.farmUser.findMany({
    where: {
      user_id: user_id
    },
    include: {
      farm: {
        select: {
          farm_id: true,
          farm_name: true,
          city: true
        }
      }
    }
  });

  return farms;
};

export const updateFarmController = async (
  farm_id: Farm['farm_id'],
  farm_name?: Farm['farm_name'],
  city?: Farm['city'],
  lng?: Farm['lng'],
  lat?: Farm['lat'],
): Promise<Farm> => {
  const newFarm = await db.farm.update({
    data: {
      farm_name,
      city,
      lng,
      lat,
    },
    where: {
      farm_id
    }
  });

  return newFarm;
};

export const deleteFarmController = async (
  farm_id: Farm['farm_id']
): Promise<boolean> => {
  await db.node.deleteMany({where: {farm_id}})
  await db.farmUser.deleteMany({where: {farm_id}})
  await db.farm.delete({ where: { farm_id } });

  return true;
};

