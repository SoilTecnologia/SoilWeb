import * as S from "./styles";
import React from "react";

import { useContextUserData } from "hooks/useContextUserData";
import { useContextAuth } from "hooks/useLoginAuth";

import Header from "components/globalComponents/Header";
import ScheduleListSelector from "../ScheduleListSelector";




const MainScheduleList = () => {
  const { pivot } = useContextUserData();
  const { user } = useContextAuth()

  return (
    <S.Container>
      <Header
        text={`Agendamentos do Pivô ${pivot?.pivot_num}`}

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

        <ScheduleListSelector/>
      </S.Body>
    </S.Container>
  );
};

export default MainScheduleList;
