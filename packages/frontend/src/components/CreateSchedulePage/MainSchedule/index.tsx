import * as S from "./styles";
import { useContextUserData } from "hooks/useContextUserData";
import Header from "components/globalComponents/Header";
import React, { useState } from "react";



import { useContextData } from "hooks/useContextData";
import IntentManager from "../IntentManager";
import SendAndCancelButton from "../SendAndCancelButton";
import IntentBlock from "../IntentBlock";

type iconProps = {
  children: React.ReactNode;
};

const Icon = ({ children }: iconProps) => <S.Icon>{children}</S.Icon>;

const MainCreateSchedule = () => {
  const { pivot } = useContextUserData();
  const { pivotList } = useContextData();

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
