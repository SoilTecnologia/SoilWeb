import { useContextActionCrud } from "hooks/useActionsCrud";
import { useContextUserData } from "hooks/useContextUserData";
import { useState } from "react";
import { AngleSchedule } from "utils/models/schedulings";
import AngleScheduleCard from "../AngleScheduleCard";
import * as S from "./styles";

const CollapsibleAngleScheduleList = () => {
  const { pivot } = useContextUserData()
  const { getAngleSchedulings } = useContextActionCrud()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [scheduleList, setScheduleList] = useState([])


  const loadSchedules = () => {
    if (isCollapsed) {
      setIsCollapsed(false)
    } else {
      getAngleSchedulings(pivot.pivot_id)
        .then((response) => {
          setScheduleList(response)
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
          {scheduleList.map((schedule: AngleSchedule) => (<AngleScheduleCard schedule={schedule} />))}
        </S.ScheduleListWrapper>
      )
      }
    </S.Container>
  )
};

export default CollapsibleAngleScheduleList;
