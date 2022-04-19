import {
  requestCreateFarm,
  requestCreateNewPivot,
  requestCreateNode,
  requestDeleteFarm,
  requestDeleteNode,
  requestDeletePivot,
  requestDeleteUser,
  requestGetAllFarmsUser,
  requestGetAllNodes,
  requestGetAllPivots,
  requestGetAllPivotsWithFarmId,
  requestGetAllUsers,
  requestGetPivotsListWithFarmId,
  requestOneFarm,
  requestOnePivot,
  requestPostUser,
  requestUpdateFarm,
  requestUpdateNode,
  requestUpdatePivot,
  requestUpdateUser,
  requestSendPivotIntent,
  requestPivotStatus,
  requestGetAllPivotsForMapWithFarmId,
  requestPivotHistoric
} from "api/requestApi";
import { parseCookies } from "nookies";
import React, { createContext, useContext } from "react";
import Farm, { FarmCreate } from "utils/models/farm";
import Intent from "utils/models/intent";
import Node, { NodeCreate } from "utils/models/node";
import Pivot, { PivotCreate } from "utils/models/pivot";
import State from "utils/models/state";
import User, { requestUser, UserCreate } from "utils/models/user";
import { useContextData } from "./useContextData";
import { useContextAuth } from "./useLoginAuth";
import { useContextUserData } from './useContextUserData'
interface UserProviderProps {
  children: React.ReactNode;
}

interface actionCrudProps {
  getAllUser: (token?: string) => Promise<requestUser[] | null>;
  createUser: (user: UserCreate) => void;
  updateUser: (user: User) => void;
  deleteUser: (id: string) => void;
  getAllFarmsUser: (id: string) => void;
  getOneFarms: (farm_id: string) => Promise<Farm | null | undefined>;
  createFarm: (farm: FarmCreate) => void;
  updateFarm: (farm: Farm) => void;
  deleteFarm: (farm_id: Farm["farm_id"], user_id: User["user_id"]) => void;
  getAllNodes: (farm_id: Farm["farm_id"]) => void;
  createNode: (node: NodeCreate) => Promise<Node>;
  updateNode: (node: Node) => void;
  deleteNode: (id: string, farmRelation: Farm) => void;
  getAllPivots: (farm_id: Farm["farm_id"]) => void;
  getOnePivot: (pivot: PivotCreate) => Promise<Pivot | null | undefined>;
  createPivot: (pivot: PivotCreate) => void;
  updatePivot: (pivot: Pivot) => void;
  deletePivot: (pivot: Pivot) => void;
  getGetPivotsListWithFarmId: (farm_id: Farm["farm_id"]) => void;
  getAllPivotWithFarmId: (farm_id: Farm["farm_id"]) => void;
  sendPivotIntent: (pivotId: string, intent: Intent) => void;
  getPivotState: (pivot_id: Pivot['pivot_id']) => void;
  getGetPivotsListForMapWithFarmId: (farm_id: Farm["farm_id"]) => Promise<void>;
  getPivotHistoric: (pivot_id: Pivot["pivot_id"], start_date: Date, end_date: Date) => Promise<void>
}

const ActionCrudContext = createContext({} as actionCrudProps);

