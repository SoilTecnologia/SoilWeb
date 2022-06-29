
import { useContextActionCrud } from "hooks/useActionsCrud";
import { useContextScheduleData } from "hooks/useContextScheduleData";
import { useContextUserData } from "hooks/useContextUserData";
import { useEffect, useState } from "react";
import { DateSchedule } from "utils/models/schedulings";
import DateScheduleCard from "../DateScheduleCard";
import * as S from "./styles";



const CollapsibleDateScheduleList = () => {
  const { pivot } = useContextUserData()
  const { dateScheduleList, setDateScheduleList } = useContextScheduleData()
  const { getDateSchedulings } = useContextActionCrud()
  const [isCollapsed, setIsCollapsed] = useState(false)


  const loadSchedules = () => {
    if (isCollapsed) {
      setIsCollapsed(false)
    } else {
      getDateSchedulings(pivot.pivot_id)
        .then((response) => {
          setDateScheduleList(response)
          setIsCollapsed(true)
        })
    }
  }

  return (
    <S.Container>
      <S.ScheduleListButton onClick={() => loadSchedules()}>
        <S.Text>
          Agendamentos por Data
        </S.Text>
      </S.ScheduleListButton>
      {isCollapsed && (
        <S.ScheduleListWrapper>
          {dateScheduleList.map((schedule: DateSchedule) => (<DateScheduleCard schedule={schedule} />))}
        </S.ScheduleListWrapper>
      )
      }
    </S.Container>
  )
};

export default CollapsibleDateScheduleList;
