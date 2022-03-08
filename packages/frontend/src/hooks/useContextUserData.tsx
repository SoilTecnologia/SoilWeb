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

type ContextUserData = Farm | null

type UserDataContexProps = {
  farm: Farm | null,
  setFarm: React.Dispatch<React.SetStateAction<null | Farm>>

}

const UserDataContext = createContext({} as UserDataContexProps);

function UserDataProvider({ children }: UserProviderProps) {

  const [farm, setFarm] = useState<ContextUserData>(null);

  return (
    <UserDataContext.Provider
      value={{ farm: farm, setFarm }}
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
