import { ReactChildren } from "react";
import * as S from "./styles";

type IntentsInlineContainerProps = {
  intentName: string;
  children?:React.ReactNode;
}

const IntentsInlineContainer = ({ intentName, children }: IntentsInlineContainerProps) => (
  <S.IntentsAlignment>

    <S.IntentWrapper>
      <S.IntentName>
        {intentName}:
      </S.IntentName>
        {children}
    </S.IntentWrapper>

  </S.IntentsAlignment>
);

export default IntentsInlineContainer;
