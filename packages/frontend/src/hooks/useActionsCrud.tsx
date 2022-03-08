import React, { createContext, useContext } from "react";
import Farm, { FarmCreate } from "utils/models/farm";
import Pivot from "utils/models/pivot";
import User, { UserCreate } from "utils/models/user";
import { useContextData } from "./useContextData";

import { handleUpdateUser } from "utils/handleDataCruds";
import Node, { NodeCreate } from "utils/models/node";
import {
  requestCreateFarm,
  requestDeleteFarm,
  requestDeleteUser,
  requestGetAllFarmsUser,
  requestGetAllUsers,
  requestPostUser,
  requestUpdateFarm,
  requestUpdateUser,
} from "api/requestApi";
import Router from "next/router";
import { parseCookies } from "nookies";

interface UserProviderProps {
  children: React.ReactNode;
}

interface actionCrudProps {
  getAllUser: () => void;
  createUser: (user: UserCreate) => void;
  updateUser: (user: User) => void;
  deleteUser: (id: string) => void;
  getAllFarmsUser: (id: string) => void;
  createFarm: (farm: FarmCreate) => void;
  updateFarm: (farm: Farm) => void;
  deleteFarm: (farm_id: Farm["farm_id"], user_id: User["user_id"]) => void;
  createNode: (node: NodeCreate, farm: Farm) => void;
  updateNode: (node: Node, farmRelation: Farm) => void;
  deleteNode: (id: string, farmRelation: Farm) => void;
  createPivot: () => void;
  updatePivot: (pivot: Pivot, farmRelation: Farm) => void;
  deletePivot: (id: string, farmRelation: Farm) => void;
}

const ActionCrudContext = createContext({} as actionCrudProps);

function UseCrudContextProvider({ children }: UserProviderProps) {
  //Contexts
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
    const { "soilauth-token": token } = parseCookies();

    if (token) {
      const response = await requestGetAllUsers();
      response && setUsersList(response);
    } else {
      Router.push("/");
    }
  };

  const createUser = async (user: UserCreate) => {
    const result = await requestPostUser(user);

    if (result) {
      getAllUser();
      setData(stateDefault);
    }
    return result;
  };
  const updateUser = async (user: User) => {
    const newUser = await requestUpdateUser(user);
    if (newUser) {
      await getAllUser();
    }
  };
  const deleteUser = async (id: string) => {
    await requestDeleteUser(id);
    await getAllUser();
  };

  //CRUD FARMS
  const getAllFarmsUser = async (id: string) => {
    const response = await requestGetAllFarmsUser(id);
    setFarmList(response);
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
  const createNode = (node: NodeCreate, farm: Farm) => {
    // const user = stateAdmin.dataUserSelected;
    // const newNode: Node = { ...node, pivots: null, node_id: "123" };
    // if (farm.node) {
    //   const farmSelected: Farm = { ...farm, node: [...farm.node, newNode] };
    //   if (user && user.farm) {
    //     user.farm.push(farmSelected);
    //     const newDataUser: User = { ...user, farm: [...user.farm] };
    //     setData({ ...stateAdmin, dataUserSelected: newDataUser });
    //   }
    // }
  };
  const updateNode = (node: Node, farmRelation: Farm) => {};
  const deleteNode = (id: string, farmRelation: Farm) => {};

  //CRUD PIVOT
  const createPivot = () => {};
  const updatePivot = (pivot: Pivot, farmRelation: Farm) => {
    // const user = stateAdmin.dataUserSelected;
    // if (user && user.farm) {
    //   const newArrayFarms = handleUpdatePivot(pivot, farmRelation, user.farm);
    //   setData({
    //     ...stateDefault,
    //     showIsListUser: false,
    //     dataUserSelected: { ...user, farm: newArrayFarms },
    //   });
    // }
  };
  const deletePivot = (id: string, farmRelation: Farm) => {
    // const user = stateAdmin.dataUserSelected;
    // if (user && user.farm) {
    //   const newArrayFarms = handleDeletePivot(id, farmRelation, user.farm);
    //   setData({
    //     ...stateDefault,
    //     showIsListUser: false,
    //     dataUserSelected: { ...user, farm: newArrayFarms },
    //   });
    // }
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
