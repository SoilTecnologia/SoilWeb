import { UserType } from '.prisma/client';

export interface IUSer {
  user_id: string;
  user_type: UserType;
}
