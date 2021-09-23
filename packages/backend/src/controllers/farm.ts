import { Prisma, PrismaClient, User, UserType, Farm } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import user from '../middlewares/auth';
import { isUserTypeOf } from '../utils/farm';

const db = new PrismaClient();

export const createFarmController = async (
  farm_name: Farm['farm_name'],
  city: Farm['city'],
  lng: Farm['lng'],
  lat: Farm['lat'],
  gateway: Farm['gateway'],
): Promise<Farm | null> => {
  let farmUsers: User[] = [];

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
): Promise<Pick<Farm, 'farm_id' | 'farm_name' | 'city'>[] | null> => {
  const farms = await db.farmUser.findMany({
    where: {
      user_id: user_id
    },
    select: {
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
  gateway?: Farm['gateway']
): Promise<Farm> => {
  const newFarm = await db.farm.update({
    data: {
      farm_name,
      city,
      lng,
      lat,
      gateway
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
  const hasDeleted = await db.farm.delete({ where: { farm_id } });

  if (hasDeleted) return true;

  return false;
};

export const addUserToFarmController = async (
  user_id: User['user_id'],
  target_user_id: User['user_id'],
  target_farm_id: Farm['farm_id']
): Promise<boolean> => {
  const user = await db.user.findUnique({ where: { user_id } });
  const targetUser = await db.user.findUnique({
    where: { user_id: target_user_id }
  });
  const targetFarm = await db.farm.findUnique({
    where: { farm_id: target_farm_id },
    include: { users: true }
  });

  if (user && targetFarm && targetUser) {
    if (targetUser.user_type == 'ADMIN') {
      if (isUserTypeOf(user, targetFarm, ['SUDO'])) {
        await db.farm.update({
          where: { farm_id: target_farm_id },
          data: {
            users: {
              connect: [user]
            }
          }
        });
        return true;
      }
    } else {
      if (isUserTypeOf(user, targetFarm, ['SUDO','ADMIN'])) {
        await db.farm.update({
          where: { farm_id: target_farm_id },
          data: {
            users: {
              connect: [user]
            }
          }
        });
      }

      return true;
    }
  }

  return false;
};
