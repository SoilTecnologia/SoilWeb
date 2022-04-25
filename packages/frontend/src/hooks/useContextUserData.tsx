import React, { createContext, useContext, useState } from "react";
import Farm from "utils/models/farm";
import Historic from "utils/models/historic";
import Pivot from "utils/models/pivot";

interface UserProviderProps {
  children: React.ReactNode;
}

type ContextFarmData = Farm | null;
type ContextPivotData = Pivot;
type ContextHistoricData = Historic[];

type UserDataContexProps = {
  farm: Farm | null;
  setFarm: React.Dispatch<React.SetStateAction<null | Farm>>;
  pivot: Pivot;
  setPivot: React.Dispatch<React.SetStateAction<Pivot>>;
  historic: Historic[];
  setHistoric: React.Dispatch<React.SetStateAction<ContextHistoricData>>;
  socketPayload: any[] | null;
  setSocketPayload: React.Dispatch<React.SetStateAction<any[] | null>>;
};

const UserDataContext = createContext({} as UserDataContexProps);

function UserDataProvider({ children }: UserProviderProps) {
  const [farm, setFarm] = useState<ContextFarmData>(null);
  const [pivot, setPivot] = useState<ContextPivotData>({} as Pivot);
  const [socketPayload, setSocketPayload] = useState<any[] | null>([]);
  const [historic, setHistoric] = useState<ContextHistoricData>([]);

  return (
    <UserDataContext.Provider
      value={{
        farm: farm,
        setFarm,
        pivot: pivot,
        setPivot,
        historic: historic,
        setHistoric,
        socketPayload: socketPayload,
        setSocketPayload,
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
