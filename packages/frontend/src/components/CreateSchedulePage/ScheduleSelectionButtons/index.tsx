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
import { useContextScheduleData } from "hooks/useContextScheduleData";

type IntentValue = Boolean | null;
type IntentType = 'power' | 'direction' | 'water'

type IntentSelectionButtonsProps = {
  type: IntentType,

}

const IntentSelectionButtons = ({ type }: IntentSelectionButtonsProps) => {
  const { scheduleType, newAngleSchedule, setNewAngleSchedule, newDateSchedule, setNewDateSchedule } = useContextScheduleData()
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
    if (scheduleType === 'StopAngle' || scheduleType === 'AutoReturn') {

      if (type == 'direction' && value != null && newAngleSchedule) {
        if (value == true) {
          setNewAngleSchedule(prevState => ({ ...prevState, [`${type}`]: 'CLOCKWISE' }))
        } else if (value === false) {
          setNewAngleSchedule(prevState => ({ ...prevState, [`${type}`]: 'ANTI_CLOCKWISE' }))
        }
      } else {
        setNewAngleSchedule(prevState => ({ ...prevState, [`${type}`]: value }))
      }
    }
    else if (scheduleType === 'Complete' || scheduleType === 'EasyStop') {
      if (type == 'direction' && value != null && newDateSchedule) {
        if (value == true) {
          setNewDateSchedule(prevState => ({ ...prevState, [`${type}`]: 'CLOCKWISE' }))
        } else if (value === false) {
          setNewDateSchedule(prevState => ({ ...prevState, [`${type}`]: 'ANTI_CLOCKWISE' }))
        }
      } else {
        setNewDateSchedule(prevState => ({ ...prevState, [`${type}`]: value }))
      }
    }
  }

  const firstIcon = firstIconSelector()
  const secondIcon = secondIconSelector();

  const angleStatesSelector = () => {

    if (newAngleSchedule[`${type}`] == null) {
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
    } else if (newAngleSchedule[`${type}`] == true || newAngleSchedule[`${type}`] == 'CLOCKWISE') {
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

  const dateStatesSelector = () => {

    if (newDateSchedule[`${type}`] == null) {
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
    } else if (newDateSchedule[`${type}`] == true || newDateSchedule[`${type}`] == 'CLOCKWISE') {
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

  const renderSelector = () => {
    if (scheduleType === 'StopAngle' || scheduleType === 'AutoReturn') {
      return angleStatesSelector()
    }
    else if (scheduleType === 'Complete' || scheduleType === 'EasyStop') {
      return dateStatesSelector()
    }
    return <></>
  }


  return (
    <S.Container>
      {renderSelector()}
    </S.Container>

  )

};

export default IntentSelectionButtons;
