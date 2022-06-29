import * as S from "./styles";
import { useContextActionCrud } from "hooks/useActionsCrud";
import { useContextUserData } from "hooks/useContextUserData";
import Header from "components/globalComponents/Header";
import React, { useState } from "react";
import Intent from "utils/models/intent";

//Icons
// import { ImCalendar } from "react-icons/im";

import StatusComponent from "../StatusComponent";
import IntentBlock from "../IntentBlock";
import { useContextData } from "hooks/useContextData";
import { api } from "api/api";
import { parseCookies } from "nookies";

type iconProps = {
  children: React.ReactNode;
};

const Icon = ({ children }: iconProps) => <S.Icon>{children}</S.Icon>;

const MainIntent = () => {
  const { pivot } = useContextUserData();
  const { pivotList } = useContextData();

  const getRefresh = async () => {
    const { "soilauth-token": token } = parseCookies();
    const response = await api.post(
      `/actions/readState`,
      {
        pivot_id: pivot.pivot_id,
      },
      { headers: { Authorization: token } }
    );

    console.log(response);
  };

  return (
    <S.Container>
      <Header
        text={`Pivô ${pivot?.pivot_num}`}
        subHeaderText={
          pivot.timestamp == null ? "Nunca foi Atualizado" : pivot.timestamp
        }
      />
      <S.Body>
        {/* <S.ScheduleButton>
          <Icon>
            <ImCalendar />
          </Icon>

          <S.ButtonText>
            Realizar agendamento
          </S.ButtonText>
        </S.ScheduleButton> */}

        <S.CurrentStateContainer>
          <S.StateText>ESTADO ATUAL:</S.StateText>

          <StatusComponent />
        </S.CurrentStateContainer>

        <S.ButtonsView>
          <S.Button href="/map">
            <S.AnchorButton>
              <S.MapIcon />

              <S.Text>Mapa</S.Text>
            </S.AnchorButton>
          </S.Button>

          <S.Button href="/historic">
            <S.AnchorButton>
              <S.ClockIcon />

              <S.Text>Histórico</S.Text>
            </S.AnchorButton>
          </S.Button>
        </S.ButtonsView>

        <IntentBlock />
      </S.Body>

      <S.RefreshButton onClick={getRefresh}>
        <S.IconRefresh />
      </S.RefreshButton>
    </S.Container>
  );
};

export default MainIntent;
