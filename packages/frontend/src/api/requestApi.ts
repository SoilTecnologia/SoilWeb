import { parseCookies } from "nookies";
import Farm, { FarmCreate } from "utils/models/farm";
import Node, { NodeCreate } from "utils/models/node";
import Pivot, { PivotCreate } from "utils/models/pivot";
import User, { UserCreate } from "utils/models/user";
import { api } from "./api";

const { "soilauth-token": token } = parseCookies();
export type Response = {
  user_type: User["user_type"];
  user_id: User["user_id"];
  token: string;
};

type tokenState = string | undefined;

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

export const requestUpdateUser = async (user: User, tokenId: tokenState) => {
  return await api
    .put<User[]>(`users/putUser`, user, {
      headers: { Authorization: tokenId ? tokenId : token },
    })
    .then((response) => response.data)
    .catch((err) => {
      console.log("[ERROR] error user update");
      console.log(err);
      return null;
    });
};

export const requestGetAllUsers = async (tokenId: tokenState) => {
  return await api
    .get(`users/allUsers`, {
      headers: { Authorization: tokenId ? tokenId : token },
    })
    .then((response) => response.data)
    .catch((err) => {
      console.log("[ERROR] error fetching data from server");
      console.log(err);
      return null;
    });
};

export const requestDeleteUser = async (id: string, tokenId: tokenState) => {
  return await api
    .delete(`users/delUser/${id}`, {
      headers: { Authorization: tokenId ? tokenId : token },
    })
    .then((response) => response.data)
    .catch((err) => {
      console.log("[ERROR] error fetching data from server");
      console.log(err);
      return null;
    });
};

//Farms
export const requestGetAllFarmsUser = async (
  id: string,
  tokenId: tokenState
) => {
  return await api
    .get(`farms/farmUser/${id}`, {
      headers: { Authorization: tokenId ? tokenId : token },
    })
    .then((response) => response.data)
    .catch((err) => {
      console.log("[ERROR] error fetching data from server");
      console.log(err);
      return null;
    });
};

export const requestCreateFarm = async (
  farm: FarmCreate,
  tokenId: tokenState
) => {
  return await api
    .post("farms/addFarm", farm, {
      headers: { Authorization: tokenId ? tokenId : token },
    })
    .then((response) => response.data)
    .catch((err) => {
      console.log("[ERROR] Falha ao salvar fazenda");
      console.log(err);
    });
};

export const requestUpdateFarm = async (farm: Farm, tokenId: tokenState) => {
  return await api
    .put("farms/updateFarm", farm, {
      headers: { Authorization: tokenId ? tokenId : token },
    })
    .then((response) => response.data)
    .catch((err) => {
      console.log("[ERROR] Erro ao deletar usúario ");
      console.log(err);
      return null;
    });
};

export const requestDeleteFarm = async (
  farm_id: string,
  tokenId: tokenState
) => {
  return await api
    .delete(`farms/deleteFarm/${farm_id}`, {
      headers: { Authorization: tokenId ? tokenId : token },
    })
    .then((response) => response.data)
    .catch((err) => {
      console.log("[ERROR] Erro ao deletar usúario ");
      console.log(err);
      return null;
    });
};

//Nodes

export const requestCreateNode = async (
  node: NodeCreate,
  tokenId: tokenState
) => {
  return await api
    .post("nodes/addNode", node, {
      headers: { Authorization: tokenId ? tokenId : token },
    })
    .then((response) => response.data)
    .catch((err) => {
      console.log("[ERROR] Falha ao salvar fazenda");
      console.log(err);
    });
};
export const requestGetAllNodes = async (
  farm_id: Farm["farm_id"],
  tokenId: tokenState
) => {
  return await api
    .get<Node[]>(`nodes/readAll/${farm_id}`, {
      headers: { Authorization: tokenId ? tokenId : token },
    })
    .then((response) => response.data)
    .catch((err) => {
      console.log("[ERROR] error fetching data from server");
      console.log(err);
      return null;
    });
};

export const requestDeleteNode = async (
  node_id: Node["node_id"],
  tokenId: tokenState
) => {
  return await api
    .delete(`nodes/deleteNode/${node_id}`, {
      headers: { Authorization: tokenId ? tokenId : token },
    })
    .then((response) => response.data)
    .catch((err) => {
      console.log("[ERROR] Falha ao salvar fazenda");
      console.log(err);
    });
};

export const requestUpdateNode = async (node: Node, tokenId: tokenState) => {
  return await api
    .put("nodes/updateNode", node, {
      headers: { Authorization: tokenId ? tokenId : token },
    })
    .then((response) => response.data)
    .catch((err) => {
      console.log("[ERROR] Falha ao salvar fazenda");
      console.log(err);
    });
};

//Pivots
export const requestGetAllPivots = async (
  node_id: Node["node_id"],
  tokenId: tokenState
) => {
  return await api
    .get(`pivots/getPivots/${node_id}`, {
      headers: { Authorization: tokenId ? tokenId : token },
    })
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.log("[ERROR] Falha ao salvar fazenda");
      console.log(err);
    });
};

export const requestCreateNewPivot = async (
  pivot: PivotCreate,
  nodeNum: Node["node_num"],
  tokenId: tokenState
) => {
  return await api
    .post(`pivots/addPivot/${nodeNum}`, pivot, {
      headers: { Authorization: tokenId ? tokenId : token },
    })
    .then((response) => response.data)
    .catch((err) => {
      console.log("[ERROR] Falha ao salvar fazenda");
      console.log(err);
    });
};
export const requestDeletePivot = async (
  pivot_id: Pivot["pivot_id"],
  tokenId: tokenState
) => {
  return await api
    .delete(`pivots/deletePivot/${pivot_id}`, {
      headers: { Authorization: tokenId ? tokenId : token },
    })
    .then((response) => response.data)
    .catch((err) => {
      console.log("[ERROR] Falha ao salvar fazenda");
      console.log(err);
    });
};
export const requestUpdatePivot = async (
  newPivot: Pivot,
  nodeNum: Node["node_num"],
  tokenId: tokenState
) => {
  return await api
    .put(`pivots/putPivot/${nodeNum}`, newPivot, {
      headers: { Authorization: tokenId ? tokenId : token },
    })
    .then((response) => response.data)
    .catch((err) => {
      console.log("[ERROR] Falha ao salvar fazenda");
      console.log(err);
    });
};

export const requestGetAllPivotsWithFarmId = async (
  farm_id: Farm["farm_id"],
  tokenId: tokenState
) => {
  return await api
    .get(`pivots/readAll/${farm_id}`, {
      headers: { Authorization: tokenId ? tokenId : token },
    })
    .then((response) => response.data)
    .catch((err) => {
      console.log("[ERROR] Falha ao salvar pivos");
      console.log(err);
    });
};
export const requestGetPivotsListWithFarmId = async (
  farm_id: Farm["farm_id"],
  tokenId: tokenState
) => {
  return await api
    .get(`pivots/list/${farm_id}`, {
      headers: { Authorization: tokenId ? tokenId : token },
    })
    .then((response) => response.data)
    .catch((err) => {
      console.log("[ERROR] Falha ao salvar pivos");
      console.log(err);
    });
};

/// WEB CRUD
//  export const requestPivotStatus = async (pivo_id:string) => {
//    return await api
//    .get(``)
//    .then((response) => response.data)
//    .catch((err) => {
//      console.log("[ERROR] Falha ao salvar fazenda");
//      console.log(err);
//    });

//  }
