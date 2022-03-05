import * as S from "./styles";
import { memo, useState } from "react";
import { useContextActionCrud } from "hooks/useActionsCrud";
import { useContextData } from "hooks/useContextData";

import User, { requestUser, UserType } from "utils/models/user";
import BoxOptions from "components/globalComponents/BoxOptions";
import DeleteDataComponent from "components/globalComponents/DeleteDataComponent";

type userProps = {
  dataUser: requestUser;
  callbackUpdateUser: (user: requestUser) => void;
};
const BoxUsersComponents = ({ dataUser, callbackUpdateUser }: userProps) => {
  //Contexts
  const { setData, stateDefault } = useContextData();
  const { deleteUser } = useContextActionCrud();

  //States
  const [modalOptionUser, setModalOptionUser] = useState(false);
  const [isDeletedUser, setIsDeletedUser] = useState(false);

  const handleRoleUser = (role: UserType) => {
    let userRole = "";
    switch (role) {
      case "SUDO":
        userRole = "ADMINISTRADOR";
        break;
      case "USER":
        userRole = "USUARIO";
        break;
      default:
        break;
    }

    return userRole;
  };

  const handleDeleteUser = () => {
    setModalOptionUser(false);
    setIsDeletedUser(true);
  };

  const okdeleteUser = () => {
    setIsDeletedUser(false);
    deleteUser(dataUser.user_id);
  };
  const notDeleteUser = () => {
    setIsDeletedUser(false);
  };

  const setModalVisible = () => {
    setModalOptionUser(false);
  };

  const callbackPut = () => {
    callbackUpdateUser(dataUser);
  };

  const callbackViewDataUser = (user: requestUser) => {
    setData({
      ...stateDefault,
      dataUserSelected: user,
      showIsListUser: false,
    });
  };

  return (
    <S.Container modalOptionUser={modalOptionUser}>
      <S.IconMenu onClick={() => setModalOptionUser(true)} />
      <S.ContentData onClick={() => callbackViewDataUser(dataUser)}>
        <S.UserName>{`NOME:      ${dataUser.login}`}</S.UserName>
        <S.RoleUser>{`Função:   ${handleRoleUser(
          dataUser.user_type
        )}`}</S.RoleUser>
        {/* {dataUser.farm && (
          <S.FarmUser>{`FAZENDA:    ${dataUser.login}`}</S.FarmUser>
        )} */}
      </S.ContentData>
      {modalOptionUser && (
        <BoxOptions
          modalVisible={modalOptionUser}
          setModalVisible={setModalVisible}
          callbackUpdate={callbackPut}
          handleDelete={handleDeleteUser}
        />
      )}
      {isDeletedUser && (
        <S.ContentModalOptionUser modalOptionUser={modalOptionUser}>
          <DeleteDataComponent
            okDelete={okdeleteUser}
            notDelete={notDeleteUser}
            label="USUARIO"
          />
        </S.ContentModalOptionUser>
      )}
    </S.Container>
  );
};

const BoxUsers = memo(BoxUsersComponents, (prev, next) => {
  return Object.is(prev.dataUser, next.dataUser);
});

export default BoxUsers;
