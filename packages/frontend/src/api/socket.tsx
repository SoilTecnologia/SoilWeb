import { useContextActionCrud } from "hooks/useActionsCrud";
import { useContextUserData } from "hooks/useContextUserData";
import { useContextAuth } from "hooks/useLoginAuth";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const Socket = () => {
  const { user } = useContextAuth();
  const { farm, pivot } = useContextUserData();
  const {
    getPivotState,
    getGetPivotsListWithFarmId,
    getGetPivotsListForMapWithFarmId,
  } = useContextActionCrud();
  const [socketIsOpen, setSocketIsOpen] = useState({
    StatusSocket: false,
    VariableSocket: false,
  });

  const socket = io("http://localhost:3308", { transports: ["websocket"] });

  useEffect(() => {
    if (user?.user_id && farm?.farm_id) {
      socket.on(`${user.user_id}-status`, (payload) => {
        setSocketIsOpen((prevState) => ({
          ...prevState,
          ["StatusSocket"]: true,
        }));

        if (payload.type === "status" && farm?.farm_name == payload.farm_name) {
          getGetPivotsListWithFarmId(farm.farm_id);
          getGetPivotsListForMapWithFarmId(farm?.farm_id);
        }
      });
    }
    return () => {
      socket.close();
    };
  }, [user, farm]);

  useEffect(() => {
    if (user?.user_id && farm?.farm_id && pivot?.pivot_id) {
      socket.on(`${user.user_id}-status`, (payload) => {
        setSocketIsOpen((prevState) => ({
          ...prevState,
          ["VariableSocket"]: true,
        }));

        if (pivot.pivot_id == payload.pivot_id) {
          getPivotState(payload.pivot_id);
          getGetPivotsListForMapWithFarmId(farm?.farm_id);
        }
      });
    }

    return () => {
      socket.close();
    };
  }, [pivot]);

  return <></>;
};

export default Socket;
