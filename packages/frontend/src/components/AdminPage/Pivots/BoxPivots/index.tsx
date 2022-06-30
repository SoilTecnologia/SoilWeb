import BoxOptions from "components/globalComponents/BoxOptions";
import ModalDeleteData from "components/globalComponents/ModalDeleteData";
import ModalUpdateData from "components/globalComponents/ModalUpdateData";
import { useContextActionCrud } from "hooks/useActionsCrud";
import { useState } from "react";
import theme from "styles/theme";
import Pivot from "utils/models/pivot";
import UpdatePivotData from "../UpdatePivotData";
import * as S from "./styles";

type boxPivotProps = {
  pivotData: Pivot;
};

const BoxPivots = ({ pivotData }: boxPivotProps) => {
  //Contexts
  const { deleteNode, getOneNode, deletePivot } = useContextActionCrud();

  //States
  const [modalOption, setModalOption] = useState(false);
  const [isDeletePivot, setIsDeletePivot] = useState(false);
  const [updatePivot, setUpdatePivot] = useState(false);

  //Functions
  const setModalVisible = () => {
    setModalOption(false);
  };

  const callbackPut = () => {
    setModalOption(false);
    setUpdatePivot(true);
  };
  const handleDeletePivot = () => {
    setModalOption(false);
    setIsDeletePivot(true);
  };

  const okDeletePivot = async () => {
    setIsDeletePivot(false);
    const node = await getOneNode(pivotData.node_id);
    if (node && node.node_num !== 0) {
      deleteNode(pivotData.node_id, pivotData.farm_id);
    } else {
      await deletePivot(pivotData);
    }
  };

  const notDeletePivot = () => {
    setIsDeletePivot(false);
  };

  const closeModalUpdate = () => {
    setUpdatePivot(false);
  };

  return (
    <S.ContentData>
      <S.Container>
        <S.IconOption onClick={() => setModalOption(true)} />
        <S.Name>
          Nome: <span>{pivotData.pivot_num}</span>
        </S.Name>
        <S.Latitude>
          Latitude: <span>{pivotData.pivot_lat}</span>
        </S.Latitude>
        <S.Longitude>
          Longitude: <span> {pivotData.pivot_lng}</span>
        </S.Longitude>
        <S.StartAngle>
          Angulo Inicial: <span>{pivotData.pivot_start_angle}</span>
        </S.StartAngle>
        <S.EndAngle>
          Angulo Final: <span>{pivotData.pivot_end_angle}</span>
        </S.EndAngle>
        <S.Radius>
          Raio: <span>{pivotData.pivot_radius}</span>
        </S.Radius>

        <S.Radio>
          Radio: <span>{pivotData.radio_id}</span>
        </S.Radio>
        {modalOption && (
          <BoxOptions
            modalVisible={modalOption}
            setModalVisible={setModalVisible}
            callbackUpdate={callbackPut}
            handleDelete={handleDeletePivot}
          />
        )}
      </S.Container>
      {isDeletePivot && (
        <ModalDeleteData
          alertLabel="Essa ação irá deletar o Pivô e todos os radios e estados atrelados a ele"
          callbackNotDelete={notDeletePivot}
          callbackDelete={okDeletePivot}
        />
      )}
      {updatePivot && (
        <ModalUpdateData
          closeModal={closeModalUpdate}
          background={theme.colors.primary_gradient}
        >
          <UpdatePivotData
            pivotData={pivotData}
            closeModal={closeModalUpdate}
          />
        </ModalUpdateData>
      )}
    </S.ContentData>
  );
};

export default BoxPivots;
