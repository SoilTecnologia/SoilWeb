import * as S from "./styles";
import React, { useEffect, useState } from "react";

import { useContextUserData } from "hooks/useContextUserData";
import { useContextAuth } from "hooks/useLoginAuth";

import Header from "components/globalComponents/Header";
import ScheduleListSelector from "../ScheduleListSelector";
import { parseCookies } from "nookies";




const MainScheduleList = () => {
  const { pivot } = useContextUserData();

  const [Ids, setIds] = useState({
    pivotId: '',
    pivotNum: 0
  })


  useEffect(() => {
    const { "user-pivot-id": pivot_id, "user-pivot-num": pivot_num } =
      parseCookies();
    setIds({
      pivotId: pivot.pivot_id || pivot_id,
      pivotNum: pivot.pivot_num || Number(pivot_num)
    })

  }, []);

  return (
    <S.Container>
      <Header
        text={`Agendamentos do Pivô ${Ids.pivotNum}`}

      />
      <S.Body>

        <S.ButtonsView>
          <S.Button href="/intent">
            <S.AnchorButton>
              <S.BackIcon />

              <S.Text>Intenções</S.Text>
            </S.AnchorButton>
          </S.Button>

          <S.Button href="/create_schedule">
            <S.AnchorButton>
              <S.ClockIcon />

              <S.Text>Criar Agendamento</S.Text>
            </S.AnchorButton>
          </S.Button>
        </S.ButtonsView>

        <ScheduleListSelector pivotId={Ids.pivotId} />
      </S.Body>
    </S.Container>
  );
};

export default MainScheduleList;
