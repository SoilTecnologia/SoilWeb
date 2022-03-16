import * as S from "./styles";
import { useContextActionCrud } from "hooks/useActionsCrud";
import { useContextUserData } from "hooks/useContextUserData";
import Header from "components/globalComponents/Header";
import React, { useEffect, useState } from "react";
import Intent from "utils/models/intent";

//Icons
import { ImArrowLeft2, ImCalendar } from "react-icons/im";


import StatusComponent from "../StatusComponent";




type iconProps = {
  children: React.ReactNode
}
const Icon = ({ children }: iconProps) => (<S.Icon>{children}</S.Icon>)
const MainIntent = () => {
  const { pivot } = useContextUserData()
  const { sendPivotIntent } = useContextActionCrud()


  const [intent, setIntent] = useState<Intent>({
    connection: true,
    power: true,
    water: true,
    direction: 'ANTI_CLOCKWISE',
    percentimeter: 11,
    angle: 100,
    timestamp: new Date().valueOf()
  })


  const func = () => {
    sendPivotIntent(pivot?.pivot_id, intent)
  }

  return (
    <S.Container>
      <Header
        text={`Pivô ${pivot?.pivot_num}`}
        subHeaderText={pivot?.timestamp == null ? 'Nunca foi Atualizado' : `${pivot?.timestamp}`}
      />
      <S.Body>
        <S.ScheduleButton onClick={func}>
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


          <StatusComponent/>
        </S.CurrentStateContainer>

      </S.Body>

    </S.Container>

  );

};

export default MainIntent;
