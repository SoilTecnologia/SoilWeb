import { yupResolver } from "@hookform/resolvers/yup";
import ContentInputs from "components/globalComponents/ContentInputs";
import SelectOptionsComponent from "components/globalComponents/SelectOptionsComponent";
import { useContextActionCrud } from "hooks/useActionsCrud";
import { Dispatch, SetStateAction, useRef } from "react";
import { useForm } from "react-hook-form";
import theme from "styles/theme";
import Farm from "utils/models/farm";
import { NodeCreate } from "utils/models/node";
import * as Yup from "yup";
import * as S from "./styles";

type createNodeProps = {
  farm: Farm;
  setAddNode: Dispatch<SetStateAction<boolean>>;
};
export type NodeForm = {
  node_num: number;
  gateway: string;
  is_gprs: string;
};
const schema = Yup.object({
  node_num: Yup.number().required("Digite um nome de usuario"),
  gateway: Yup.string(),
  is_gprs: Yup.string().required("Define se o tipo de comunicação é gprs"),
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
  } = useForm<NodeForm>({ resolver: yupResolver(schema) });
  const formRef = useRef<HTMLFormElement>(null);
  const onSubmit = handleSubmit((data) => {
    const newNode: NodeCreate = {
      node_num: data.node_num,
      is_gprs: data.is_gprs === "yes" ? true : false,
      farm_id: farm.farm_id,
      gateway: data.gateway,
    };
    setAddNode(false);
    createNode(newNode, farm);
  });

  return (
    <S.Container>
      <S.IconClose onClick={() => setAddNode(false)} />
      <S.Form onSubmit={onSubmit} ref={formRef}>
        <ContentInputs
          errorUserName={errors.node_num}
          label="NODE"
          colorLabel={theme.colors.secondary}
          id="node_num"
          type="number"
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

export default CreateNode;
