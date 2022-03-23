import { useState } from "react";
import * as S from "./styles";
import Image from "next/image";

import OnIcon from "../../../../public/icons/Ligar.png"
import OffIcon from "../../../../public/icons/Parar.png"

import WaterOnIcon from "../../../../public/icons/Com_agua.png"
import WaterOffIcon from "../../../../public/icons/Sem_agua.png"

import ClockwiseIcon from "../../../../public/icons/Sentido_horario.png"
import AntiClockwiseIcon from "../../../../public/icons/Sentido_antihorario.png"

type IntentValue = Boolean | null;
type IntentType = 'power' | 'direction' | 'water'

type IntentSelectionButtonsProps = {
  type: IntentType,
  handleIntentState: (value: IntentValue, type: IntentType) => void
}

const IntentSelectionButtons = ({ type, handleIntentState }: IntentSelectionButtonsProps) => {
  const [state, setState] = useState<Boolean | null>(null)


  const firstIconSelector = () => (
    (type === "power") ? OnIcon :
      (type === "direction") ? ClockwiseIcon :
        WaterOnIcon

  )
  const secondIconSelector = () => (
    (type === "power") ? OffIcon :
      (type === "direction") ? AntiClockwiseIcon :
        WaterOffIcon
  )

  const firstIcon = firstIconSelector()
  const secondIcon = secondIconSelector();

  const statesSelector = () => {

    if (state == null) {
      return (
        <>
          <S.InicialState onClick={() => { setState(true), handleIntentState(true, type) }}>
            <Image
              src={firstIcon}
            />

          </S.InicialState>
          <S.InicialState onClick={() => { setState(false), handleIntentState(false, type) }} >
            <Image
              src={secondIcon}
            />
          </S.InicialState>
        </>

      )
    } else if (state == true) {
      return (
        <>
          <S.SelectedIntent onClick={() => { setState(null), handleIntentState(null, type) }}>
            <Image
              src={firstIcon}
            />

          </S.SelectedIntent>
          <S.UnselectedIntent onClick={() => { setState(false), handleIntentState(false, type) }} >
            <Image
              src={secondIcon}
            />
          </S.UnselectedIntent>
        </>
      )

    } else {
      return (
        <>
          <S.UnselectedIntent onClick={() => { setState(true), handleIntentState(true, type) }}>

            <Image
              src={firstIcon}
            />
          </S.UnselectedIntent>

          <S.SelectedIntent onClick={() => { setState(null), handleIntentState(null, type) }} >
            <Image
              src={secondIcon}
            />
          </S.SelectedIntent>
        </>

      )
    }
  }




  return (
    <S.Container>
      {statesSelector()}
    </S.Container>


  )

};

export default IntentSelectionButtons;
