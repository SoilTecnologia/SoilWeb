import { PrismaClient, User, UserType, FarmUser, Farm } from '@prisma/client';
import { DuplicateUniqueError } from '../types/errors';
import db from '../database';

const prismaClient = new PrismaClient();

/*
Calling user: User which is calling the function
Target user: The use to be added
Farm: The farm the user will be added to
*/

export const addUserToFarmController = async (
  calling_user_id: User['user_id'],
  target_user_id: User['user_id'],
  target_farm_id: Farm['farm_id'],
  farm_user_type: FarmUser['farm_user_type']
): Promise<boolean> => {
  const calling_user = await db.user.findUnique({
    where: { user_id: calling_user_id }
  });
  const target_farm = await db.farm.findUnique({
    where: { farm_id: target_farm_id },
    include: { users: true }
  });
  const target_user = await db.user.findUnique({
    where: { user_id: target_user_id }
  });

  const callingUserIsAdminOfTargetFarm = target_farm?.users.filter((user) => {
    return (
      user.user_id == calling_user?.user_id && user.farm_user_type == 'ADMIN'
    );
  });

  const isUserAlreadyInFarm = target_farm?.users.filter((user) => {
    return user.user_id == target_user_id;
  });

  if (target_user && target_farm && callingUserIsAdminOfTargetFarm) {
    if (
      calling_user?.user_type == 'SUDO' ||
      callingUserIsAdminOfTargetFarm.length > 0
    ) {
      console.log("IS ADMIN!")
      if (isUserAlreadyInFarm && isUserAlreadyInFarm.length == 0) {
        await db.farmUser.create({
          data: {
            farm_user_type: 'WORKER',
            farm: { connect: { farm_id: target_farm_id } },
            user: { connect: { user_id: target_user_id } }
          }
        });

        return true;
      } else {
        throw new DuplicateUniqueError('target_user_id');
      }
    } else {
      console.log("NOT ADMIN")
      console.log(target_farm)
    }
  }

  return false;
};
