import ContentInputs from "components/globalComponents/ContentInputs";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import * as S from "./styles";

import { useContextActionCrud } from "hooks/useActionsCrud";
import { PivotCreate, PivotForm } from "utils/models/pivot";
import theme from "styles/theme";
import { useContextData } from "hooks/useContextData";
import { yupResolver } from "@hookform/resolvers/yup";

type createPivotProps = {
  setAddNode: Dispatch<SetStateAction<boolean>>;
};

type errorProps = {
  type: null | "lat" | "lng";
  error: string | null;
};
export const defaultError = {
  type: null,
  error: null,
};
const schema = Yup.object({
  pivot_name: Yup.string().required("Digite o numero do Pivo"),
  pivot_lat: Yup.string().required("Digite a Latitude"),
  pivot_lng: Yup.string().required("Digite a Longitude"),
  pivot_start_angle: Yup.number().required("Digite um angulo inicial"),
  pivot_end_angle: Yup.number().required("Digite um angulo final"),
  pivot_radius: Yup.number().required("Digite um raio"),
  radio_id: Yup.number().required("Digite um radio"),
}).required();

const CreateNode = ({ setAddNode }: createPivotProps) => {
  //Contexts
  const { stateAdmin } = useContextData();
  const { createPivot } = useContextActionCrud();

  //States
  const [addIdNode, setAddIdNode] = useState(false);
  const [error, setError] = useState<errorProps>(defaultError);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<PivotForm>({ resolver: yupResolver(schema) });
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

  const handleDataForm = (dataForm: PivotForm) => {
    if (stateAdmin.dataNodeSelected && stateAdmin.dataNodeSelected?.node_id) {
      const latForNumber = formatLatAndLong("lat", dataForm.pivot_lat);
      const longForNumber = formatLatAndLong("lng", dataForm.pivot_lng);

      if (latForNumber && longForNumber) {
        const newPivot: PivotCreate = {
          node_id: stateAdmin.dataNodeSelected.node_id,
          pivot_name: dataForm.pivot_name,
          pivot_lng: latForNumber,
          pivot_lat: longForNumber,
          pivot_start_angle: dataForm.pivot_start_angle,
          pivot_end_angle: dataForm.pivot_end_angle,
          pivot_radius: dataForm.pivot_radius,
          radio_id: dataForm.radio_id,
        };
        return newPivot;
      }
    }
  };

  const onSubmit = handleSubmit((data) => {
    error.error && setError(defaultError);

    const addPivot = handleDataForm(data);
    if (addPivot) {
      createPivot(addPivot);
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
