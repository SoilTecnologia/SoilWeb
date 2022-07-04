import { parseCookies } from "nookies";
import Farm, { FarmCreate } from "utils/models/farm";
import Intent from "utils/models/intent";
import Node, { NodeCreate } from "utils/models/node";
import Pivot, { PivotCreate } from "utils/models/pivot";
import Schedule, {
  AngleSchedule,
  DateSchedule,
} from "utils/models/schedulings";
import State from "utils/models/state";
import User, { UserCreate } from "utils/models/user";
import { api } from "./api";

type tokenState = string | undefined;

const { "soilauth-token": token } = parseCookies();

const tokenHeader = (tokenId: tokenState) => {
  return { headers: { Authorization: tokenId ? tokenId : token } };
};

export type Response = {
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
  return await api
    .post<Response | null>(`users/signup`, user)
    .then((response) => response.data)
    .catch((err) => {
      console.log("[ERROR] error fetching data from server");
      console.log(err);
    });
};

export const requestUpdateUser = async (user: User, tokenId: tokenState) => {
  return await api
    .put<User[]>(`users/putUser`, user, tokenHeader(tokenId))
    .then((response) => response.data)
    .catch((err) => {
      console.log("[ERROR] error user update");
      console.log(err);
      return null;
    });
};

export const requestGetAllUsers = async (tokenId: tokenState) => {
  return await api
    .get(`users/allUsers`, tokenHeader(tokenId))
    .then((response) => response.data)
    .catch((err) => {
      console.log("[ERROR] error fetching data from server");
      console.log(err);
      return null;
    });
};

export const requestDeleteUser = async (id: string, tokenId: tokenState) => {
  return await api
    .delete(`users/delUser/${id}`, tokenHeader(tokenId))
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
    .get(`farms/farmUser/${id}`, tokenHeader(tokenId))
    .then((response) => response.data)
    .catch((err) => {
      console.log("[ERROR] error fetching data from server");
      console.log(err);
      return null;
    });
};

export const requestGetAllFarms = async (tokenId: tokenState) => {
  return await api
    .get(`farms/readAll`, tokenHeader(tokenId))
    .then((response) => response.data)
    .catch((err) => {
      console.log("[ERROR] error fetching data from server");
      console.log(err);
      return null;
    });
};

export const requestOneFarm = async (farmId: string, tokenId: tokenState) => {
  return await api
    .get<Farm | undefined>(`farms/getOneFarm/${farmId}`, tokenHeader(tokenId))
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
    .post("farms/addFarm", farm, tokenHeader(tokenId))
    .then((response) => response.data)
    .catch((err) => {
      console.log("[ERROR] Falha ao salvar fazenda");
      console.log(err);
    });
};

export const requestUpdateFarm = async (farm: Farm, tokenId: tokenState) => {
  return await api
    .put("farms/updateFarm", farm, tokenHeader(tokenId))
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
    .delete(`farms/deleteFarm/${farm_id}`, tokenHeader(tokenId))
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
    .post("nodes/addNode", node, tokenHeader(tokenId))
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
    .get<Node[]>(`nodes/readAll/${farm_id}`, tokenHeader(tokenId))
    .then((response) => response.data)
    .catch((err) => {
      console.log("[ERROR] error fetching data from server");
      console.log(err);
      return null;
    });
};

export const requestGetOneNode = async (
  node_id: Node["node_id"],
  tokenId: tokenState
) => {
  return await api
    .get<Node>(`nodes/getOne/${node_id}`, tokenHeader(tokenId))
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
    .delete(`nodes/deleteNode/${node_id}`, tokenHeader(tokenId))
    .then((response) => response.data)
    .catch((err) => {
      console.log("[ERROR] Falha ao salvar fazenda");
      console.log(err);
    });
};

export const requestUpdateNode = async (node: Node, tokenId: tokenState) => {
  return await api
    .put("nodes/updateNode", node, tokenHeader(tokenId))
    .then((response) => response.data)
    .catch((err) => {
      console.log("[ERROR] Falha ao salvar fazenda");
      console.log(err);
    });
};

