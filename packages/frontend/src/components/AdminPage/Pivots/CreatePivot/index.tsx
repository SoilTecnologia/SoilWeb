import ContentInputs from "components/globalComponents/ContentInputs";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as S from "./styles";

import { useContextActionCrud } from "hooks/useActionsCrud";
import { PivotCreate } from "utils/models/pivot";
import theme from "styles/theme";
import { useContextData } from "hooks/useContextData";

type createPivotProps = {
  setAddNode: Dispatch<SetStateAction<boolean>>;
};

type PivotForm = {
  node_id: string;
  pivot_name: number;
  pivot_lng: string;
  pivot_lat: string;
  pivot_start_angle: number;
  pivot_end_angle: number;
  pivot_radius: number;
  radio_id: number;
};
type errorProps = {
  type: null | "lat" | "lng";
  error: string | null;
};
const CreateNode = ({ setAddNode }: createPivotProps) => {
  //Contexts
  const { stateAdmin } = useContextData();
  const { createPivot } = useContextActionCrud();

  //States
  const defaultError = {
    type: null,
    error: null,
  };
  const [addIdNode, setAddIdNode] = useState(false);
  const [error, setError] = useState<errorProps>(defaultError);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<PivotForm>();
  const formRef = useRef<HTMLFormElement>(null);

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
  const onSubmit = handleSubmit((data) => {
    setError(defaultError);
    const nodeId = stateAdmin.dataNodeSelected?.node_id
      ? stateAdmin.dataNodeSelected.node_id
      : "1234";

    const latForNumber = formatLatAndLong("lat", data.pivot_lat);
    const longForNumber = formatLatAndLong("lng", data.pivot_lng);

    if (latForNumber && longForNumber) {
      const newPivot: PivotCreate = {
        node_id: nodeId,
        pivot_name: data.pivot_name,
        pivot_lng: latForNumber,
        pivot_lat: longForNumber,
        pivot_start_angle: data.pivot_start_angle,
        pivot_end_angle: data.pivot_end_angle,
        pivot_radius: data.pivot_radius,
        radio_id: data.radio_id,
      };
      createPivot(newPivot);
      setAddNode(false);
    }
  });

  return (
    <S.Container>
      <S.IconClose onClick={() => setAddNode(false)} />
      <S.Form onSubmit={onSubmit} ref={formRef}>
        <ContentInputs
          errorUserName={errors.pivot_name}
          label="PIVOT"
          colorLabel={theme.colors.secondary}
          id="pivot_name"
          type="number"
          placeholder="PIVOT"
          register={register}
        />
        <ContentInputs
          errorUserName={errors.pivot_lat}
          label="LATITUDE"
          colorLabel={theme.colors.secondary}
          id="pivot_lat"
          type="text"
          placeholder="LATITUDE"
          register={register}
        />
        {error && error.type === "lat" && (
          <S.MessageError>{error.error}</S.MessageError>
        )}
        <ContentInputs
          errorUserName={errors.pivot_lng}
          label="LONGITUDE"
          colorLabel={theme.colors.secondary}
          id="pivot_lng"
          type="text"
          placeholder="LONGITUDE"
          register={register}
        />
        {error && error.type === "lng" && (
          <S.MessageError>{error.error}</S.MessageError>
        )}
        <ContentInputs
          errorUserName={errors.pivot_start_angle}
          label="ANGULO INICIAL"
          colorLabel={theme.colors.secondary}
          id="pivot_start_angle"
          type="number"
          placeholder="ANGULO INICIAL"
          register={register}
        />
        <ContentInputs
          errorUserName={errors.pivot_end_angle}
          label="ANGULO FINAL"
          colorLabel={theme.colors.secondary}
          id="pivot_end_angle"
          type="number"
          placeholder="ANGULO FINAL"
          register={register}
        />
        <ContentInputs
          errorUserName={errors.pivot_radius}
          label="RAIO"
          colorLabel={theme.colors.secondary}
          id="pivot_radius"
          type="number"
          placeholder="RAIO"
          register={register}
        />

        <ContentInputs
          errorUserName={errors.radio_id}
          label="RADIO"
          colorLabel={theme.colors.secondary}
          id="radio_id"
          type="number"
          placeholder="RADIO"
          register={register}
        />

        <S.ButtonAddNodeId onClick={() => setAddIdNode(!addIdNode)}>
          Adicionar Node Id?{" "}
        </S.ButtonAddNodeId>

        {addIdNode && (
          <ContentInputs
            errorUserName={errors.node_id}
            label="ID NODE"
            colorLabel={theme.colors.secondary}
            id="node_id"
            type="text"
            placeholder="ID NODE"
            register={register}
          />
        )}

        <S.Button type="submit" value="Enviar" />
      </S.Form>
    </S.Container>
  );
};

export default CreateNode;
