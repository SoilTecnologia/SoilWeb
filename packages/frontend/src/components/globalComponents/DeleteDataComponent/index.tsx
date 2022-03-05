import * as S from "./styles";

type DeleteDataProps = {
  okDelete: () => void;
  notDelete: () => void;
  label: string;
};
const DeleteDataComponent = ({
  okDelete,
  label,
  notDelete,
}: DeleteDataProps) => (
  <>
    <S.TextDeleteUser>DELETAR {label}</S.TextDeleteUser>
    <S.ContentOptionsDelete>
      <S.CancelDelete onClick={notDelete}>NÃO</S.CancelDelete>
      <S.ConfirmDelete onClick={okDelete}>SIM</S.ConfirmDelete>
    </S.ContentOptionsDelete>
  </>
);

export default DeleteDataComponent;
