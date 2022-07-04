import * as S from "./styles";
import { useContextActionCrud } from "hooks/useActionsCrud";
import { useContextScheduleData } from "hooks/useContextScheduleData";
import { useContextUserData } from "hooks/useContextUserData";
import { useEffect, useState } from "react";
import { AngleSchedule, DateSchedule } from "utils/models/schedulings";
import dayjs from "dayjs";
import router from "next/router";

const SendAndCancelButton = () => {
  const { pivot } = useContextUserData()
  const { editingScheduleType, setEditingScheduleType, editingSchedule, setEditingSchedule, } = useContextScheduleData()
  const { editAngleSchedule, editDateSchedule, getDateSchedulings, getAngleSchedulings } = useContextActionCrud()
  const [inicialState, setInicialState] = useState(editingSchedule)

  useEffect(() => {
    setInicialState(editingSchedule)
    formatDate(editingSchedule.start_timestamp, 'start')
    formatDate(editingSchedule.end_timestamp, 'end')
  }, [])

  const resetSchedule = () => {
    setEditingSchedule(inicialState)
    setEditingScheduleType('')
  }
  function formatDate(date: any, control: string) {
    console.log('ainda n editou', date, control)
    if ((typeof date == 'string')) {
      const [dates, hours] = date.split(" ")
      const [day, month, year] = dates.split('/')
      const [hour, min, sec] = hours.split(":")
      const preFormat = `${year}-${month}-${day}T${hour}:${min}:00.000Z`
      const formated = dayjs(preFormat).format(`ddd MMM D YYYY ${hour}:${min}:00 [GMT]ZZ`)
      const timestamp = new Date(formated).getTime()
      console.log('editou', date, control, timestamp)
      if (control == 'start') {
        setEditingSchedule(prevState => ({ ...prevState, [`start_timestamp`]: timestamp }))
      } else {
        setEditingSchedule(prevState => ({ ...prevState, [`end_timestamp`]: timestamp }))
      }
      return true
    }
  }

  const handleSendIntents = () => {
    formatDate(editingSchedule.start_timestamp, 'start')
    formatDate(editingSchedule.end_timestamp, 'end')
    if (typeof editingSchedule.start_timestamp !== 'string' && typeof editingSchedule.start_timestamp !== 'string') {
      if (editingScheduleType === 'StopAngle' || editingScheduleType === 'AutoReturn') {
        editAngleSchedule(editingSchedule as AngleSchedule).then(() => {
          getAngleSchedulings(pivot.pivot_id)
          router.push('schedules')
        })
      } else if (editingScheduleType === 'Complete' || editingScheduleType === 'EasyStop') {
        editDateSchedule(editingSchedule as DateSchedule).then(() => {
          getDateSchedulings(pivot.pivot_id)
          router.push('schedules')
        })
      }
    }

  }

  return (
    <>
      {(editingSchedule != inicialState) && (
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
      )}
    </>
  )
};

export default SendAndCancelButton;
