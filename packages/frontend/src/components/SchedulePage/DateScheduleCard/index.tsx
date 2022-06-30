import Image from "next/image";
import { DateSchedule } from "utils/models/schedulings";
import * as S from "./styles";

import OnIcon from "../../../../public/icons/Ligar.png";
import OffIcon from "../../../../public/icons/Parar.png";
import WaterOnIcon from "../../../../public/icons/Com_agua.png";
import WaterOffIcon from "../../../../public/icons/Sem_agua.png";
import ErrorIcon from "../../../../public/icons/Exclamação.png";
import ClockwiseIcon from "../../../../public/icons/Sentido_horario.png";
import AntiClockwiseIcon from "../../../../public/icons/Sentido_antihorario.png";
import { useState } from "react";
import { addHours, format } from "date-fns";
import { useContextScheduleData } from "hooks/useContextScheduleData";
import { useContextActionCrud } from "hooks/useActionsCrud";

type PropsProvider = {
  schedule: DateSchedule
}

const DateScheduleCard = (props: PropsProvider) => {
  const { schedule } = props
  const { dateScheduleList, setDateScheduleList } = useContextScheduleData()
  const { deleteDateSchedule, getDateSchedulings } = useContextActionCrud()

  const formatDate = (date: string | Date) => {
    const dateString = format(addHours(new Date(date as Date), 3), 'dd/MM/yyyy  HH:mm');
    return dateString;
  };
  const handleDeleteSchedule = async () => {
    await deleteDateSchedule(schedule.scheduling_id)
      .then((response) => {
        if (response) {
          getDateSchedulings(schedule.pivot_id).then(() => {
            const newSchedulesList = dateScheduleList.filter(schedules => schedules.scheduling_id != schedule.scheduling_id)
            setDateScheduleList(newSchedulesList)
          })
        }
      })
  }

  return (
    <S.Card>
      {schedule.is_stop ? (
        <S.HeaderText>Desligamento Automático</S.HeaderText>
      ) : <S.HeaderText>Agendamento Completo</S.HeaderText>}

      <S.GlobalWrapper>
        <S.StatusWrapper>
          {!schedule.is_stop && (
            <S.Wrapper>
              <S.Text>Inicio: {formatDate(schedule.start_timestamp as Date)}</S.Text>

              <S.Status>
                <S.ImageContainer>
                  <Image layout="responsive" src={OnIcon} alt={"Ligado"} />
                </S.ImageContainer>
                <S.ImageContainer>
                  <Image
                    layout="responsive"
                    src={
                      schedule.direction == "CLOCKWISE"
                        ? ClockwiseIcon
                        : AntiClockwiseIcon
                    }
                    alt={
                      schedule.direction == "CLOCKWISE"
                        ? "Horário"
                        : "Anti Horário"
                    }
                  />
                </S.ImageContainer>
                <S.ImageContainer>
                  <Image
                    layout="responsive"
                    src={schedule.water ? WaterOnIcon : WaterOffIcon}
                    alt={schedule.water ? "Com Água" : "Sem Água"}
                  />
                </S.ImageContainer>
              </S.Status>
              <S.Text>Percentímetro: {schedule.percentimeter}%</S.Text>
            </S.Wrapper>
          )}
          <S.Wrapper>
            <S.Text>Término: {formatDate(schedule.end_timestamp as Date)}</S.Text>
            <S.Status>
              <S.ImageContainer>
                <Image layout="responsive" src={OffIcon} alt={"Desligado"} />
              </S.ImageContainer>
            </S.Status>
          </S.Wrapper>


        </S.StatusWrapper>

        <S.StatusWrapper>
          <S.DeleteButton
            onClick={() => handleDeleteSchedule()}
          >
            <S.DeleteIcon />
            <S.ButtonText>
              Excluir
            </S.ButtonText>
          </S.DeleteButton>
          <S.EditButton
          //onClick={() => setIsCollapsed(oldState => !oldState)}
          >
            <S.EditIcon />
            <S.EditButtonText>
              Editar
            </S.EditButtonText>
          </S.EditButton>

        </S.StatusWrapper>

      </S.GlobalWrapper>

    </S.Card >
  )
};

export default DateScheduleCard;
