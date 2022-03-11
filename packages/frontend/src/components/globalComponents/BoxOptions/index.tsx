/* eslint-disable @typescript-eslint/no-explicit-any */
import * as S from "./styles";

type BoxOptions = {
  modalVisible: boolean;
  setModalVisible: () => void;
  callbackUpdate: () => void;
  handleDelete: () => void;
};
const BoxOptions = ({
  modalVisible,
  setModalVisible,
  callbackUpdate,
  handleDelete,
}: BoxOptions) => (
  <S.ContentModalOptionUser
    onClick={setModalVisible}
    modalOptionUser={modalVisible}
  >
    <S.OptionPutUser onClick={callbackUpdate}>Editar</S.OptionPutUser>
    <S.OptionDeleteUser onClick={handleDelete}>Deletar</S.OptionDeleteUser>
  </S.ContentModalOptionUser>
);

export default BoxOptions;
