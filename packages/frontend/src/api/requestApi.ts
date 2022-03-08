import { FarmCreate } from "utils/models/farm";
import User, { requestUser, UserCreate } from "utils/models/user";
import { api } from "./api";

type Response = {
  user_type: User["user_type"];
  user_id: User["user_id"];
  token: string;
};

//User
export const requestLoginAuth = async (login: string, password: string) => {
  const bodyReQ = { login, password };
  return api
    .post<Promise<Response | null>>("users/signin", bodyReQ)
    .then((response) => response.data)
    .catch((err) => {
      console.log("[ERROR] error login data");
      console.log(err);
      return null;
    });
};

export const requestPostUser = async (user: UserCreate) => {
  const sendNewUser = {
    login: user.login,
    password: user.password,
    user_type: user.user_type,
  };
  return await api
    .post<Response | null>(`users/signup`, sendNewUser)
    .then((response) => {
      console.log("response " + response.data);
      return response.data;
    })
    .catch((err) => {
      console.log("[ERROR] error fetching data from server");
      console.log(err);
    });
};

export const requestGetAllUsers = async () => {
  return await api
    .get<requestUser[]>(`users/allUsers`)
    .then((response) => response.data)
    .catch((err) => {
      console.log("[ERROR] error fetching data from server");
      console.log(err);
      return null;
    });
};

export const requestDeleteUser = async (id: string) => {
  return await api
    .delete(`users/delUser/${id}`)
    .then((response) => response.data)
    .catch((err) => {
      console.log("[ERROR] error fetching data from server");
      console.log(err);
      return null;
    });
};

//Farms
export const requestGetAllFarmsUser = async (id: string) => {
  return await api
    .get(`farms/farmUser/${id}`)
    .then((response) => response.data)
    .catch((err) => {
      console.log("[ERROR] error fetching data from server");
      console.log(err);
      return null;
    });
};

export const requestCreateFarm = async (farm: FarmCreate) => {
  return await api
    .post("farms/addFarm", farm)
    .then((response) => response.data)
    .catch((err) => {
      console.log("[ERROR] Falha ao salvar fazenda");
      console.log(err);
    });
};

export const requestDeleteFarm = async (farm_id: string) => {
  return await api
    .delete(`farms/deleteFarm/${farm_id}`)
    .then((response) => response.data)
    .catch((err) => {
      console.log("[ERROR] Erro ao deletar usúario ");
      console.log(err);
      return null;
    });
};

//Pivots
export const requestGetAllFarmsPivots = async (id:string)=>{
  return await api
    .get(`/pivots/readAll/${id}`)
    .then((response) => response.data)
    .catch((err) => {
      console.log("[ERROR] error fetching data from server");
      console.log(err);
      return null;
    });
}
