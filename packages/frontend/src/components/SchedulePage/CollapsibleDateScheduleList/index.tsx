
import { useContextActionCrud } from "hooks/useActionsCrud";
import { useContextScheduleData } from "hooks/useContextScheduleData";
import { useContextUserData } from "hooks/useContextUserData";
import { useEffect, useState } from "react";
import { DateSchedule } from "utils/models/schedulings";
import DateScheduleCard from "../DateScheduleCard";
import * as S from "./styles";

type PropsProvider = {
  pivotId: string
}



const CollapsibleDateScheduleList = (props: PropsProvider) => {
  const { pivotId } = props
  const { dateScheduleList, setDateScheduleList } = useContextScheduleData()
  const { getDateSchedulings } = useContextActionCrud()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const loadSchedules = () => {
    if (isCollapsed) {
      setIsCollapsed(false)
    } else {
      getDateSchedulings(pivotId)
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
        JSON.stringify(dateScheduleList) != JSON.stringify([]) ? (
          <S.ScheduleListWrapper>
            {dateScheduleList.map((schedule: DateSchedule) => (<DateScheduleCard key={schedule.scheduling_id} schedule={schedule} />))}
          </S.ScheduleListWrapper>
        ) :
          <S.EmptyText>
            Nenhum agendamento por data foi encontrado!
          </S.EmptyText>
      )
      }
    </S.Container>
  )
};

export default CollapsibleDateScheduleList;
