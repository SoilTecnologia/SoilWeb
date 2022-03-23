import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import Intent from "utils/models/intent";



interface IntentsProviderProps {
  children: React.ReactNode;
}

type ContextIntentsData = Intent | null;


type IntentsDataContexProps = {
  intents: Intent | null,
  setIntents: React.Dispatch<React.SetStateAction<null | Intent>>

}

const IntentsDataContext = createContext({} as IntentsDataContexProps);

function IntentsDataProvider({ children }: IntentsProviderProps) {

  const [intents, setIntents] = useState<ContextIntentsData>({
    power: null,
    water: null,
    direction: null,
    percentimeter: 0,
  });

  return (
    <IntentsDataContext.Provider
      value={{
        intents: intents, setIntents
      }}
    >
      {children}
    </IntentsDataContext.Provider>
  );
}

function useContextIntentsData() {
  const context = useContext(IntentsDataContext);

  return context;
}

export { useContextIntentsData, IntentsDataContext, IntentsDataProvider };