function UseCrudContextProvider({ children }: UserProviderProps) {
  //Contexts
  const {
    stateAdmin,
    setData,
    stateDefault,
    setUsersList,
    setFarmList,
    setNodeList,
    setPivotList,
    setPivotMapList
  } = useContextData();
  const { user } = useContextAuth();
  const { setPivot,setHistoric } = useContextUserData()
  //CRUD USER
  const getAllUser = async (
    tokenState?: string
  ): Promise<requestUser[] | null> => {
    const { "soilauth-token": token } = parseCookies();

    const TokenId = tokenState ? tokenState : token;

    const response = await requestGetAllUsers(TokenId);

    response && setUsersList(response);
    return response;
  };

  const createUser = async (newUser: UserCreate) => {
    const result = await requestPostUser(newUser);

    if (result) {
      await getAllUser(user?.token);
      setData(stateDefault);
    }
    return result;
  };
  const updateUser = async (updatedUser: User) => {
    const newUser = await requestUpdateUser(updatedUser, user?.token);
    if (newUser) {
      await getAllUser(user?.token);
    }
  };
  const deleteUser = async (id: string) => {
    await requestDeleteUser(id, user?.token);
    await getAllUser(user?.token);
  };

  //CRUD FARMS
  const getAllFarmsUser = async (id: string) => {
    const response = await requestGetAllFarmsUser(id, user?.token);
    response && setFarmList(response);
  };
  const getOneFarms = async (id: string) =>
    await requestOneFarm(id, user?.token);

  const createFarm = async (farm: FarmCreate) => {
    await requestCreateFarm(farm, user?.token);
    setData({ ...stateAdmin, createFarm: false });
  };
  const updateFarm = async (farm: Farm) => {
    const newFarm = await requestUpdateFarm(farm, user?.token);
    setData({ ...stateAdmin, updateFarm: null });
    newFarm && (await getAllFarmsUser(farm.user_id));
  };
  const deleteFarm = async (
    farm_id: Farm["farm_id"],
    user_id: User["user_id"]
  ) => {
    await requestDeleteFarm(farm_id, user?.token);
    await getAllFarmsUser(user_id);
    setData({ ...stateAdmin });
  };

  //NODES
  const getAllNodes = async (farm_id: Farm["farm_id"]) => {
    const response = await requestGetAllNodes(farm_id, user?.token);
    response && setNodeList(response);
  };
  const createNode = async (node: NodeCreate) => {
    const nodeCreated = await requestCreateNode(node, user?.token);

    return nodeCreated;
  };
  const updateNode = async (node: Node) => {
    const newNode = await requestUpdateNode(node, user?.token);
    setData(stateAdmin);
    newNode && (await getAllNodes(node.farm_id));
  };
  const deleteNode = async (id: string, farmRelation: Farm) => {
    await requestDeleteNode(id, user?.token);
    getAllNodes(farmRelation.farm_id);
  };

  //CRUD PIVOT
  const getAllPivots = async (farm_id: Farm["farm_id"]) => {
    const result = await requestGetAllPivots(farm_id, user?.token);
    result && setPivotList(result);
  };
  const getPivotState = async (pivot_id: Pivot['pivot_id']) => {
    const result = await requestPivotStatus(pivot_id, user?.token)
    result && setPivot(result)
  }

  const getOnePivot = async (pivot: PivotCreate) =>
    await requestOnePivot(pivot, user?.token);
  const createPivot = async (pivot: PivotCreate) => {
    await requestCreateNewPivot(pivot, user?.token);
    getAllPivots(pivot.farm_id);
  };
  const updatePivot = async (pivot: Pivot) => {
    const newPivot = await requestUpdatePivot(pivot, user?.token);
    newPivot && (await getAllPivots(pivot.farm_id));
  };
  const sendPivotIntent = async (pivotId: Pivot["pivot_id"], intent: Intent) => {
    await requestSendPivotIntent(pivotId, intent, user?.token);
  };
  const deletePivot = async (pivot: Pivot) => {
    await requestDeletePivot(pivot.pivot_id, user?.token);
    await getAllPivots(pivot.farm_id);
  };
  const getPivotHistoric = async (pivot_id: Pivot["pivot_id"], start_date: Date, end_date: Date) => {
    const result = await requestPivotHistoric(pivot_id, start_date, end_date, user?.token);
    result && setHistoric(result)
  };
  //Rota page user
  const getAllPivotWithFarmId = async (farm_id: Farm["farm_id"]) => {
    const result = await requestGetAllPivotsWithFarmId(farm_id, user?.token);
    result && setPivotList(result);
  };

  const getGetPivotsListWithFarmId = async (farm_id: Farm["farm_id"]) => {
    const result = await requestGetPivotsListWithFarmId(farm_id, user?.token);
    result && setPivotList(result);
  };
  const getGetPivotsListForMapWithFarmId = async (farm_id: Farm["farm_id"]) => {
    const result = await requestGetAllPivotsForMapWithFarmId(farm_id, user?.token);
    result && setPivotMapList(result);
  };

  return (
    <ActionCrudContext.Provider
      value={{
        getAllUser,
        createUser,
        updateUser,
        deleteUser,
        getAllFarmsUser,
        getOneFarms,
        createFarm,
        updateFarm,
        deleteFarm,
        createPivot,
        updatePivot,
        deletePivot,
        getAllNodes,
        getAllPivots,
        getOnePivot,
        createNode,
        updateNode,
        deleteNode,
        getAllPivotWithFarmId,
        getGetPivotsListWithFarmId,
        sendPivotIntent,
        getPivotState,
        getGetPivotsListForMapWithFarmId,
        getPivotHistoric,
      }}
    >
      {children}
    </ActionCrudContext.Provider>
  );
}

function useContextActionCrud() {
  const context = useContext(ActionCrudContext);

  return context;
}

export { useContextActionCrud, ActionCrudContext, UseCrudContextProvider };
