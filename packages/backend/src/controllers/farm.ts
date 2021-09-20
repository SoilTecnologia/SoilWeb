import { Prisma, PrismaClient, User, Farm } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import user from '../middlewares/user';

const db = new PrismaClient();

export const createFarmController = async (
  farm_name: Farm['farm_name'],
  city: Farm['city'],
  lng: Farm['lng'],
  lat: Farm['lat'],
  gateway: Farm['gateway'],
  user_ids?: User['user_id'][]
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

  if (user_ids) {
    user_ids.forEach(async (user_id) => {
      const user = await db.user.findFirst({ where: { user_id } });
      if (user) {
        farmUsers.push(user);
      }
    });
  }

  await db.farm.update({
    where: { farm_id: newFarm.farm_id },
    data: {
      users: {
        connect: farmUsers
      }
    }
  });

  return newFarm;
};

export const readAllFarmController = async (
  user_id: User['user_id']
): Promise<Pick<Farm, 'farm_id' | 'farm_name' | 'city'>[] | null> => {
  const farms = await db.farm.findMany({
    where: {
      users: {
        some: { user_id }
      }
    },
    select: {
      farm_id: true,
      farm_name: true,
      city: true
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

export const deleteFarm = async (
  farm_id: Farm['farm_id']
): Promise<boolean> => {
  const hasDeleted = await db.farm.delete({ where: { farm_id } });

  if (hasDeleted) return true;

  return false;
};
