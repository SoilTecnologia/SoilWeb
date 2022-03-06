import React, { createContext, useContext } from "react";
import Farm, { FarmCreate } from "utils/models/farm";
import Pivot from "utils/models/pivot";
import User, { requestUser, UserCreate } from "utils/models/user";
import { useContextData } from "./useContextData";

import {
  handleDeleteFarm,
  handleDeletePivot,
  handleDeleteUser,
  handleUpdateFarm,
  handleUpdatePivot,
  handleUpdateUser,
} from "utils/handleDataCruds";
import Node, { NodeCreate } from "utils/models/node";
import {
  requestDeleteUser,
  requestGetAllFarmsUser,
  requestGetAllUsers,
  requestPostUser,
} from "api/requestApi";

interface UserProviderProps {
  children: React.ReactNode;
}

interface actionCrudProps {
  getAllUser: () => void;
  createUser: (user: UserCreate) => void;
  updateUser: (user: User) => void;
  deleteUser: (id: string) => void;
  getAllFarmsUser: (id: string) => void;
  createFarm: (farm: FarmCreate, user_id: string) => void;
  updateFarm: (farm: Farm) => void;
  deleteFarm: (id: string) => void;
  createNode: (node: NodeCreate, farm: Farm) => void;
  updateNode: (node: Node, farmRelation: Farm) => void;
  deleteNode: (id: string, farmRelation: Farm) => void;
  createPivot: () => void;
  updatePivot: (pivot: Pivot, farmRelation: Farm) => void;
  deletePivot: (id: string, farmRelation: Farm) => void;
}

const ActionCrudContext = createContext({} as actionCrudProps);

function UseCrudContextProvider({ children }: UserProviderProps) {
  const {
    stateAdmin,
    setData,
    stateDefault,
    usersList,
    setUsersList,
    setFarmList,
    setNodeList,
    setPivotList,
    nodeList,
  } = useContextData();

  //CRUD USER
  const getAllUser = async () => {
    const response = await requestGetAllUsers();
    response && setUsersList(response);
  };

  const createUser = async (user: UserCreate) => {
    const result = await requestPostUser(user);
    if (result) {
      getAllUser();
      setData(stateDefault);
    }
    return;
  };
  const updateUser = (user: User) => {
    setData(stateDefault);
    const newUserList = handleUpdateUser(user, usersList);
    setUsersList(newUserList);
  };
  const deleteUser = async (id: string) => {
    const response = await requestDeleteUser(id);
    getAllUser();
  };

  //CRUD FARMS
  const getAllFarmsUser = async (id: string) => {
    const response = await requestGetAllFarmsUser(id);
    setFarmList(response);
  };
  const createFarm = (farm: FarmCreate, user_id: string) => {
    const farm_id = Number(user_id + 1).toString();
    const user = stateAdmin.dataUserSelected;
    const newFarm: Farm = {
      farm_id,
      user_id,
      ...farm,
      pivots: null,
      node: null,
    };
    if (user) {
      user.farm?.push(newFarm);
      user.farm?.sort((a, b) => Number(a.farm_id) - Number(b.farm_id));
    }
    setData({ ...stateAdmin, createFarm: false });
  };
  const updateFarm = (farm: Farm) => {
    if (stateAdmin.dataUserSelected) {
      const user = stateAdmin.dataUserSelected;
      if (user.farm) {
        const newArray = handleUpdateFarm(farm, user.farm);

        setData({
          ...stateDefault,
          showIsListUser: false,
          dataUserSelected: { ...stateAdmin.dataUserSelected, farm: newArray },
        });
      }
    }
  };
  const deleteFarm = (id: string) => {
    const user = stateAdmin.dataUserSelected;
    if (user && user.farm) {
      const newFarmList = handleDeleteFarm(id, user.farm);
      setData({
        ...stateAdmin,
        showIsListUser: false,
        dataUserSelected: { ...user, farm: newFarmList },
      });
    }
  };

  //NODES
  const createNode = (node: NodeCreate, farm: Farm) => {
    const user = stateAdmin.dataUserSelected;
    const newNode: Node = { ...node, pivots: null, node_id: "123" };

    if (farm.node) {
      const farmSelected: Farm = { ...farm, node: [...farm.node, newNode] };

      if (user && user.farm) {
        user.farm.push(farmSelected);
        const newDataUser: User = { ...user, farm: [...user.farm] };

        setData({ ...stateAdmin, dataUserSelected: newDataUser });
      }
    }
  };
  const updateNode = (node: Node, farmRelation: Farm) => {};
  const deleteNode = (id: string, farmRelation: Farm) => {};

  //CRUD PIVOT
  const createPivot = () => {};
  const updatePivot = (pivot: Pivot, farmRelation: Farm) => {
    const user = stateAdmin.dataUserSelected;
    if (user && user.farm) {
      const newArrayFarms = handleUpdatePivot(pivot, farmRelation, user.farm);

      setData({
        ...stateDefault,
        showIsListUser: false,
        dataUserSelected: { ...user, farm: newArrayFarms },
      });
    }
  };
  const deletePivot = (id: string, farmRelation: Farm) => {
    const user = stateAdmin.dataUserSelected;
    if (user && user.farm) {
      const newArrayFarms = handleDeletePivot(id, farmRelation, user.farm);

      setData({
        ...stateDefault,
        showIsListUser: false,
        dataUserSelected: { ...user, farm: newArrayFarms },
      });
    }
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
        createNode,
        updateNode,
        deleteNode,
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
