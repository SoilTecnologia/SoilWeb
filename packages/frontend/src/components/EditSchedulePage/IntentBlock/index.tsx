import * as S from "./styles";
import IntentManager from "../IntentManager";
import SendAndCancelButton from "../SendAndCancelButton";
import ScheduleFormComponent from "../ScheduleFormComponent";
import { useContextScheduleData } from "hooks/useContextScheduleData";

const IntentBlock = () => {
  const { setEditingSchedule, editingScheduleType, setEditingScheduleType } = useContextScheduleData()



  const toggleState = (type: string | any) => {
    setEditingScheduleType(type)
    if (type === 'StopAngle' || type === 'AutoReturn') {
      if (type === 'StopAngle') {
        setEditingSchedule(prevState => ({ ...prevState, ['is_return']: false }))
      }
      else {
        setEditingSchedule(prevState => ({ ...prevState, ['is_return']: true }))
      }
    }

    else if (type === 'Complete' || type === 'EasyStop') {
      if (type === 'Complete') {
        setEditingSchedule(prevState => ({ ...prevState, ['is_stop']: false }))
      } else {
        setEditingSchedule(prevState => ({ ...prevState, ['is_stop']: true }))
      }

    }
  }
  const dateScheduleEditing = () => {
    return (
      <S.MainRowAlign>
        <S.ScheduleTypeContainer >
          <ScheduleFormComponent />
        </S.ScheduleTypeContainer>

        <S.IntentContainer>
          <S.HeaderText>
            Por Data:
          </S.HeaderText>

          <S.RowAlign>

            <S.ScheduleTypeButton onClick={() => { toggleState('Complete') }}
              isSelected={editingScheduleType == '' ? true : editingScheduleType === 'Complete' ? true : false}>
              <S.ButtonText>
                Início e Fim
              </S.ButtonText>
            </S.ScheduleTypeButton>

            <S.ScheduleTypeButton onClick={() => { toggleState('EasyStop') }}
              isSelected={editingScheduleType == '' ? true : editingScheduleType === 'EasyStop' ? true : false}>
              <S.ButtonText>
                Desligamento Automático
              </S.ButtonText>
            </S.ScheduleTypeButton>

          </S.RowAlign>

          <IntentManager />

        </S.IntentContainer>
      </S.MainRowAlign >

    )
  }
  const angleScheduleEditing = () => {
    return (
      <S.MainRowAlign>
        <S.ScheduleTypeContainer >


          <S.HeaderText>
            Por Ângulo:
          </S.HeaderText>
          <S.RowAlign>

            <S.ScheduleTypeButton onClick={() => { toggleState('StopAngle') }}
              isSelected={editingScheduleType == '' ? true : editingScheduleType === 'StopAngle' ? true : false}>
              <S.ButtonText>
                Posição de Parada
              </S.ButtonText>
            </S.ScheduleTypeButton>


            <S.ScheduleTypeButton onClick={() => { toggleState('AutoReturn') }}
              isSelected={editingScheduleType == '' ? true : editingScheduleType === 'AutoReturn' ? true : false}>
              <S.ButtonText>
                Retorno Automático
              </S.ButtonText>

            </S.ScheduleTypeButton>

          </S.RowAlign>



          <ScheduleFormComponent />
        </S.ScheduleTypeContainer>


        <S.IntentContainer>
          <IntentManager />
        </S.IntentContainer>

      </S.MainRowAlign>


    )
  }
  return (
    <S.Container>
      {editingScheduleType === 'StopAngle' || editingScheduleType === 'AutoReturn' ?
        (angleScheduleEditing())
        :
        (dateScheduleEditing())
      }
      <SendAndCancelButton />
    </S.Container>
  );
};

export default IntentBlock;
