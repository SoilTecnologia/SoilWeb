import { useState } from "react";
import { useContextIntentsData } from "hooks/useContextIntentData";
import * as S from "./styles";
import { useContextScheduleData } from "hooks/useContextScheduleData";

const PercentComponent = () => {
  const { scheduleType, setNewAngleSchedule, setNewDateSchedule } = useContextScheduleData()
  const [percentimeter, setPercentimeter] = useState(0)


  const onChangeHandler = async (value: number) => {
    if (scheduleType) {
      if (value > 0 && value < 100) {
        setPercentimeter(value)
        if (scheduleType == 'StopAngle' || scheduleType == 'AutoReturn') {
          setNewAngleSchedule(prevState => ({ ...prevState, ['percentimeter']: value }))

        }
        else if (scheduleType == 'Complete' || scheduleType == 'EasyStop') {
          setNewDateSchedule(prevState => ({ ...prevState, ['percentimeter']: value }))
        }

      } else {
        setPercentimeter(0)
        if (scheduleType == 'StopAngle' || scheduleType == 'AutoReturn') {
          setNewAngleSchedule(prevState => ({ ...prevState, ['percentimeter']: 0 }))

        }
        else if (scheduleType == 'Complete' || scheduleType == 'EasyStop') {
          setNewDateSchedule(prevState => ({ ...prevState, ['percentimeter']: 0 }))
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