//Pivots
export const requestGetAllPivots = async (
  farm_id: Farm["farm_id"],
  tokenId: tokenState
) => {
  return await api
    .get(`pivots/getPivots/${farm_id}`, tokenHeader(tokenId))
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.log("[ERROR] Falha ao salvar fazenda");
      console.log(err);
    });
};

export const requestFindAllPivots = async (tokenId: tokenState) => {
  return await api
    .get(`pivots/findAll`, tokenHeader(tokenId))
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
  tokenId: tokenState
) => {
  return await api
    .post(`pivots/addPivot`, pivot, tokenHeader(tokenId))
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
    .delete(`pivots/deletePivot/${pivot_id}`, tokenHeader(tokenId))
    .then((response) => response.data)
    .catch((err) => {
      console.log("[ERROR] Falha ao salvar fazenda");
      console.log(err);
    });
};

export const requestUpdatePivot = async (
  newPivot: Pivot,
  tokenId: tokenState
) => {
  return await api
    .put(`pivots/putPivot`, newPivot, tokenHeader(tokenId))
    .then((response) => response.data)
    .catch((err) => {
      console.log("[ERROR] Falha ao salvar fazenda");
      console.log(err);
    });
};
export const requestSendPivotIntent = async (
  pivotId: Pivot["pivot_id"],
  intents: Intent,
  tokenId: tokenState
) => {
  return await api
    .post(`actions/create/${pivotId}`, intents, {
      headers: { Authorization: tokenId ? tokenId : token },
    })
    .then((response) => response.data)
    .catch((err) => {
      console.log("[ERROR] Falha ao salvar fazenda");
      console.log(err);
    });
};

export const requestGetNodeWithPivotNum = async (
  node: NodeCreate,
  tokenId: tokenState
) => {
  return await api
    .get(`nodes/nodeNum/${node.node_num}/${node.farm_id}`, tokenHeader(tokenId))
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
    .get(`pivots/readAll/${farm_id}`, tokenHeader(tokenId))
    .then((response) => response.data)
    .catch((err) => {
      console.log("[ERROR] Falha ao salvar pivos");
      console.log(err);
    });
};
export const requestGetAllPivotsForMapWithFarmId = async (
  farm_id: Farm["farm_id"],
  tokenId: tokenState
) => {
  return await api
    .get(`pivots/map/${farm_id}`, {
      headers: { Authorization: tokenId ? tokenId : token },
    })
    .then((response) => response.data)
    .catch((err) => {
      console.log("[ERROR] Falha ao salvar pivos");
      console.log(err);
    });
};

export const requestOnePivot = async (
  pivot: PivotCreate,
  tokenId: tokenState
) => {
  return await api
    .get(
      `pivots/getOnePivot/${pivot.pivot_num}/${pivot.farm_id}`,
      tokenHeader(tokenId)
    )
    .then((response) => response.data)
    .catch((err) => {
      console.log("[ERROR] Falha ao salvar pivos");
      console.log(err);
    });
};
export const requestGetByPivotId = async (
  pivot_id: string,
  tokenId: tokenState
) => {
  return await api
    .get(`pivots/pivotById/${pivot_id}`, tokenHeader(tokenId))
    .then((response) => {
      console.log(response.data);
      return response.data;
    })
    .catch((err) => {
      console.log("[ERROR] Falha ao buscar pivo");
      console.log(err);
    });
};
export const requestPivotStatus = async (
  pivot_id: Pivot["pivot_id"],
  tokenId: tokenState
) => {
  return await api
    .get(`pivots/state/${pivot_id}`, {
      headers: { Authorization: tokenId ? tokenId : token },
    })
    .then((response) => response.data)
    .catch((err) => {
      console.log("[ERROR] Falha ao salvar pivô");
      console.log(err);
    });
};
export const requestGetPivotsListWithFarmId = async (
  farm_id: Farm["farm_id"],
  tokenId: tokenState
) => {
  return await api
    .get(`pivots/list/${farm_id}`, tokenHeader(tokenId))
    .then((response) => response.data)
    .catch((err) => {
      console.log("[ERROR] Falha ao salvar pivos");
      console.log(err);
    });
};
export const requestPivotHistoric = async (
  pivot_id: Pivot["pivot_id"],
  start_date: string,
  end_date: string,
  tokenId: tokenState
) => {
  return await api
    .get(`cycles/${pivot_id}/${start_date}/${end_date}`, tokenHeader(tokenId))
    .then((response) => response.data)
    .catch((err) => {
      console.log("[ERROR] Falha ao salvar pivos");
      console.log(err);
    });
};

