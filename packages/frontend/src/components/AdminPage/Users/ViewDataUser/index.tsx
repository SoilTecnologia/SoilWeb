import UpdateFarmSelected from "components/AdminPage/Farms/UpdateFarmSelected";
import ModalUpdateData from "components/globalComponents/ModalUpdateData";
import { useContextData } from "hooks/useContextData";
import { useState } from "react";
import BoxFarm from "../../Farms/BoxFarm";
import * as S from "./styles";

const ViewDataUser = () => {
  const [farmsUser, setFarmsUser] = useState(false);
  const { stateAdmin, setData, stateDefault } = useContextData();
  const [modalVisible, setModalVisible] = useState(false);

  const closeModal = () => {
    setData(stateDefault);
    setModalVisible(false);
  };

  const handleNewFarm = () => {
    setData({ ...stateAdmin, createFarm: true });
  };

  return (
    <S.ContentDataUser>
      <S.Container>
        <S.DataUser>
          <S.Name>{stateAdmin.dataUserSelected?.user_name}</S.Name>
          <S.Farms onClick={() => setFarmsUser(!farmsUser)}>
            <S.ContentFarm_Add>
              <S.TabName>FAZENDAS: </S.TabName>
              <S.AddFarm onClick={handleNewFarm}>
                Nova Fazenda <S.IconAdd />
              </S.AddFarm>
            </S.ContentFarm_Add>

            {stateAdmin.dataUserSelected && stateAdmin.dataUserSelected.farm ? (
              stateAdmin.dataUserSelected.farm.map((farm, index) => (
                <BoxFarm key={index} farmProps={farm} />
              ))
            ) : (
              <S.NotItemFind>NENHUMA FAZENDA ENCONTRADA</S.NotItemFind>
            )}
          </S.Farms>
        </S.DataUser>
      </S.Container>
      {modalVisible && (
        <ModalUpdateData closeModal={closeModal}>
          {stateAdmin.updateFarm && (
            <UpdateFarmSelected farmSelected={stateAdmin.updateFarm} />
          )}
        </ModalUpdateData>
      )}
    </S.ContentDataUser>
  );
};

export default ViewDataUser;
