import { api } from "api/api";
import { parseCookies } from "nookies";
import { useState } from "react";
import Pivot from "utils/models/pivot";
import ModalMessage from "../ModalMessage";
import * as S from "./styles";

type PivotListProps = {
  pivotList: Pivot[];
};

const ButtonRefresh = ({ pivotList }: PivotListProps) => {
  /* libera e trava a requisição de refresh de estado do pivo, para não haver spawn */
  const [noSpawn, setNoSpawn] = useState(false);
  const [messageSpawn, setMessageSpawn] = useState(false);

  const configSpawn = (time: number) => {
    setNoSpawn(true);

    setTimeout(() => {
      setNoSpawn(false);
    }, time);
  };

  const configMessageSpawn = (time: number) => {
    setMessageSpawn(true);
    setTimeout(() => {
      setMessageSpawn(false);
    }, time);
  };

  const sendRequest = async (listPivotId: string[]) => {
    const { "soilauth-token": token } = parseCookies();

    const pivots = { pivots: listPivotId };
    const auth = { headers: { Authorization: token } };

    await api.post(`/actions/readState`, pivots, auth);
    configSpawn(40000);
  };

  const getRefresh = async () => {
    const listPivotId = [];

    for (let pivot of pivotList) {
      listPivotId.push(pivot.pivot_id);
    }

    if (!noSpawn) await sendRequest(listPivotId);
    else configMessageSpawn(8000);
  };

  return (
    <>
      <S.RefreshButton onClick={getRefresh}>
        <S.IconRefresh />
      </S.RefreshButton>

      {messageSpawn && (
        <S.ContentModal>
          <ModalMessage
            alert="ATUALIZAÇÃO DE ESTADO EM ANDAMENTO..."
            subAlert="AGUARDE 45s A CADA TENTIVA DE ATUALIZAÇÃO"
            txtButton="FECHAR"
            callbackButtonClick={() => setMessageSpawn(false)}
          >
            <S.IconAttention />
          </ModalMessage>
        </S.ContentModal>
      )}
    </>
  );
};

export default ButtonRefresh;
