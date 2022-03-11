import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

import Farm from "utils/models/farm";
import Node from "utils/models/node";
import Pivot from "utils/models/pivot";
import User, { requestUser } from "utils/models/user";

export type stateContentProps = {
  userLogged: requestUser | null;

  showIsListUser: boolean;
  optionUser: "create" | "list";

  updateUser: User | null;
  dataUserSelected: User | null;

  createFarm: boolean;
  updateFarm: Farm | null;
  dataFarmSelected: Farm | null;

  dataNodeSelected: Node | null;
  updatePivot: Pivot | null;

  nodeList: Node[];
};
type dataContextProps = {
  stateDefault: stateContentProps;
  stateAdmin: stateContentProps;
  setData: Dispatch<SetStateAction<stateContentProps>>;
  setUsersList: Dispatch<SetStateAction<requestUser[]>>;
  usersList: requestUser[];
  farmList: Farm[];
  setFarmList: Dispatch<SetStateAction<Farm[]>>;
  setNodeList: Dispatch<SetStateAction<Node[]>>;
  setPivotList: Dispatch<SetStateAction<Pivot[]>>;
  pivotList: Pivot[];
  nodeList: Node[];
};

interface UserProviderProps {
  children: React.ReactNode;
}

const UserDataContext = createContext({} as dataContextProps);

function UseContextProvider({ children }: UserProviderProps) {
  const stateContent: stateContentProps = {
    userLogged: null,
    showIsListUser: true,
    updateUser: null,
    optionUser: "list",
    dataUserSelected: null,
    createFarm: false,
    updateFarm: null,
    dataFarmSelected: null,
    dataNodeSelected: null,
    updatePivot: null,
    nodeList: [] as Node[],
  };
  const [data, setData] = useState(stateContent);
  const [usersList, setUsersList] = useState<requestUser[]>(
    [] as requestUser[]
  );
  const [farmList, setFarmList] = useState<Farm[]>([] as Farm[]);
  const [nodeList, setNodeList] = useState<Node[]>([] as Node[]);
  const [pivotList, setPivotList] = useState<Pivot[]>([] as Pivot[]);

  return (
    <UserDataContext.Provider
      value={{
        stateAdmin: data,
        setData,
        stateDefault: stateContent,
        usersList,
        setUsersList,
        setNodeList,
        setPivotList,
        nodeList,
        pivotList,
        farmList,
        setFarmList,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
}

function useContextData() {
  const context = useContext(UserDataContext);

  return context;
}

export { useContextData, UserDataContext, UseContextProvider };
