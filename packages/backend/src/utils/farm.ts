import {User, Farm, UserType} from '@prisma/client';
import {isType} from './types';

// Returns if the user is a <UserType> of a certain farm
export const isUserTypeOf = (user: User, farm: (Farm & {users: User[]}), target_user_type: (keyof typeof UserType)[]): boolean => {
	 return farm.users.includes(user) && isType(user.user_type, target_user_type);
};
