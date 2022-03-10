import Farm, { FarmCreate } from "utils/models/farm";
import Node, { NodeCreate } from "utils/models/node";
import Pivot, { PivotCreate } from "utils/models/pivot";
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
    .then((response) => response.data)
    .catch((err) => {
      console.log("[ERROR] error fetching data from server");
      console.log(err);
    });
};

export const requestUpdateUser = async (user: User) => {
  return await api
    .put<User[]>(`users/putUser`, user)
    .then((response) => response.data)
    .catch((err) => {
      console.log("[ERROR] error user update");
      console.log(err);
      return null;
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

export const requestUpdateFarm = async (farm: Farm) => {
  return await api
    .put("farms/updateFarm", farm)
    .then((response) => response.data)
    .catch((err) => {
      console.log("[ERROR] Erro ao deletar usúario ");
      console.log(err);
      return null;
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

//Nodes

export const requestCreateNode = async (node: NodeCreate) => {
  return await api
    .post("nodes/addNode", node)
    .then((response) => response.data)
    .catch((err) => {
      console.log("[ERROR] Falha ao salvar fazenda");
      console.log(err);
    });
};
export const requestGetAllNodes = async (farm_id: Farm["farm_id"]) => {
  return await api
    .get<Node[]>(`nodes/readAll/${farm_id}`)
    .then((response) => response.data)
    .catch((err) => {
      console.log("[ERROR] error fetching data from server");
      console.log(err);
      return null;
    });
};

export const requestDeleteNode = async (node_id: Node["node_id"]) => {
  return await api
    .delete(`nodes/deleteNode/${node_id}`)
    .then((response) => response.data)
    .catch((err) => {
      console.log("[ERROR] Falha ao salvar fazenda");
      console.log(err);
    });
};

export const requestUpdateNode = async (node: Node) => {
  return await api
    .put("nodes/updateNode", node)
    .then((response) => response.data)
    .catch((err) => {
      console.log("[ERROR] Falha ao salvar fazenda");
      console.log(err);
    });
};

//Pivots
export const requestGetAllPivots = async (node_id: Node["node_id"]) => {
  return await api
    .get(`pivots/getPivots/${node_id}`)
    .then((response) => {
      console.log("RESPONSE");
      console.log(response.data);
      return response.data;
    })
    .catch((err) => {
      console.log("[ERROR] Falha ao salvar fazenda");
      console.log(err);
    });
};

export const requestCreateNewPivot = async (pivot: PivotCreate) => {
  return await api
    .post(`pivots/addPivot`, pivot)
    .then((response) => response.data)
    .catch((err) => {
      console.log("[ERROR] Falha ao salvar fazenda");
      console.log(err);
    });
};
export const requestDeletePivot = async (pivot_id: Pivot["pivot_id"]) => {
  return await api
    .delete(`pivots/deletePivot/${pivot_id}`)
    .then((response) => response.data)
    .catch((err) => {
      console.log("[ERROR] Falha ao salvar fazenda");
      console.log(err);
    });
};
export const requestUpdatePivot = async (newPivot: Pivot) => {
  return await api
    .put(`pivots/putPivot`, newPivot)
    .then((response) => response.data)
    .catch((err) => {
      console.log("[ERROR] Falha ao salvar fazenda");
      console.log(err);
    });
};
