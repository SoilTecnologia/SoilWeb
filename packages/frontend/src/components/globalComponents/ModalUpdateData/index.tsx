import * as S from "./styles";

type modalOptionsProps = {
  children: React.ReactNode;
  closeModal: () => void;
};

const ModalUpdateData = ({ children, closeModal }: modalOptionsProps) => (
  <S.Container>
    <S.ContentDataUser>
      {" "}
      <S.IconClosed onClick={closeModal} />
      {children}
    </S.ContentDataUser>
  </S.Container>
);

export default ModalUpdateData;
