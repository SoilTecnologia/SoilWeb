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

const CreateNode = ({ setAddNode }: createPivotProps) => {
  //Contexts
  const { stateAdmin } = useContextData();
  const { createPivot } = useContextActionCrud();

  //States
  const [addIdNode, setAddIdNode] = useState(false);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<PivotCreate>();
  const formRef = useRef<HTMLFormElement>(null);
  const onSubmit = handleSubmit((data) => {
    const nodeId = stateAdmin.dataNodeSelected?.node_id
      ? stateAdmin.dataNodeSelected.node_id
      : "1234";
    const newPivot: PivotCreate = {
      node_id: nodeId,
      pivot_name: data.pivot_name,
      pivot_lng: data.pivot_lng,
      pivot_lat: data.pivot_lat,
      pivot_start_angle: data.pivot_start_angle,
      pivot_end_angle: data.pivot_end_angle,
      pivot_radius: data.pivot_radius,
      radio_id: data.radio_id,
    };
    createPivot(newPivot);
    setAddNode(false);
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
        <ContentInputs
          errorUserName={errors.pivot_lng}
          label="LONGITUDE"
          colorLabel={theme.colors.secondary}
          id="pivot_lng"
          type="text"
          placeholder="LONGITUDE"
          register={register}
        />
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
