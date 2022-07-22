import ScheduleSelectionButtons from "../ScheduleSelectionButtons";
import IntentsInlineContainer from "../IntentsInlineContainer";
import PercentComponent from "../PercentComponent";
import * as S from "./styles";
import { useContextScheduleData } from "hooks/useContextScheduleData";




const IntentManager = () => {
  const { editingScheduleType } = useContextScheduleData()
  return (
    editingScheduleType !== '' && editingScheduleType !== 'EasyStop' && editingScheduleType !== 'AutoReturn' ?
      < S.Container >
        <S.IntentWrapper>

          {editingScheduleType !== 'StopAngle' && (<IntentsInlineContainer
            intentName="SENTIDO"
          >
            <ScheduleSelectionButtons type="direction" />
          </IntentsInlineContainer>)}

        </S.IntentWrapper>

        <S.IntentWrapper>

          <IntentsInlineContainer
            intentName="ÁGUA"
          >
            <ScheduleSelectionButtons type="water" />
          </IntentsInlineContainer>

          <IntentsInlineContainer
            intentName="PERCENTÍMETRO"
          >
            <PercentComponent />
          </IntentsInlineContainer>

        </S.IntentWrapper>
      </ S.Container >
      : <></>

  )
};

export default IntentManager;
