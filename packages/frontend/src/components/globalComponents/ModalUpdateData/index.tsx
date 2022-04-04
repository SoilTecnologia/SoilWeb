import * as S from "./styles";

type modalOptionsProps = {
  children: React.ReactNode;
  closeModal: () => void;
  background?: string;
};

const ModalUpdateData = ({
  children,
  closeModal,
  background,
}: modalOptionsProps) => (
  <S.Container>
    <S.ContentDataUser background={background}>
      {" "}
      <S.IconClosed onClick={closeModal} />
      {children}
    </S.ContentDataUser>
  </S.Container>
);

export default ModalUpdateData;
