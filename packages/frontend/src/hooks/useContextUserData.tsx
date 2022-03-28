import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

import Farm from "utils/models/farm";
import Node from "utils/models/node";
import Pivot from "utils/models/pivot";
import User, { requestUser } from "utils/models/user";


interface UserProviderProps {
  children: React.ReactNode;
}

type ContextFarmData = Farm | null;
type ContextPivotData = Pivot;

type UserDataContexProps = {
  farm: Farm | null,
  setFarm: React.Dispatch<React.SetStateAction<null | Farm>>
  pivot: Pivot,
  setPivot: React.Dispatch<React.SetStateAction<Pivot>>
}

const UserDataContext = createContext({} as UserDataContexProps);

function UserDataProvider({ children }: UserProviderProps) {

  const [farm, setFarm] = useState<ContextFarmData>(null);
  const [pivot, setPivot] = useState<ContextPivotData>({} as Pivot);

  return (
    <UserDataContext.Provider
      value={{
        farm: farm, setFarm,
        pivot: pivot, setPivot
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
}

function useContextUserData() {
  const context = useContext(UserDataContext);

  return context;
}

export { useContextUserData, UserDataContext, UserDataProvider };
