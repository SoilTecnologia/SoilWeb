import * as S from "./styles";
import { Dispatch, SetStateAction } from "react";
import Buttons from "../Buttons";

type ModalProps = {
  children: React.ReactNode;
  alert: string;
  subAlert: string;
  txtButton: string;
  callbackButtonClick: Dispatch<SetStateAction<boolean>>;
};

const ModalMessage = ({
  children,
  alert,
  subAlert,
  txtButton,
  callbackButtonClick,
}: ModalProps) => {
  const handleEventButtonClick = () => callbackButtonClick(false);

  return (
    <S.Container>
      <S.IconContent>{children}</S.IconContent>
      <S.ContentTextModalInfo>
        <S.AlertMessage>{alert}</S.AlertMessage>
        <S.SubAlert>{subAlert}</S.SubAlert>
      </S.ContentTextModalInfo>

      <Buttons text={txtButton} callbackSendEvent={handleEventButtonClick} />
    </S.Container>
  );
};

export default ModalMessage;
