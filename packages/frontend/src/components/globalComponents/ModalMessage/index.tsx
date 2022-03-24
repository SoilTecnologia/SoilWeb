import { Dispatch, SetStateAction } from "react";
import Buttons from "../Buttons";
import * as S from "./styles";

type ModalProps = {
  children: React.ReactNode;
  alert: string;
  subAlert: string;
  txtButton: string;
  callbackButtonClick: Dispatch<SetStateAction<boolean>>;
  callbackOkDelete?: Dispatch<SetStateAction<boolean>>;
  textButtonConfirm?: string;
};

const ModalMessage = ({
  children,
  alert,
  subAlert,
  txtButton,
  callbackButtonClick,
  callbackOkDelete,
  textButtonConfirm,
}: ModalProps) => {
  const handleEventButtonClick = () => callbackButtonClick(false);

  return (
    <S.Container>
      <S.IconContent>{children}</S.IconContent>
      <S.ContentTextModalInfo>
        <S.AlertMessage>{alert}</S.AlertMessage>
        <S.SubAlert>{subAlert}</S.SubAlert>
      </S.ContentTextModalInfo>

      <S.ContentButtons>
        <Buttons text={txtButton} callbackSendEvent={handleEventButtonClick} />
        {callbackOkDelete && (
          <Buttons
            text={textButtonConfirm ? textButtonConfirm : "OK DELETAR"}
            callbackSendEvent={() => callbackOkDelete(false)}
          />
        )}
      </S.ContentButtons>
    </S.Container>
  );
};

export default ModalMessage;
