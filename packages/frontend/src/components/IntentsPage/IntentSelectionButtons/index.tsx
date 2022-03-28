import { useEffect, useState } from "react";
import * as S from "./styles";
import Image from "next/image";

import OnIcon from "../../../../public/icons/Ligar.png"
import OffIcon from "../../../../public/icons/Parar.png"

import WaterOnIcon from "../../../../public/icons/Com_agua.png"
import WaterOffIcon from "../../../../public/icons/Sem_agua.png"

import ClockwiseIcon from "../../../../public/icons/Sentido_horario.png"
import AntiClockwiseIcon from "../../../../public/icons/Sentido_antihorario.png"
import { useContextIntentsData } from "hooks/useContextIntentData";

type IntentValue = Boolean | null;
type IntentType = 'power' | 'direction' | 'water'

type IntentSelectionButtonsProps = {
  type: IntentType,

}

const IntentSelectionButtons = ({ type }: IntentSelectionButtonsProps) => {
  const { intents, setIntents } = useContextIntentsData()

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
  const handleIntentStateChange = (value: IntentValue) => {
    if (type == 'direction' && value != null && intents) {
      if (value == true) {
        setIntents(prevState => ({ ...prevState, [`${type}`]: 'CLOCKWISE' }))
      } else if (value === false) {
        setIntents(prevState => ({ ...prevState, [`${type}`]: 'ANTI_CLOCKWISE' }))
      }
    } else {
      setIntents(prevState => ({ ...prevState, [`${type}`]: value }))
    }
  }

  const firstIcon = firstIconSelector()
  const secondIcon = secondIconSelector();

  const statesSelector = () => {

    if (intents[`${type}`] == null) {
      return (
        <>
          <S.InicialState onClick={() => { handleIntentStateChange(true) }}>
            <Image
              src={firstIcon}
            />

          </S.InicialState>
          <S.InicialState onClick={() => { handleIntentStateChange(false) }} >
            <Image
              src={secondIcon}
            />
          </S.InicialState>
        </>

      )
    } else if (intents[`${type}`] == true || intents[`${type}`] == 'CLOCKWISE') {
      return (
        <>
          <S.SelectedIntent onClick={() => { handleIntentStateChange(null) }}>
            <Image
              src={firstIcon}
            />

          </S.SelectedIntent>
          <S.UnselectedIntent onClick={() => { handleIntentStateChange(false) }} >
            <Image
              src={secondIcon}
            />
          </S.UnselectedIntent>
        </>
      )

    } else {
      return (
        <>
          <S.UnselectedIntent onClick={() => { handleIntentStateChange(true) }}>

            <Image
              src={firstIcon}
            />
          </S.UnselectedIntent>

          <S.SelectedIntent onClick={() => { handleIntentStateChange(null) }} >
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
