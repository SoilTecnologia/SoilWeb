import * as S from "./styles";
import React from "react";

import { useContextUserData } from "hooks/useContextUserData";


import Header from "components/globalComponents/Header";
import IntentBlock from "../IntentBlock";
import { useContextScheduleData } from "hooks/useContextScheduleData";



const MainEditSchedule = () => {
  const { pivot } = useContextUserData();
  const { editingSchedule } = useContextScheduleData()
  return (
    <S.Container>
      <Header
        text={`Editando agendamento do Pivô ${pivot?.pivot_num}`}

      />
      <S.Body>

        <S.ButtonsView>
          <S.Button href="/schedules">
            <S.AnchorButton>
              <S.BackIcon />

              <S.Text>Cancelar Edição</S.Text>
            </S.AnchorButton>
          </S.Button>

        </S.ButtonsView>

        <S.HeaderText>
          Selecione o tipo do agendamento:
        </S.HeaderText>
        <IntentBlock />


      </S.Body>
    </S.Container>
  )
};

export default MainEditSchedule;
