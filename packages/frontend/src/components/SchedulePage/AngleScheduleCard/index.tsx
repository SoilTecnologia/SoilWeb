import { AngleSchedule } from "utils/models/schedulings";
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
import Image from "next/image";
import { useContextActionCrud } from "hooks/useActionsCrud";
import { useContextScheduleData } from "hooks/useContextScheduleData";
import Router from "next/router";


type PropsProvider = {
  schedule: AngleSchedule;
}

const AngleScheduleCard = (props: PropsProvider) => {
  const { schedule } = props;
  const { angleScheduleList, setAngleScheduleList,setEditingSchedule,setEditingScheduleType } = useContextScheduleData()
  const { deleteAngleSchedule, getAngleSchedulings } = useContextActionCrud()

  const formatDate = (date: string | any) => {
    const [dates, hours] = date.split(' ')
    const [hour, min, sec] = hours.split(':')
    return `${dates} as ${hour}:${min}`;
  };

  const handleDeleteSchedule = async () => {
    await deleteAngleSchedule(schedule.scheduling_angle_id)
      .then((response) => {
        if (response) {
          getAngleSchedulings(schedule.pivot_id).then(() => {
            const newSchedulesList = angleScheduleList.filter(schedules => schedules.scheduling_angle_id != schedule.scheduling_angle_id)
            setAngleScheduleList(newSchedulesList)
          })
        }
      })
  }
  const handleEditSchedule = () => {
    setEditingSchedule(schedule)
    if(schedule.is_return){
      setEditingScheduleType('AutoReturn')
    }else{
      setEditingScheduleType('StopAngle')
    }

    Router.push(`edit_schedule`)
  }

  return (
    <S.Card>
      {schedule.is_return ? (
        <S.HeaderText>Retorno Automático</S.HeaderText>
      ) : <S.HeaderText>Parada por Posição</S.HeaderText>}

      <S.GlobalWrapper>
        <S.StatusWrapper>
          {!schedule.is_return && (
            <S.Wrapper>
              <S.Text>Inicio: {formatDate(schedule.start_timestamp)}</S.Text>

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
              <S.Text>Angulo Inicial: {schedule.start_angle}</S.Text>
            </S.Wrapper>
          )}
          <S.Wrapper>
            {schedule.is_return && (
              <S.Text>Início: {formatDate(schedule.start_timestamp)}</S.Text>
            )}

            <S.Text>Angulo Final: {schedule.end_angle}</S.Text>
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
            onClick={() => handleEditSchedule()}
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

export default AngleScheduleCard;
