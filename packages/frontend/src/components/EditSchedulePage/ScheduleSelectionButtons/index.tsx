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
  const { editingScheduleType, editingSchedule, setEditingSchedule } = useContextScheduleData()

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
    if (editingScheduleType === 'StopAngle' || editingScheduleType === 'AutoReturn') {

      if (type == 'direction' && value != null && editingSchedule) {
        if (value == true) {
          setEditingSchedule(prevState => ({ ...prevState, [`${type}`]: 'CLOCKWISE' }))
        } else if (value === false) {
          setEditingSchedule(prevState => ({ ...prevState, [`${type}`]: 'ANTI_CLOCKWISE' }))
        }
      } else {
        setEditingSchedule(prevState => ({ ...prevState, [`${type}`]: value }))
      }
    }
    else if (editingScheduleType === 'Complete' || editingScheduleType === 'EasyStop') {
      if (type == 'direction' && value != null && editingSchedule) {
        if (value == true) {
          setEditingSchedule(prevState => ({ ...prevState, [`${type}`]: 'CLOCKWISE' }))
        } else if (value === false) {
          setEditingSchedule(prevState => ({ ...prevState, [`${type}`]: 'ANTI_CLOCKWISE' }))
        }
      } else {
        setEditingSchedule(prevState => ({ ...prevState, [`${type}`]: value }))
      }
    }
  }

  const firstIcon = firstIconSelector()
  const secondIcon = secondIconSelector();

  const angleStatesSelector = () => {

    if (editingSchedule[`${type}`] == null) {
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
    } else if (editingSchedule[`${type}`] == true || editingSchedule[`${type}`] == 'CLOCKWISE') {
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

    if (editingSchedule[`${type}`] == null) {
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
    } else if (editingSchedule[`${type}`] == true || editingSchedule[`${type}`] == 'CLOCKWISE') {
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
    if (editingScheduleType === 'StopAngle' || editingScheduleType === 'AutoReturn') {
      return angleStatesSelector()
    }
    else if (editingScheduleType === 'Complete' || editingScheduleType === 'EasyStop') {
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
