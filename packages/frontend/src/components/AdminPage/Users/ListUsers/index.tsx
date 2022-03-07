import * as S from "./styles";

import { useContextActionCrud } from "hooks/useActionsCrud";
import { useContextData } from "hooks/useContextData";

import { useEffect, useState } from "react";

import User from "utils/models/user";
import BoxUsers from "../BoxUsers";
import UpdateUserSelected from "../UpdateUserSelected";
import ModalUpdateData from "components/globalComponents/ModalUpdateData";

const ListUsers = () => {
  //Contexts
  const { setData, stateDefault, stateAdmin, usersList } = useContextData();
  const { getAllUser } = useContextActionCrud();

  //States
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    getAllUser();
  }, []);

  useEffect(() => {}, [usersList]);

  //Functions

  const callbackUpdateUser = (user: User) => {
    setModalVisible(true);
    setData({
      ...stateDefault,
      updateUser: user,
    });
  };

  const closeModal = () => {
    setData(stateDefault);
    setModalVisible(false);
  };

  return (
    <S.Container>
      {stateAdmin.showIsListUser &&
        usersList.map((user) => (
          <BoxUsers
            key={user.user_id}
            dataUser={user}
            callbackUpdateUser={callbackUpdateUser}
          />
        ))}

      {modalVisible && (
        <ModalUpdateData closeModal={closeModal}>
          {stateAdmin.updateUser && (
            <UpdateUserSelected
              dataUser={stateAdmin.updateUser}
              closeModal={closeModal}
            />
          )}
        </ModalUpdateData>
      )}
    </S.Container>
  );
};

export default ListUsers;
