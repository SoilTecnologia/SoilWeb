import IntentManager from "../IntentManager";
import SendAndCancelButton from "../SendAndCancelButton";
import * as S from "./styles";

const IntentBlock = () => {

  return (
    <S.Container>

      <S.MapContainer>
        <S.Map>

        </S.Map>
        <S.CaptionContainer>

        </S.CaptionContainer>
      </S.MapContainer>

      <S.IntentContainer>
        <IntentManager />
        <SendAndCancelButton />
      </S.IntentContainer>

    </S.Container>
  )

};

export default IntentBlock;
