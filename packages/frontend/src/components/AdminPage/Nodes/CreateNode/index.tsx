import { yupResolver } from "@hookform/resolvers/yup";
import ContentInputs from "components/globalComponents/ContentInputs";
import SelectOptionsComponent from "components/globalComponents/SelectOptionsComponent";
import { Dispatch, SetStateAction, useRef } from "react";
import { useForm } from "react-hook-form";
import { NodeCreate } from "utils/models/node";
import * as S from "./styles";

import * as Yup from "yup";
import { useContextActionCrud } from "hooks/useActionsCrud";
import Farm from "utils/models/farm";

type createNodeProps = {
  farm: Farm;
  setAddNode: Dispatch<SetStateAction<boolean>>;
};
const schema = Yup.object({
  node_name: Yup.string()
    .required("Digite um nome de usuario")
    .min(3, "Minimo de 3 caractéres"),
  gateway: Yup.string(),
  is_gprs: Yup.string(),
}).required();
const optionsSelect = [
  {
    label: "SIM",
    value: "yes",
  },
  {
    label: "NÃO",
    value: "not",
  },
];
const CreateNode = ({ farm, setAddNode }: createNodeProps) => {
  //Contexts
  const { createNode } = useContextActionCrud();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<NodeCreate>({ resolver: yupResolver(schema) });
  const formRef = useRef<HTMLFormElement>(null);
  const onSubmit = handleSubmit((data) => {
    const newNode: NodeCreate = {
      node_name: data.node_name,
      is_gprs: data.is_gprs,
      farm_id: farm.farm_id,
      gateway: data.gateway,
      pivots: null,
    };
    setAddNode(false);
    createNode(newNode, farm);
  });

  return (
    <S.Container>
      <S.IconClose onClick={() => setAddNode(false)} />
      <S.Form onSubmit={onSubmit} ref={formRef}>
        <ContentInputs
          errorUserName={errors.node_name}
          label="NODE"
          id="node_name"
          type="text"
          placeholder="NODE"
          register={register}
        />
        <ContentInputs
          errorUserName={errors.gateway}
          label="GATEWAY"
          id="gateway"
          type="text"
          placeholder="GATEWAY"
          register={register}
        />
        <SelectOptionsComponent
          label="GPRS"
          id="is_gprs"
          register={register}
          options={optionsSelect}
        />
        <S.Button type="submit" value="Enviar" />
      </S.Form>
    </S.Container>
  );
};

export default CreateNode;
