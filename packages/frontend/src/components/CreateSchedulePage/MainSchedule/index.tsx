import * as S from "./styles";
import { useContextUserData } from "hooks/useContextUserData";
import Header from "components/globalComponents/Header";
import React, { useEffect, useRef, useState } from "react";

import { useContextData } from "hooks/useContextData";
import IntentBlock from "../IntentBlock";
import { useContextScheduleData } from "hooks/useContextScheduleData";
import { useContextAuth } from "hooks/useLoginAuth";
import { parseCookies } from "nookies";

type iconProps = {
  children: React.ReactNode;
};


const MainCreateSchedule = () => {
  const { pivot } = useContextUserData();
  const { user } = useContextAuth()
  const { scheduleType, setNewAngleSchedule, setNewDateSchedule } = useContextScheduleData()
  const [Ids, setIds] = useState({
    pivotId: '',
    userId: '',
    pivotNum: 0
  })


  useEffect(() => {
    const { "user-pivot-id": pivot_id, "soilauth-userid": user_id, "user-pivot-num": pivot_num } =
      parseCookies();
    setIds({
      pivotId: pivot.pivot_id || pivot_id,
      userId: user?.user_id || user_id,
      pivotNum: pivot.pivot_num || Number(pivot_num)
    })

  }, []);
  useEffect(() => {
    if ((user && pivot) || (Ids.pivotId && Ids.userId)) {
      setNewAngleSchedule(prevState => ({ ...prevState, [`pivot_id`]: Ids.pivotId, [`author`]: Ids.userId }))
      setNewDateSchedule(prevState => ({ ...prevState, [`pivot_id`]: Ids.pivotId, [`author`]: Ids.userId }))
    }
  }, [scheduleType])




  return (
    <S.Container>
      <Header
        text={`Agendar Pivô ${Ids.pivotNum}`}

      />
      <S.Body>

        <S.ButtonsView>
          <S.Button href="/intent">
            <S.AnchorButton>
              <S.BackIcon />

              <S.Text>Intenções</S.Text>
            </S.AnchorButton>
          </S.Button>

          <S.Button href="/schedules">
            <S.AnchorButton>
              <S.ClockIcon />

              <S.Text>Agendamentos</S.Text>
            </S.AnchorButton>
          </S.Button>
        </S.ButtonsView>

        <S.HeaderText>
          Selecione o tipo do agendamento:
        </S.HeaderText>
        <IntentBlock />


      </S.Body>
    </S.Container>
  );
};

export default MainCreateSchedule;
