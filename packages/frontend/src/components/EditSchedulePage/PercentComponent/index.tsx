import { useState } from "react";

import * as S from "./styles";
import { useContextScheduleData } from "hooks/useContextScheduleData";

const PercentComponent = () => {
  const { editingScheduleType, editingSchedule, setEditingSchedule } = useContextScheduleData()
  const [percentimeter, setPercentimeter] = useState(editingSchedule.percentimeter)


  const onChangeHandler = async (value: number) => {
    if (editingScheduleType) {
      if (value > 0 && value < 100) {
        setPercentimeter(value)
        if (editingScheduleType == 'StopAngle' || editingScheduleType == 'AutoReturn') {
          setEditingSchedule(prevState => ({ ...prevState, ['percentimeter']: value }))

        }
        else if (editingScheduleType == 'Complete' || editingScheduleType == 'EasyStop') {
          setEditingSchedule(prevState => ({ ...prevState, ['percentimeter']: value }))
        }

      } else {
        setPercentimeter(0)
        if (editingScheduleType == 'StopAngle' || editingScheduleType == 'AutoReturn') {
          setEditingSchedule(prevState => ({ ...prevState, ['percentimeter']: 0 }))

        }
        else if (editingScheduleType == 'Complete' || editingScheduleType == 'EasyStop') {
          setEditingSchedule(prevState => ({ ...prevState, ['percentimeter']: 0 }))
        }
      }
    }
  };

  return (
    <S.Container>

      <S.PercentView>
        <S.PercentButtons
          onClick={() => {
            onChangeHandler(percentimeter - 5);
          }}
        >
          <S.PercentButtonText>-5</S.PercentButtonText>
        </S.PercentButtons>
        <S.PercentInput
          type={'number'}
          value={`${percentimeter}`}
          onChange={(e) => onChangeHandler(parseInt(e.target.value))}
          placeholder="Percentímetro"
          min={0}
          max={100}
          pattern="[0-9]"
        />

        <S.PercentButtons
          onClick={() => {
            onChangeHandler(percentimeter + 5);
          }}
        >
          <S.PercentButtonText>+5</S.PercentButtonText>
        </S.PercentButtons>
      </S.PercentView>
    </S.Container>
  )
};

export default PercentComponent;
