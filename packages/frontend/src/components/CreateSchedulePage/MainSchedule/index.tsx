import * as S from "./styles";
import { useContextUserData } from "hooks/useContextUserData";
import Header from "components/globalComponents/Header";
import React, { useEffect, useState } from "react";

import { useContextData } from "hooks/useContextData";
import IntentBlock from "../IntentBlock";
import { useContextScheduleData } from "hooks/useContextScheduleData";
import { useContextAuth } from "hooks/useLoginAuth";

type iconProps = {
  children: React.ReactNode;
};


const MainCreateSchedule = () => {
  const { pivot } = useContextUserData();
  const { user } = useContextAuth()
  const { scheduleType,setNewAngleSchedule, setNewDateSchedule } = useContextScheduleData()
  useEffect(() => {
    if (user && pivot) {
      setNewAngleSchedule(prevState => ({ ...prevState, [`pivot_id`]: pivot.pivot_id, [`author`]: user.user_id }))
      setNewDateSchedule(prevState => ({ ...prevState, [`pivot_id`]: pivot.pivot_id, [`author`]: user.user_id }))
    }

  },[scheduleType])

  return (
    <S.Container>
      <Header
        text={`Agendar Pivô ${pivot?.pivot_num}`}

      />
      <S.Body>

        <S.ButtonsView>
          <S.Button href="/intent">
            <S.AnchorButton>
              <S.MapIcon />

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
