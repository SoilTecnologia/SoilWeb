import { useContextIntentsData } from "hooks/useContextIntentData";
import Intent from "utils/models/intent";
import IntentSelectionButtons from "../IntentSelectionButtons";
import IntentsInlineContainer from "../IntentsInlineContainer";
import PercentComponent from "../PercentComponent";
import * as S from "./styles";


const IntentManager = () => {

  return (
    <S.Container>
      <S.IntentWrapper>

        <IntentsInlineContainer
          intentName="LIGA/DESLIGA"
        >
          <IntentSelectionButtons type="power" />
        </IntentsInlineContainer>

        <IntentsInlineContainer
          intentName="SENTIDO"
        >
          <IntentSelectionButtons type="direction" />
        </IntentsInlineContainer>

      </S.IntentWrapper>

      <S.IntentWrapper>

        <IntentsInlineContainer
          intentName="ÁGUA"
        >
          <IntentSelectionButtons type="water" />
        </IntentsInlineContainer>

        <IntentsInlineContainer
          intentName="PERCENTÍMETRO"
        >
          <PercentComponent />
        </IntentsInlineContainer>

      </S.IntentWrapper>
    </S.Container>

  )
};

export default IntentManager;
