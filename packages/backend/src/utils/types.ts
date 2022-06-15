// user_types: tipo a ser testado

import { UserModel } from '../database/model/User';

// target_types: tipos que retornarão true

export const messageErrorTryAction = (
  err: any,
  isDatabase: boolean,
  className: string,
  message: string
) => {
  const messageLog = `${
    isDatabase ? ERROR_QUERIES_DATABASE : ERROR_INTERNAL
  } --> ${className} in ${message}`;
  console.log(messageLog);
  console.log('ERROR: ');
  const error = err as Error;
  console.log(error.message);
  console.log('');
  console.log('Server is Running');
};

export function isType(
  user_type: string,
  target_types: UserModel['user_type'][]
): boolean {
  for (let target of target_types) {
    if (user_type === target) return true;
  }
  return false;
}

export const ERROR_QUERIES_DATABASE = 'error when querying'.toUpperCase();
export const ERROR_INTERNAL =
  '[ERROR] INTERNAL SERVER ERROR WHEN'.toUpperCase();
