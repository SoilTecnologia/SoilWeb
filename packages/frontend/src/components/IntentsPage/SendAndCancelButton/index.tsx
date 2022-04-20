import { useContextActionCrud } from "hooks/useActionsCrud";
import { useContextIntentsData } from "hooks/useContextIntentData";
import { useContextUserData } from "hooks/useContextUserData";
import { useEffect, useState } from "react";
import * as S from "./styles";

const SendAndCancelButton = () => {
  const { pivot, setPivot } = useContextUserData()
  const { intents, setIntents } = useContextIntentsData()
  const { sendPivotIntent } = useContextActionCrud()
  const [inicialIntentsState, setInicialIntentsState] = useState(intents)


  const handleSendIntents = () => {
    if (pivot) {
      console.log(intents)
      sendPivotIntent(pivot.pivot_id, intents)
      setIntents(inicialIntentsState)
    }
  }

  return (

    intents != inicialIntentsState ?
      <S.Container>

        <S.ResetButton onClick={() => setIntents(inicialIntentsState)}>
          <S.ButtonText>
            Cancelar
          </S.ButtonText>

        </S.ResetButton>
        <S.ConfirmButton onClick={() => handleSendIntents()}>
          <S.ButtonText>
            Confirmar
          </S.ButtonText>

        </S.ConfirmButton>
      </S.Container>
      : null

  )
};

export default SendAndCancelButton;
