// user_types: tipo a ser testado

import { UserModel } from '../database/model/User';

// target_types: tipos que retornarão true
export function isType(
  user_type: string,
  target_types: UserModel['user_type'][]
): boolean {
  for (let target of target_types) {
    if (user_type === target) return true;
  }
  return false;
}
