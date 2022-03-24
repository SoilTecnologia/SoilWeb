import React, { createContext, useContext, useState } from "react";
import Farm from "utils/models/farm";
import Pivot from "utils/models/pivot";

interface UserProviderProps {
  children: React.ReactNode;
}

type ContextFarmData = Farm | null;
type ContextPivotData = Pivot | null;

type UserDataContexProps = {
  farm: Farm | null;
  setFarm: React.Dispatch<React.SetStateAction<null | Farm>>;
  pivot: Pivot | null;
  setPivot: React.Dispatch<React.SetStateAction<null | Pivot>>;
};

const UserDataContext = createContext({} as UserDataContexProps);

function UserDataProvider({ children }: UserProviderProps) {
  const [farm, setFarm] = useState<ContextFarmData>(null);
  const [pivot, setPivot] = useState<ContextPivotData>(null);

  return (
    <UserDataContext.Provider
      value={{
        farm: farm,
        setFarm,
        pivot: pivot,
        setPivot,
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
