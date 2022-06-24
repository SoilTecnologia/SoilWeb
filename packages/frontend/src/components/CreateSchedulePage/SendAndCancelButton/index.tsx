import { useContextActionCrud } from "hooks/useActionsCrud";
import { useContextScheduleData } from "hooks/useContextScheduleData";
import { useContextUserData } from "hooks/useContextUserData";
import { useEffect, useState } from "react";
import Schedule from "utils/models/schedulings";
import * as S from "./styles";

const SendAndCancelButton = () => {
  const { scheduleType, setScheduleType, newAngleSchedule, setNewAngleSchedule, newDateSchedule, setNewDateSchedule } = useContextScheduleData()
  const { pivot } = useContextUserData()
  const { createNewAngleSchedule, createNewDateSchedule, getDateSchedulings, getAngleSchedulings } = useContextActionCrud()
  const [inicialAngleIntentsState, setAngleInicialIntentsState] = useState({} as Schedule)
  const [inicialDateIntentsState, setDateInicialIntentsState] = useState({} as Schedule)
  useEffect(() => {
    setAngleInicialIntentsState({
      pivot_id: '',
      author: '',
      is_return: null,
      power: null,
      water: null,
      direction: null,
      percentimeter: 0,
      start_angle: 0,
      end_angle: 0,
      start_timestamp: new Date(),
      timestamp: new Date().getTime()

    })
    setDateInicialIntentsState({
      pivot_id: '',
      author: '',
      is_stop: null,
      power: null,
      water: null,
      direction: null,
      percentimeter: 0,
      start_timestamp: new Date(),
      end_timestamp: new Date(),
      timestamp: new Date().getTime()
    })



  }, [scheduleType])

  const resetSchedule = () => {
    setNewAngleSchedule(inicialAngleIntentsState)
    setNewDateSchedule(inicialDateIntentsState)
    setScheduleType('')
  }

  const handleSendIntents = () => {
    console.log('Angle:', newAngleSchedule, 'Date:', newDateSchedule)
    if (scheduleType === 'StopAngle' || scheduleType === 'AutoReturn') {
      createNewAngleSchedule(newAngleSchedule).then(() => {
        getAngleSchedulings(pivot.pivot_id)

        resetSchedule()
      })
    } else if (scheduleType === 'Complete' || scheduleType === 'EasyStop') {
      createNewDateSchedule(newDateSchedule).then(() => {
        getDateSchedulings(pivot.pivot_id)
        resetSchedule()
      })
    }

  }

  const renderCondition = () => {
    if ((scheduleType === 'StopAngle' || scheduleType === 'AutoReturn') && newAngleSchedule != inicialAngleIntentsState) {
      return (
        <S.Container>

          <S.ResetButton onClick={() => resetSchedule()}>
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
      )
    } else if ((scheduleType === 'Complete' || scheduleType === 'EasyStop') && newDateSchedule !== inicialDateIntentsState) {
      return (
        <S.Container>

          <S.ResetButton onClick={() => resetSchedule()}>
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
      )
    }
  }
  return (
    <>
      {renderCondition()}
    </>
  )
};

export default SendAndCancelButton;
