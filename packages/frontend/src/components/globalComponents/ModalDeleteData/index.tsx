import ModalMessage from "../ModalMessage";
import * as S from "./styles";
type modalDeleteProps = {
  alertLabel: string;
  callbackNotDelete: () => void;
  callbackDelete: () => void;
};
const ModalDeleteData = ({
  alertLabel,
  callbackNotDelete,
  callbackDelete,
}: modalDeleteProps) => (
  <S.ContentModal>
    <ModalMessage
      alert={alertLabel.toUpperCase()}
      subAlert="DESEJA CONTINUAR ?"
      txtButton="NÃO"
      callbackButtonClick={callbackNotDelete}
      callbackOkDelete={callbackDelete}
    >
      <S.IconAttention />
    </ModalMessage>
  </S.ContentModal>
);

export default ModalDeleteData;
