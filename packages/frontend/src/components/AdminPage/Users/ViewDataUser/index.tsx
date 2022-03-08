import UpdateFarmSelected from "components/AdminPage/Farms/UpdateFarmSelected";
import ModalUpdateData from "components/globalComponents/ModalUpdateData";
import { useContextActionCrud } from "hooks/useActionsCrud";
import { useContextData } from "hooks/useContextData";
import { useEffect, useState } from "react";
import BoxFarm from "../../Farms/BoxFarm";
import * as S from "./styles";

const ViewDataUser = () => {
  const [farmsUser, setFarmsUser] = useState(false);
  const { getAllFarmsUser } = useContextActionCrud();
  const { stateAdmin, setData, stateDefault, farmList } = useContextData();
  const [modalVisible, setModalVisible] = useState(false);

  const handleNewFarm = () => {
    setData({ ...stateAdmin, createFarm: true });
  };

  const handleAllFarmsUser = async () => {
    if (stateAdmin.dataUserSelected) {
      getAllFarmsUser(stateAdmin.dataUserSelected.user_id);
    }
  };
  const closeModal = () => {
    setData(stateDefault);
    setModalVisible(false);
  };

  useEffect(() => {
    handleAllFarmsUser();
  }, []);

  return (
    <S.ContentDataUser>
      <S.Container>
        <S.DataUser>
          <S.Name>{stateAdmin.dataUserSelected?.login}</S.Name>
          <S.Farms onClick={() => setFarmsUser(!farmsUser)}>
            <S.ContentFarm_Add>
              <S.TabName>FAZENDAS: </S.TabName>
              <S.AddFarm onClick={handleNewFarm}>
                Nova Fazenda <S.IconAdd />
              </S.AddFarm>
            </S.ContentFarm_Add>

            {stateAdmin.dataUserSelected && farmList ? (
              farmList.map((farm, index) => (
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
            <UpdateFarmSelected
              farmSelected={stateAdmin.updateFarm}
              handleState={setModalVisible}
            />
          )}
        </ModalUpdateData>
      )}
    </S.ContentDataUser>
  );
};

export default ViewDataUser;
