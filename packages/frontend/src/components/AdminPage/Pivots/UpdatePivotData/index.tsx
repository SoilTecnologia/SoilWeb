import ContentInputs from "components/globalComponents/ContentInputs";
import { useContextActionCrud } from "hooks/useActionsCrud";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Pivot, { PivotForm } from "utils/models/pivot";
import { defaultError } from "../CreatePivot";
import { MessageError } from "../CreatePivot/styles";
import * as S from "./styles";

type updateFarmProps = {
  pivotData: Pivot;
  closeModal: () => void;
};
type errorProps = {
  type: null | "lat" | "lng";
  error: string | null;
};

const UpdatePivotData = ({ pivotData, closeModal }: updateFarmProps) => {
  //Contexts
  const { updatePivot, getOneNode, updateNode } = useContextActionCrud();
  //States
  const [error, setError] = useState<errorProps>(defaultError);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<PivotForm>();
  //Ref
  const formRef = useRef<HTMLFormElement>(null);
  //Functions
  const formatLatAndLong = (type: "lat" | "lng", latLong: string) => {
    const number = Number(latLong);
    if (number) {
      return number;
    } else {
      const catchError = {
        type: type,
        error: "Digite somente numeros inteiro ou decimais usando o ponto .",
      };
      setError(catchError);
    }
  };
  const handlePivot = async (newNode_num: number) => {
    const node = await getOneNode(pivotData.node_id);

    node && updateNode({ ...node, node_num: newNode_num });
  };

  const handleDataForm = (formData: PivotForm) => {
    if (formData.pivot_num !== pivotData.pivot_num) {
      handlePivot(formData.pivot_num);
    }

    const latNotNull = formData.pivot_lat
      ? formData.pivot_lat
      : pivotData.pivot_lat;
    const lngNotNull = formData.pivot_lng
      ? formData.pivot_lng
      : pivotData.pivot_lng;
    const latForNumber = formatLatAndLong("lat", latNotNull.toString());
    const longForNumber = formatLatAndLong("lng", lngNotNull.toString());

    if (latForNumber && longForNumber) {
      const newPivot: Pivot = {
        ...pivotData,
        pivot_num: formData.pivot_num
          ? formData.pivot_num
          : pivotData.pivot_num,
        pivot_lat: latForNumber ? latForNumber : pivotData.pivot_lat,
        pivot_lng: longForNumber ? longForNumber : pivotData.pivot_lng,
        pivot_start_angle: formData.pivot_start_angle
          ? formData.pivot_start_angle
          : pivotData.pivot_start_angle,
        pivot_end_angle: formData.pivot_end_angle
          ? formData.pivot_end_angle
          : pivotData.pivot_end_angle,
        pivot_radius: formData.pivot_radius
          ? formData.pivot_radius
          : pivotData.pivot_radius,
        radio_id: formData.radio_id ? formData.radio_id : pivotData.radio_id,
      };

      return newPivot;
    }
  };

  const onSubmit = handleSubmit((data) => {
    error.error && setError(defaultError);
    const addPivot = handleDataForm(data);
    if (addPivot) {
      closeModal();
      updatePivot(addPivot);
    }
  });

  return (
    <S.Form onSubmit={onSubmit} ref={formRef}>
      <ContentInputs
        errorUserName={errors.pivot_num}
        label="PIVOT"
        id="pivot_num"
        type="number"
        placeholder={pivotData.pivot_num.toString()}
        register={register}
      />
      <ContentInputs
        errorUserName={errors.pivot_lat}
        label="LATITUDE"
        id="pivot_lat"
        type="text"
        placeholder={pivotData.pivot_lat.toString() + "EX: -21.00"}
        register={register}
      />
      {error && error.type === "lat" && (
        <MessageError>{error.error}</MessageError>
      )}
      <ContentInputs
        errorUserName={errors.pivot_lng}
        label="LONGITUDE"
        id="pivot_lng"
        type="text"
        placeholder={pivotData.pivot_lng.toString() + "EX: -46.00"}
        register={register}
      />
      {error && error.type === "lng" && (
        <MessageError>{error.error}</MessageError>
      )}
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
      <ContentInputs
        errorUserName={errors.radio_id}
        label="RADIO"
        id="radio_id"
        type="text"
        placeholder={pivotData.radio_id.toString()}
        register={register}
      />

      <S.Button type="submit" value="Enviar" />
    </S.Form>
  );
};

export default UpdatePivotData;
