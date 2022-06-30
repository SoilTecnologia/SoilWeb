import { useContextScheduleData } from "hooks/useContextScheduleData";
import AngleInputComponent from "../AngleInputComponent";
import DateInputComponent from "../DateInputComponent";
import * as S from "./styles";


const ScheduleFormComponent = () => {
  const { scheduleType } = useContextScheduleData()

  const selectRenderInputs = () => {
    if (scheduleType === 'StopAngle') {
      return (
        <S.Container>
          <DateInputComponent />
          <AngleInputComponent />
        </S.Container>
      )
    }
    else if (scheduleType === 'AutoReturn') {
      return (
        <S.Container>
          <DateInputComponent />
          <AngleInputComponent />
        </S.Container>
      )
    }
    else if (scheduleType === 'Complete') {
      return (
        <S.Container>
          <DateInputComponent />
        </S.Container>
      )
    }
    else if (scheduleType === 'EasyStop') {
      return (
        <S.Container>
          <DateInputComponent />
        </S.Container>
      )
    }
  }

  return (
    <S.Container>
      {selectRenderInputs()}

    </S.Container>
  )


};

export default ScheduleFormComponent;
