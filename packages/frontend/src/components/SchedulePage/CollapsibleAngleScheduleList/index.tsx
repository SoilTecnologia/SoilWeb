import { useContextActionCrud } from "hooks/useActionsCrud";
import { useContextScheduleData } from "hooks/useContextScheduleData";
import { useContextUserData } from "hooks/useContextUserData";
import { useState } from "react";
import { AngleSchedule } from "utils/models/schedulings";
import AngleScheduleCard from "../AngleScheduleCard";
import * as S from "./styles";

type PropsProvider = {
  pivotId: string
}


const CollapsibleAngleScheduleList = (props:PropsProvider) => {
  const { pivotId } = props
  const { angleScheduleList, setAngleScheduleList } = useContextScheduleData()
  const { getAngleSchedulings } = useContextActionCrud()
  const [isCollapsed, setIsCollapsed] = useState(false)


  const loadSchedules = () => {
    if (isCollapsed) {
      setIsCollapsed(false)
    } else {
      getAngleSchedulings(pivotId)
        .then((response) => {
          setAngleScheduleList(response)
          setIsCollapsed(true)
        })
    }
  }

  return (
    <S.Container>
      <S.ScheduleListButton onClick={() => loadSchedules()}>
        <S.Text>
          Agendamentos por Angulo
        </S.Text>
      </S.ScheduleListButton>
      {isCollapsed && (
        JSON.stringify(angleScheduleList) != JSON.stringify([]) ? (
          <S.ScheduleListWrapper>
            {angleScheduleList.map((schedule: AngleSchedule) => (<AngleScheduleCard key={schedule.scheduling_angle_id} schedule={schedule} />))}
          </S.ScheduleListWrapper>
        ) :
          <S.EmptyText>
            Nenhum agendamento por ângulo foi encontrado!
          </S.EmptyText>
      )
      }
    </S.Container>
  )
};

export default CollapsibleAngleScheduleList;
