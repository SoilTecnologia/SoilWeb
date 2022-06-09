import IntentManager from "../IntentManager";
import SendAndCancelButton from "../SendAndCancelButton";
import Map, { Layer, Source } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import * as S from "./styles";
import { useContextUserData } from "hooks/useContextUserData";
import theme from "styles/theme";
import { useState } from "react";

const IntentBlock = () => {
  const { farm, pivot } = useContextUserData();
  const [scheduleType, setScheduleType] = useState('')


  const stateSelector = () => {
    if (pivot.connection) {
      if (pivot.power) {
        if (pivot.water) return `${theme.colors.wet}`;
        return `${theme.colors.dry}`;
      }
      return `${theme.colors.off}`;
    }
    return `${theme.colors.offline}`;
  };

  const toggleState = (type: string) => {
    if (scheduleType === type) {
      setScheduleType('')
    } else {
      setScheduleType(type)
    }
  }


  return (
    <S.Container>
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
        <SendAndCancelButton />
      </S.IntentContainer>



    </S.Container>
  );
};

export default IntentBlock;
