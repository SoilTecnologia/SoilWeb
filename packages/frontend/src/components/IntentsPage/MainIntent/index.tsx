import * as S from "./styles";
import { useContextActionCrud } from "hooks/useActionsCrud";
import { useContextUserData } from "hooks/useContextUserData";
import Header from "components/globalComponents/Header";
import React, { useState } from "react";
import Intent from "utils/models/intent";

//Icons
import { ImCalendar } from "react-icons/im";


import StatusComponent from "../StatusComponent";
import IntentBlock from "../IntentBlock";
import { useContextData } from "hooks/useContextData";
import Router from "next/router";

type iconProps = {
  children: React.ReactNode
}

const Icon = ({ children }: iconProps) => (<S.Icon>{children}</S.Icon>)
const MainIntent = () => {
  const { pivot } = useContextUserData()
  const { pivotList } = useContextData()

  const getTimestamp = () => {
    if (pivot && pivotList) {
      const timeStamp = pivotList.map((pivots) => (pivots.pivot_id == pivot.pivot_id ? pivots.timestamp : null))
      console.log(timeStamp.toString())
      return timeStamp.toString()
    }
    return null
  }

  const handleMap = () => {
    Router.push('/map')
  }
  const handleHistoric = () => {
    Router.push('/historic')
  }

  return (
    <S.Container>
      <Header
        text={`Pivô ${pivot?.pivot_num}`}
        subHeaderText={getTimestamp() == null ? 'Nunca foi Atualizado' : `${getTimestamp()}`}
      />
      <S.Body>
        <S.ScheduleButton>
          <Icon>
            <ImCalendar />
          </Icon>

          <S.ButtonText>
            Realizar agendamento
          </S.ButtonText>
        </S.ScheduleButton>

        <S.CurrentStateContainer>

          <S.StateText>
            ESTADO ATUAL:
          </S.StateText>


          <StatusComponent />
        </S.CurrentStateContainer>

        <S.ButtonsView>

          <S.Button onClick={handleMap} >

            <S.MapIcon />

            <S.Text>
              Mapa
            </S.Text>

          </S.Button>

          <S.Button onClick={handleHistoric}>

            <S.ClockIcon />

            <S.Text >
              Histórico
            </S.Text>

          </S.Button>

        </S.ButtonsView>



        <IntentBlock />




      </S.Body>

    </S.Container>

  );

};

export default MainIntent;
