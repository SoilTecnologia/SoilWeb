import { useContextScheduleData } from "hooks/useContextScheduleData";
import { useState } from "react";
import * as S from "./styles";

const AngleInputComponent = () => {
  const { setNewAngleSchedule } = useContextScheduleData()

  const [startAngle, setStartAngle] = useState(0)
  const [endAngle, setEndAngle] = useState(0)

  const handleSetStartAngle = (value: number) => {
    setStartAngle(value)
    setNewAngleSchedule(prevState => ({ ...prevState, ['start_angle']: value }))
  }

  const handleSetEndAngle = (value: number) => {
    setEndAngle(value)
    setNewAngleSchedule(prevState => ({ ...prevState, ['end_angle']: value }))
  }


  return (
    <S.Container>
      <S.Header>
        Ângulo
      </S.Header>
      <S.RowAlign>

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
