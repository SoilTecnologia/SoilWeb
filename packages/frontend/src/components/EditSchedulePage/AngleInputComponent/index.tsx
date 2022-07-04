import { useContextScheduleData } from "hooks/useContextScheduleData";
import { useState } from "react";
import * as S from "./styles";

const AngleInputComponent = () => {
  const { editingSchedule, editingScheduleType, setEditingSchedule } = useContextScheduleData()

  const [startAngle, setStartAngle] = useState(!editingSchedule.is_return ? editingSchedule.start_angle : 0)

  const [endAngle, setEndAngle] = useState(editingSchedule.end_angle)

  const handleSetStartAngle = (value: number) => {
    setStartAngle(value)
    setEditingSchedule(prevState => ({ ...prevState, ['start_angle']: value }))
  }

  const handleSetEndAngle = (value: number) => {
    setEndAngle(value)
    setEditingSchedule(prevState => ({ ...prevState, ['end_angle']: value }))
  }


  return (
    <S.Container>
      <S.Header>
        Ângulo
      </S.Header>
      <S.RowAlign>
        {!editingSchedule.is_return && (
          <S.Wrapper>
            <S.Text>Inicial: </S.Text>
            <S.AngleInput
              type={'number'}
              value={`${startAngle}`}
              onChange={(e) => handleSetStartAngle(parseInt(e.target.value))}
              placeholder="Ângulo inicial"
              min={0}
              max={360}
              pattern="[0-9]"
            />
            <S.Text>°</S.Text>
          </S.Wrapper>
        )}
        <S.Wrapper>
          <S.Text>Final: </S.Text>
          <S.AngleInput
            type={'number'}
            value={`${endAngle}`}
            onChange={(e) => handleSetEndAngle(parseInt(e.target.value))}
            placeholder="Ângulo final"
            min={0}
            max={360}
            pattern="[0-9]"
          />
          <S.Text>°</S.Text>
        </S.Wrapper>


      </S.RowAlign>
    </S.Container>
  )
};

export default AngleInputComponent;
