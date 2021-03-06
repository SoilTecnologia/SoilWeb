import * as S from "./styles";
import { memo, useState } from "react";

import { useContextData } from "hooks/useContextData";
import { useContextActionCrud } from "hooks/useActionsCrud";

import BoxOptions from "components/globalComponents/BoxOptions";
import Farm from "utils/models/farm";

import ModalDeleteData from "components/globalComponents/ModalDeleteData";
import ModalUpdateData from "components/globalComponents/ModalUpdateData";
import UpdateFarmSelected from "../UpdateFarmSelected";

export type BoxFarmsProps = {
  farmProps: Farm;
};

const BoxFarmComponent = ({ farmProps }: BoxFarmsProps) => {
  //Contexts
  const { deleteFarm } = useContextActionCrud();
  const [modalVisible, setModalVisible] = useState(false);
  const [isDeletedUser, setIsDeletedUser] = useState(false);
  const [updateFarm, setUpdateFarm] = useState(false);
  const { setData, stateAdmin, stateDefault } = useContextData();

  const handleSetModalVisible = () => {
    setModalVisible(false);
  };

  const callbackPut = () => {
    setModalVisible(false);
    setUpdateFarm(true);
  };

  const okDeleteFarm = () => {
    setIsDeletedUser(false);
    deleteFarm(farmProps.farm_id, farmProps.user_id);
  };

  const notDeleteFarm = () => {
    setIsDeletedUser(false);
  };

  const handleDeleteFarm = () => {
    setModalVisible(false);
    setIsDeletedUser(true);
  };

  const setFarmSelected = () => {
    setData({
      ...stateDefault,
      dataUserSelected: stateAdmin.dataUserSelected,
      showIsListUser: false,
      dataFarmSelected: farmProps,
    });
  };
  const closeModal = () => {
    setUpdateFarm(false);
  };
  return (
    <S.ContentFull>
      <S.Container>
        <S.IconMenu onClick={() => setModalVisible(true)} />

        <S.ContentFarmInfo onClick={setFarmSelected}>
          <S.Farm>Fazenda: {`  ${farmProps.farm_name}`}</S.Farm>
          <S.ContentLocaleFarm>
            <S.City>Cidade: {`  ${farmProps.farm_city} `}</S.City>
          </S.ContentLocaleFarm>
        </S.ContentFarmInfo>

        {modalVisible && (
          <BoxOptions
            modalVisible={modalVisible}
            setModalVisible={handleSetModalVisible}
            callbackUpdate={callbackPut}
            handleDelete={handleDeleteFarm}
          />
        )}
      </S.Container>
      {isDeletedUser && (
        <ModalDeleteData
          alertLabel="Essa A????o ir?? deletar a Fazenda e todos os piv??s atrelados a ela"
          callbackNotDelete={notDeleteFarm}
          callbackDelete={okDeleteFarm}
        />
      )}
      {updateFarm && (
        <ModalUpdateData closeModal={closeModal}>
          <UpdateFarmSelected
            farmSelected={farmProps}
            closeModal={closeModal}
          />
        </ModalUpdateData>
      )}
    </S.ContentFull>
  );
};

const BoxFarm = memo(BoxFarmComponent, (prev, next) => {
  return Object.is(prev.farmProps, next.farmProps);
});
export default BoxFarm;
