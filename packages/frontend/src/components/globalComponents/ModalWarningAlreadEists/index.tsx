import * as S from "./styles";

type modalProps = {
  closeModal: () => void;
  alert: string;
  subAlert: string;
};
const ModalWarningAlreadEists = ({
  closeModal,
  alert,
  subAlert,
}: modalProps) => (
  <S.ModalAlreaExists>
    <S.ContentTextModalInfo>
      <S.IconAttention />
      <S.IconClose onClick={closeModal} />

      <S.AlertMessage>{alert}</S.AlertMessage>
      <S.SubAlert>{subAlert}</S.SubAlert>
    </S.ContentTextModalInfo>
  </S.ModalAlreaExists>
);

export default ModalWarningAlreadEists;
