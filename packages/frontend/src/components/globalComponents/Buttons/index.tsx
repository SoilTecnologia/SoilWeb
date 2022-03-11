import * as S from "./styles";

type ButtonProps = {
  callbackSendEvent: () => void;
  text: string;
};
const Buttons = ({ text, callbackSendEvent }: ButtonProps) => (
  <S.Container onClick={callbackSendEvent}>{text}</S.Container>
);

export default Buttons;
