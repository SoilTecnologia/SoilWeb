import React, { createContext, useContext } from "react";
import Farm, { FarmCreate } from "utils/models/farm";
import Pivot, { PivotCreate } from "utils/models/pivot";
import User, { requestUser, UserCreate } from "utils/models/user";
import { useContextData } from "./useContextData";

import Node, { NodeCreate } from "utils/models/node";
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
  requestPostUser,
  requestUpdateFarm,
  requestUpdateNode,
  requestUpdatePivot,
  requestUpdateUser,
} from "api/requestApi";
import { parseCookies } from "nookies";
import { useContextAuth } from "./useLoginAuth";

interface UserProviderProps {
  children: React.ReactNode;
}

interface actionCrudProps {
  getAllUser: (token?: string) => Promise<requestUser[] | null>;
  createUser: (user: UserCreate) => void;
  updateUser: (user: User) => void;
  deleteUser: (id: string) => void;
  getAllFarmsUser: (id: string) => void;
  createFarm: (farm: FarmCreate) => void;
  updateFarm: (farm: Farm) => void;
  deleteFarm: (farm_id: Farm["farm_id"], user_id: User["user_id"]) => void;
  getAllNodes: (farm_id: Farm["farm_id"]) => void;
  createNode: (node: NodeCreate, farm: Farm) => void;
  updateNode: (node: Node) => void;
  deleteNode: (id: string, farmRelation: Farm) => void;
  getAllPivots: (node: Node) => void;
  createPivot: (pivot: PivotCreate) => void;
  updatePivot: (pivot: Pivot, node: Node) => void;
  deletePivot: (id: string, node: Node) => void;
  getAllPivotWithFarmId: (farm_id: Farm["farm_id"]) => void;
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
  } = useContextData();
  const { user } = useContextAuth();

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
    const newUser = await requestUpdateUser(updatedUser);
    if (newUser) {
      await getAllUser(user?.token);
    }
  };
  const deleteUser = async (id: string) => {
    await requestDeleteUser(id);
    await getAllUser(user?.token);
  };

  //CRUD FARMS
  const getAllFarmsUser = async (id: string) => {
    const response = await requestGetAllFarmsUser(id);
    response && setFarmList(response);
  };
  const createFarm = async (farm: FarmCreate) => {
    await requestCreateFarm(farm);
    setData({ ...stateAdmin, createFarm: false });
  };
  const updateFarm = async (farm: Farm) => {
    const newFarm = await requestUpdateFarm(farm);
    setData({ ...stateAdmin, updateFarm: null });
    newFarm && (await getAllFarmsUser(farm.user_id));
  };
  const deleteFarm = async (
    farm_id: Farm["farm_id"],
    user_id: User["user_id"]
  ) => {
    await requestDeleteFarm(farm_id);
    await getAllFarmsUser(user_id);
    setData({ ...stateAdmin });
  };

  //NODES
  const getAllNodes = async (farm_id: Farm["farm_id"]) => {
    const response = await requestGetAllNodes(farm_id);
    response && setNodeList(response);
  };
  const createNode = async (node: NodeCreate) => {
    await requestCreateNode(node);
    await getAllNodes(node.farm_id);
  };
  const updateNode = async (node: Node) => {
    const newNode = await requestUpdateNode(node);
    setData(stateAdmin);
    newNode && (await getAllNodes(node.farm_id));
  };
  const deleteNode = async (id: string, farmRelation: Farm) => {
    await requestDeleteNode(id);
    getAllNodes(farmRelation.farm_id);
  };

  //CRUD PIVOT
  const getAllPivots = async (node: Node) => {
    const result = await requestGetAllPivots(node.node_id);
    result && setPivotList(result);
    setData({
      ...stateDefault,
      showIsListUser: false,
      dataNodeSelected: node,
    });
  };
  const createPivot = async (pivot: PivotCreate) => {
    await requestCreateNewPivot(pivot);
    stateAdmin.dataNodeSelected && getAllPivots(stateAdmin.dataNodeSelected);
  };
  const updatePivot = async (pivot: Pivot, node: Node) => {
    const newPivot = await requestUpdatePivot(pivot);
    newPivot && (await getAllPivots(node));
  };
  const deletePivot = async (id: Pivot["pivot_id"], node: Node) => {
    await requestDeletePivot(id);
    await getAllPivots(node);
  };
  //Rota page user
  const getAllPivotWithFarmId = async (farm_id: Farm["farm_id"]) => {
    const result = await requestGetAllPivotsWithFarmId(farm_id);
    console.log("Todas os Pivos da fazenda");
    console.log(result);
     result&&setPivotList(result);
  };

  return (
    <ActionCrudContext.Provider
      value={{
        getAllUser,
        createUser,
        updateUser,
        deleteUser,
        getAllFarmsUser,
        createFarm,
        updateFarm,
        deleteFarm,
        createPivot,
        updatePivot,
        deletePivot,
        getAllNodes,
        getAllPivots,
        createNode,
        updateNode,
        deleteNode,

        getAllPivotWithFarmId,
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
