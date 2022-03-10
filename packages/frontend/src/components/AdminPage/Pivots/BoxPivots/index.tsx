import * as S from "./styles";
import { useState } from "react";

import { useContextActionCrud } from "hooks/useActionsCrud";

import Pivot from "utils/models/pivot";

import BoxOptions from "components/globalComponents/BoxOptions";
import { ContentModalOptionUser } from "components/AdminPage/Users/BoxUsers/styles";
import DeleteDataComponent from "components/globalComponents/DeleteDataComponent";
import Node from "utils/models/node";
import ModalUpdateData from "components/globalComponents/ModalUpdateData";
import UpdatePivotData from "../UpdatePivotData";
import ModalDeleteData from "components/globalComponents/ModalDeleteData";

type boxPivotProps = {
  pivotData: Pivot;
  nodeData: Node;
};

const BoxPivots = ({ pivotData, nodeData }: boxPivotProps) => {
  //Contexts
  const { deletePivot } = useContextActionCrud();

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

  const okDeletePivot = () => {
    setIsDeletePivot(false);
    deletePivot(pivotData.pivot_id, nodeData);
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
          Nome: <span>{pivotData.pivot_name}</span>
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
        <ModalUpdateData closeModal={closeModalUpdate}>
          <UpdatePivotData
            pivotData={pivotData}
            nodeData={nodeData}
            closeModal={closeModalUpdate}
          />
        </ModalUpdateData>
      )}
    </S.ContentData>
  );
};

export default BoxPivots;
