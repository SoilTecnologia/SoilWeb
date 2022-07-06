import * as S from "./styles";
import React, { useEffect, useState } from "react";

import { useContextUserData } from "hooks/useContextUserData";


import Header from "components/globalComponents/Header";
import IntentBlock from "../IntentBlock";
import { parseCookies } from "nookies";




const MainEditSchedule = () => {
  const { pivot } = useContextUserData();
  const [Ids, setIds] = useState({
    pivotNum: 0
  })


  useEffect(() => {
    const { "user-pivot-num": pivot_num } =
      parseCookies();
    setIds({
      pivotNum: pivot.pivot_num || Number(pivot_num)
    })

  }, []);





  return (
    <S.Container>
      <Header
        text={`Editando agendamento do Pivô ${Ids.pivotNum}`}

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
