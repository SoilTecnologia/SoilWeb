import { yupResolver } from "@hookform/resolvers/yup";
import ContentInputs from "components/globalComponents/ContentInputs";
import SelectOptionsComponent from "components/globalComponents/SelectOptionsComponent";
import { useContextActionCrud } from "hooks/useActionsCrud";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import theme from "styles/theme";
import Node from "utils/models/node";
import * as Yup from "yup";

import { NodeForm } from "../CreateNode";
import * as S from "./styles";

type updateNodeProps = {
  nodeData: Node;
  closeModal: () => void;
};

const schema = Yup.object({
  node_name: Yup.string(),
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

const UpdateNode = ({ nodeData, closeModal }: updateNodeProps) => {
  const { updateNode } = useContextActionCrud();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<NodeForm>({ resolver: yupResolver(schema) });
  const formRef = useRef<HTMLFormElement>(null);
  const onSubmit = handleSubmit((data) => {
    const verifyGrps = data.is_gprs === "yes" ? true : false;
    console.log("========Node Update =============");
    console.log(verifyGrps);
    const newNode: Node = {
      ...nodeData,
      node_name: data.node_name ? data.node_name : nodeData.node_name,
      is_gprs: verifyGrps,
      farm_id: nodeData.farm_id,
      gateway: data.gateway ? data.gateway : nodeData.gateway,
    };
    closeModal();
    updateNode(newNode);
  });
  return (
    <S.Container>
      <S.IconClosed onClick={closeModal} />
      <S.Form onSubmit={onSubmit} ref={formRef}>
        <ContentInputs
          errorUserName={errors.node_name}
          label="NODE"
          colorLabel={theme.colors.secondary}
          id="node_name"
          type="text"
          placeholder="NODE"
          register={register}
        />
        <ContentInputs
          errorUserName={errors.gateway}
          label="GATEWAY"
          colorLabel={theme.colors.secondary}
          id="gateway"
          type="text"
          placeholder="GATEWAY"
          register={register}
        />
        <SelectOptionsComponent
          colorLabel={theme.colors.secondary}
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

export default UpdateNode;
