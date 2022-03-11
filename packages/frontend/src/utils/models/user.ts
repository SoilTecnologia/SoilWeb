import Farm from "./farm";
export type UserType = "USER" | "SUDO";

export type requestUser = {
  login?: string;
  password?: string;
  user_id: string;
  user_type: UserType;
};

type User = requestUser;
// interface User extends requestUser {
//   // user_name: string;
//   // farm: Farm[] | null;
// }

export type UserCreate = {
  // user_name: string;
  login?: string;
  password?: string;
  user_type: UserType;
};

export default User;
