import { useContextScheduleData } from "hooks/useContextScheduleData";
import AngleInputComponent from "../AngleInputComponent";
import DateInputComponent from "../DateInputComponent";
import * as S from "./styles";


const ScheduleFormComponent = () => {
  const { editingScheduleType } = useContextScheduleData()

  const selectRenderInputs = () => {
    if (editingScheduleType === 'StopAngle') {
      return (
        <S.Container>
          <DateInputComponent />
          <AngleInputComponent />
        </S.Container>
      )
    }
    else if (editingScheduleType === 'AutoReturn') {
      return (
        <S.Container>
          <DateInputComponent />
          <AngleInputComponent />
        </S.Container>
      )
    }
    else if (editingScheduleType === 'Complete') {
      return (
        <S.Container>
          <DateInputComponent />
        </S.Container>
      )
    }
    else if (editingScheduleType === 'EasyStop') {
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
