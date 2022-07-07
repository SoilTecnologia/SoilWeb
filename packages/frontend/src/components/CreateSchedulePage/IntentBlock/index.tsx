import { useEffect, useState } from "react";
import * as S from "./styles";
import IntentManager from "../IntentManager";
import "mapbox-gl/dist/mapbox-gl.css";
import { useContextAuth } from "hooks/useLoginAuth";
import { useContextUserData } from "hooks/useContextUserData";
import SendAndCancelButton from "../SendAndCancelButton";
import ScheduleFormComponent from "../ScheduleFormComponent";
import theme from "styles/theme";
import { useContextScheduleData } from "hooks/useContextScheduleData";

const IntentBlock = () => {
  const { user } = useContextAuth()
  const { pivot } = useContextUserData()
  const { scheduleType, setScheduleType, setNewAngleSchedule, setNewDateSchedule } = useContextScheduleData()



  const toggleState = (type: string | any) => {
    if (scheduleType === type) {
      setScheduleType('')
    } else {
      setScheduleType(type)
    }

    if (type === 'StopAngle' || type === 'AutoReturn') {
      if (type === 'StopAngle') {
        setNewAngleSchedule(prevState => ({ ...prevState, ['is_return']: false, ['power']: true }))
      }
      else {
        setNewAngleSchedule(prevState => ({ ...prevState, ['is_return']: true }))
      }
    }

    else if (type === 'Complete' || type === 'EasyStop') {
      if (type === 'Complete') {
        setNewDateSchedule(prevState => ({ ...prevState, ['is_stop']: false, ['power']: true  }))
      } else {
        setNewDateSchedule(prevState => ({ ...prevState, ['is_stop']: true }))
      }

    }
  }
  return (
    <S.Container>
      <S.MainRowAlign>
        <S.ScheduleTypeContainer >

          <S.HeaderText>
            Por Ângulo:
          </S.HeaderText>
          <S.RowAlign>

            <S.ScheduleTypeButton onClick={() => { toggleState('StopAngle') }}
              isSelected={scheduleType == '' ? true : scheduleType === 'StopAngle' ? true : false}>
              <S.ButtonText>
                Posição de Parada
              </S.ButtonText>
            </S.ScheduleTypeButton>


            <S.ScheduleTypeButton onClick={() => { toggleState('AutoReturn') }}
              isSelected={scheduleType == '' ? true : scheduleType === 'AutoReturn' ? true : false}>
              <S.ButtonText>
                Retorno Automático
              </S.ButtonText>

            </S.ScheduleTypeButton>

          </S.RowAlign>



          <ScheduleFormComponent />
        </S.ScheduleTypeContainer>


        <S.IntentContainer>
          <S.HeaderText>
            Por Data:
          </S.HeaderText>

          <S.RowAlign>

            <S.ScheduleTypeButton onClick={() => { toggleState('Complete') }}
              isSelected={scheduleType == '' ? true : scheduleType === 'Complete' ? true : false}>
              <S.ButtonText>
                Início e Fim
              </S.ButtonText>
            </S.ScheduleTypeButton>




            <S.ScheduleTypeButton onClick={() => { toggleState('EasyStop') }}
              isSelected={scheduleType == '' ? true : scheduleType === 'EasyStop' ? true : false}>
              <S.ButtonText>
                Desligamento Automático
              </S.ButtonText>
            </S.ScheduleTypeButton>

          </S.RowAlign>




          <IntentManager />



        </S.IntentContainer>


      </S.MainRowAlign>
      <SendAndCancelButton />
    </S.Container>
  );
};

export default IntentBlock;
