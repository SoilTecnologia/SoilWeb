import { useContextActionCrud } from "hooks/useActionsCrud";
import { useContextScheduleData } from "hooks/useContextScheduleData";
import { useContextUserData } from "hooks/useContextUserData";
import { useState } from "react";
import { AngleSchedule } from "utils/models/schedulings";
import AngleScheduleCard from "../AngleScheduleCard";
import * as S from "./styles";

const CollapsibleAngleScheduleList = () => {
  const { pivot } = useContextUserData()
  const { angleScheduleList, setAngleScheduleList } = useContextScheduleData()
  const { getAngleSchedulings } = useContextActionCrud()
  const [isCollapsed, setIsCollapsed] = useState(false)


  const loadSchedules = () => {
    if (isCollapsed) {
      setIsCollapsed(false)
    } else {
      getAngleSchedulings(pivot?.pivot_id)
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
        <S.ScheduleListWrapper>
          {angleScheduleList.map((schedule: AngleSchedule) => (<AngleScheduleCard schedule={schedule} />))}
        </S.ScheduleListWrapper>
      )
      }
    </S.Container>
  )
};

export default CollapsibleAngleScheduleList;
