import { requestUser, UserCreate } from "utils/models/user";
import api from "./api";

export const requestPostUser = async (user: UserCreate) => {
  const sendNewUser = {
    login: user.login,
    password: user.password,
    user_type: user.user_type,
  };
  try {
    const userResponse = await api.post(`users/signup`, sendNewUser);
    const response = userResponse ? true : false;
    return response;
  } catch (err) {
    return false;
  }
};

export const requestGetAllUsers = async () => {
  const { data } = await api.get<requestUser[]>(`users/allUsers`);
  return data;
};
