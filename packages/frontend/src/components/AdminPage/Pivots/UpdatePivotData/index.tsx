import * as S from "./styles";
import { useRef } from "react";

import { useForm } from "react-hook-form";

import ContentInputs from "components/globalComponents/ContentInputs";
import { useContextActionCrud } from "hooks/useActionsCrud";
import Pivot from "utils/models/pivot";
import { useContextData } from "hooks/useContextData";

type updateFarmProps = {
  pivotData: Pivot;
};

const UpdatePivotData = ({ pivotData }: updateFarmProps) => {
  //Contexts
  const { updatePivot } = useContextActionCrud();
  const { stateAdmin } = useContextData();
  //States
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<Pivot>();
  const formRef = useRef<HTMLFormElement>(null);
  //Functions
  const onSubmit = handleSubmit((data) => {
    const newPivot: Pivot = {
      ...pivotData,
      pivot_name: data.pivot_name ? data.pivot_name : pivotData.pivot_name,
      pivot_id: data.pivot_id ? data.pivot_id : pivotData.pivot_id,
      pivot_lat: data.pivot_lat ? data.pivot_lat : pivotData.pivot_lat,
      pivot_lng: data.pivot_lng ? data.pivot_lng : pivotData.pivot_lng,
      pivot_start_angle: data.pivot_start_angle
        ? data.pivot_start_angle
        : pivotData.pivot_start_angle,
      pivot_end_angle: data.pivot_end_angle
        ? data.pivot_end_angle
        : pivotData.pivot_end_angle,
      pivot_radius: data.pivot_radius
        ? data.pivot_radius
        : pivotData.pivot_radius,
    };
    if (stateAdmin.dataFarmSelected) {
      updatePivot(newPivot, stateAdmin.dataFarmSelected);
    } else {
      console.log("NÂO EXISTE NENHUMA FAZENDA SELECIONADA");
    }
  });

  return (
    <S.Form onSubmit={onSubmit} ref={formRef}>
      <ContentInputs
        errorUserName={errors.pivot_name}
        label="PIVOT"
        id="pivot_name"
        type="text"
        placeholder={pivotData.pivot_name}
        register={register}
      />
      <ContentInputs
        errorUserName={errors.pivot_id}
        label="ID"
        id="pivot_id"
        type="text"
        placeholder={pivotData.pivot_id}
        register={register}
      />
      <ContentInputs
        errorUserName={errors.pivot_lat}
        label="LATITUDE"
        id="pivot_lat"
        type="text"
        placeholder={pivotData.pivot_lat.toString()}
        register={register}
      />
      <ContentInputs
        errorUserName={errors.pivot_lng}
        label="LONGITUDE"
        id="pivot_lng"
        type="text"
        placeholder={pivotData.pivot_lng.toString()}
        register={register}
      />
      <ContentInputs
        errorUserName={errors.pivot_start_angle}
        label="ANGULO INICIAL"
        id="pivot_start_angle"
        type="text"
        placeholder={pivotData.pivot_start_angle.toString()}
        register={register}
      />
      <ContentInputs
        errorUserName={errors.pivot_end_angle}
        label="ANGULO FINAL"
        id="pivot_end_angle"
        type="text"
        placeholder={pivotData.pivot_end_angle.toString()}
        register={register}
      />
      <ContentInputs
        errorUserName={errors.pivot_radius}
        label="RAIO"
        id="pivot_radius"
        type="text"
        placeholder={pivotData.pivot_radius.toString()}
        register={register}
      />

      <S.Button type="submit" value="Enviar" />
    </S.Form>
  );
};

export default UpdatePivotData;
