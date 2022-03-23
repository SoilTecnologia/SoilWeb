import { useContextIntentsData } from "hooks/useContextIntentData";
import Intent from "utils/models/intent";
import IntentSelectionButtons from "../IntentSelectionButtons";
import IntentsInlineContainer from "../IntentsInlineContainer";
import PercentComponent from "../PercentComponent";
import * as S from "./styles";

type IntentValue = Boolean | null;
type IntentType = 'power' | 'direction' | 'water';

const IntentManager = () => {
  const { intents, setIntents } = useContextIntentsData()

  const handleIntentStateChange = (value: IntentValue, type: IntentType) => {
    if (type == 'direction' && value != null && intents) {
      if (value == true) {
        intents[`${type}`] = 'CLOCKWISE'
      } else if (value === false) {
        intents[`${type}`] = 'ANTI_CLOCKWISE'
      }
    } else {
      intents[`${type}`] = value
    }
  }


  return (
    <S.Container>
      <S.IntentWrapper>

        <IntentsInlineContainer
          intentName="LIGA/DESLIGA"
        >
          <IntentSelectionButtons
            type="power"
            handleIntentState={(value: IntentValue, type: IntentType) => handleIntentStateChange(value, type)}
          />
        </IntentsInlineContainer>

        <IntentsInlineContainer
          intentName="SENTIDO"
        >
          <IntentSelectionButtons
            type="direction"
            handleIntentState={(value: IntentValue, type: IntentType) => handleIntentStateChange(value, type)}
          />
        </IntentsInlineContainer>

      </S.IntentWrapper>

      <S.IntentWrapper>

        <IntentsInlineContainer
          intentName="ÁGUA"
        >
          <IntentSelectionButtons
            type="water"
            handleIntentState={(value: IntentValue, type: IntentType) => handleIntentStateChange(value, type)}
          />
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