//Schedules

export const requestCreateNewAngleSchedule = async (
  schedule: Schedule,
  tokenId: tokenState
) => {
  return await api
    .post(`scheduling-angles/addSchedulingAngle`, schedule, {
      headers: { Authorization: tokenId ? tokenId : token },
    })
    .then((response) => response.data)
    .catch((err) => {
      console.log("[ERROR] Falha ao criar agendamento por angulo");
      console.log(err);
    });
};
export const requestGetAngleSchedulings = async (
  pivot_id: Pivot["pivot_id"],
  tokenId: tokenState
) => {
  return await api
    .get(`scheduling-angles/getSchedulingAngle/${pivot_id}`, {
      headers: { Authorization: tokenId ? tokenId : token },
    })
    .then((response) => response.data)
    .catch((err) => {
      console.log("[ERROR] Falha ao buscar agendamento por angulo");
      console.log(err);
    });
};
export const requestDeleteAngleSchedule = async (
  schedule_id: AngleSchedule["scheduling_angle_id"],
  tokenId: tokenState
) => {
  return await api
    .delete(`scheduling-angles/deleteSchedulingAngle/${schedule_id}/`, {
      headers: { Authorization: tokenId ? tokenId : token },
    })
    .then((response) => response.data)
    .catch((err) => {
      console.log("[ERROR] Falha ao deletar agendamento por angulo");
      console.log(err);
    });
};

export const requestEditAngleSchedule = async (
  schedule: AngleSchedule,
  tokenId: tokenState
) => {
  return await api
    .put("scheduling-angles/updateSchedulingAngle", schedule, {
      headers: { Authorization: tokenId ? tokenId : token },
    })
    .then((response) => response.data)
    .catch((err) => {
      console.log("[ERROR] Falha ao editar agendamento por angulo");
      console.log(err);
    });
};

export const requestCreateNewDateSchedule = async (
  schedule: Schedule,
  tokenId: tokenState
) => {
  return await api
    .post(`schedulings/addScheduling`, schedule, {
      headers: { Authorization: tokenId ? tokenId : token },
    })
    .then((response) => response.data)
    .catch((err) => {
      console.log("[ERROR] Falha ao criar agendamento por data");
      console.log(err);
    });
};
export const requestGetDateSchedulings = async (
  pivot_id: Pivot["pivot_id"],
  tokenId: tokenState
) => {
  return await api
    .get(`schedulings/getScheduling/${pivot_id}`, {
      headers: { Authorization: tokenId ? tokenId : token },
    })
    .then((response) => response.data)
    .catch((err) => {
      console.log("[ERROR] Falha ao buscar agendamento por data");
      console.log(err);
    });
};

export const requestDeleteDateSchedule = async (
  schedule_id: DateSchedule["scheduling_id"],
  tokenId: tokenState
) => {
  return await api
    .delete(`schedulings/deleteScheduling/${schedule_id}/`, {
      headers: { Authorization: tokenId ? tokenId : token },
    })
    .then((response) => response.data)
    .catch((err) => {
      console.log("[ERROR] Falha ao deletar agendamento por data");
      console.log(err);
    });
};
export const requestEditDateSchedule = async (
  schedule: DateSchedule,
  tokenId: tokenState
) => {
  console.log(schedule,'enviou')
  return await api
    .put(`schedulings/updateScheduling`, schedule, {
      headers: { Authorization: tokenId ? tokenId : token },
    })
    .then((response) => response.data)
    .catch((err) => {
      console.log("[ERROR] Falha ao editar agendamento por data");
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
