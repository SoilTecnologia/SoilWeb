import * as S from "./styles";
import { useState } from "react";

import { useContextActionCrud } from "hooks/useActionsCrud";
import { useContextData } from "hooks/useContextData";

import Pivot from "utils/models/pivot";
import Farm from "utils/models/farm";

import BoxOptions from "components/globalComponents/BoxOptions";
import { ContentModalOptionUser } from "components/AdminPage/Users/BoxUsers/styles";
import DeleteDataComponent from "components/globalComponents/DeleteDataComponent";

type boxPivotProps = {
  pivotData: Pivot;
};

const BoxPivots = ({ pivotData }: boxPivotProps) => {
  //Contexts
  const { deletePivot } = useContextActionCrud();
  const { setData, stateDefault, stateAdmin } = useContextData();

  //States
  const [modalOption, setModalOption] = useState(false);
  const [isDeletePivot, setIsDeletePivot] = useState(false);

  //Functions
  const setModalVisible = () => {
    setModalOption(false);
  };

  const callbackPut = () => {
    setModalOption(false);
    setData({
      ...stateDefault,
      showIsListUser: false,
      dataUserSelected: stateAdmin.dataUserSelected,
      updatePivot: pivotData,
      dataFarmSelected: stateAdmin.dataFarmSelected,
    });
  };
  const handleDeletePivot = () => {
    setModalOption(false);
    setIsDeletePivot(true);
    // console.log(farmRelation);
  };

  const okDeletePivot = () => {
    setIsDeletePivot(false);
    // deletePivot(pivotData.pivot_id, farmRelation);
  };
  const notDeletePivot = () => {
    setIsDeletePivot(false);
  };

  return (
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
      {/* <S.LastCommunication>
        Ultima Comunicação:{" "}
        <span>{pivotData.last_communication.toString()}</span>
      </S.LastCommunication> */}
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
      {isDeletePivot && (
        <ContentModalOptionUser modalOptionUser={modalOption}>
          <DeleteDataComponent
            okDelete={okDeletePivot}
            notDelete={notDeletePivot}
            label="USUARIO"
          />
        </ContentModalOptionUser>
      )}
    </S.Container>
  );
};

export default BoxPivots;
