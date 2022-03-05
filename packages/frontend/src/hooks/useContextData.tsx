import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { users } from "utils/mockFarms/users";
import Farm from "utils/models/farm";
import Node from "utils/models/node";
import Pivot from "utils/models/pivot";
import User, { requestUser } from "utils/models/user";

export type stateContentProps = {
  showIsListUser: boolean;
  optionUser: "create" | "list";

  updateUser: User | null;
  dataUserSelected: User | null;

  createFarm: boolean;
  updateFarm: Farm | null;
  dataFarmSelected: Farm | null;
  updatePivot: Pivot | null;

  nodeList: Node[];
};
type dataContextProps = {
  stateDefault: stateContentProps;
  stateAdmin: stateContentProps;
  setData: Dispatch<SetStateAction<stateContentProps>>;
  setUsersList: Dispatch<SetStateAction<requestUser[]>>;
  usersList: requestUser[];
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
    showIsListUser: true,
    updateUser: null,
    optionUser: "list",
    dataUserSelected: null,
    createFarm: false,
    updateFarm: null,
    dataFarmSelected: null,
    updatePivot: null,
    nodeList: [] as Node[],
  };
  const [data, setData] = useState(stateContent);
  const [usersList, setUsersList] = useState<requestUser[]>(
    [] as requestUser[]
  );
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
