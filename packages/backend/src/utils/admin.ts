import {User, Farm} from '@prisma/client';

export const isAdminOf = (user: User, farm: (Farm & {users: User[]})): boolean => {
	 return farm.users.includes(user);
};
