import { yupResolver } from "@hookform/resolvers/yup";
import ContentInputs from "components/globalComponents/ContentInputs";
import ModalWarningAlreadEists from "components/globalComponents/ModalWarningAlreadEists";
import SelectOptionsComponent from "components/globalComponents/SelectOptionsComponent";
import { useContextActionCrud } from "hooks/useActionsCrud";
import { Dispatch, FormEvent, SetStateAction, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import theme from "styles/theme";
import Farm from "utils/models/farm";
import Node, { NodeCreate } from "utils/models/node";
import { PivotCreate, PivotForm } from "utils/models/pivot";
import * as Yup from "yup";
import * as S from "./styles";

type createPivotProps = {
  setAddNode: Dispatch<SetStateAction<boolean>>;
  farm: Farm;
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
  is_gprs: Yup.string().required(),
  gatewayNode: Yup.string(),
  pivot_num: Yup.number().required("Digite o numero do Pivo"),
  pivot_lat: Yup.string().required("Digite a Latitude"),
  pivot_lng: Yup.string().required("Digite a Longitude"),
  pivot_start_angle: Yup.number().required("Digite um angulo inicial"),
  pivot_end_angle: Yup.number().required("Digite um angulo final"),
  pivot_radius: Yup.number().required("Digite um raio"),
  radio_id: Yup.number().required("Digite um radio"),
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

const CreatePivot = ({ setAddNode, farm }: createPivotProps) => {
  //Contexts
  const { createPivot, createNode, getOnePivot } = useContextActionCrud();

  //States
  // const [addIdNode, setAddIdNode] = useState(false);
  const [error, setError] = useState<errorProps>(defaultError);
  const [gatewayVisible, setGatewayVisible] = useState(false);
  const [pivotAlreadyExists, setPivotAlreadyExists] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<PivotForm>({ resolver: yupResolver(schema) });
  const formRef = useRef<HTMLFormElement>(null);

  const verifyPivotAlreadyExists = async (pivot: PivotCreate) => {
    const pivotExists = await getOnePivot(pivot);
    if (pivotExists) {
      setPivotAlreadyExists(true);
    } else {
      createPivot(pivot);
      setAddNode(false);
    }
  };
  const createNewNode = async (pivotData: PivotForm) => {
    const isGrpsValid = pivotData.is_gprs === "yes" ? true : false;
    const newNode: NodeCreate = {
      is_gprs: isGrpsValid,
      node_num: isGrpsValid ? pivotData.pivot_num : 0,
      farm_id: farm.farm_id,
      gateway: isGrpsValid ? undefined : pivotData.gatewayNode,
    };
    const newNodeCreated = await createNode(newNode);
    return newNodeCreated;
  };
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

  const handleDataForm = (dataForm: PivotForm, node_id: Node["node_id"]) => {
    const latForNumber = formatLatAndLong("lat", dataForm.pivot_lat);
    const longForNumber = formatLatAndLong("lng", dataForm.pivot_lng);

    if (latForNumber && longForNumber) {
      const newPivot: PivotCreate = {
        farm_id: farm.farm_id,
        node_id,
        pivot_num: dataForm.pivot_num,
        pivot_lng: longForNumber,
        pivot_lat: latForNumber,
        pivot_start_angle: dataForm.pivot_start_angle,
        pivot_end_angle: dataForm.pivot_end_angle,
        pivot_radius: dataForm.pivot_radius,
        radio_id: dataForm.radio_id,
      };
      return newPivot;
    }
  };

  const checkIsGprsTrue = (e: FormEvent<HTMLFormElement>) => {
    const target = e.target as HTMLTextAreaElement;
    if (target.value === "not") {
      setGatewayVisible(true);
    } else if (target.value === "yes") {
      setGatewayVisible(false);
    }
  };
  const onSubmit = handleSubmit(async (data) => {
    error.error && setError(defaultError);
    const nodeCreated = await createNewNode(data);
    const addPivot = handleDataForm(data, nodeCreated.node_id);
    if (addPivot) {
      verifyPivotAlreadyExists(addPivot);
    }
  });

  return (
    <>
      <S.Container>
        <S.IconClose onClick={() => setAddNode(false)} />
        <S.Form onSubmit={onSubmit} ref={formRef} onChange={checkIsGprsTrue}>
          <SelectOptionsComponent
            colorLabel={theme.colors.secondary}
            label="GPRS"
            id="is_gprs"
            register={register}
            options={optionsSelect}
          />
          {gatewayVisible && (
            <ContentInputs
              errorUserName={errors.gatewayNode}
              label="GATEWAY"
              colorLabel={theme.colors.secondary}
              id="gatewayNode"
              type="string"
              placeholder="GATEWAY"
              register={register}
            />
          )}

          <ContentInputs
            errorUserName={errors.pivot_num}
            label="PIVOT"
            colorLabel={theme.colors.secondary}
            id="pivot_num"
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
            placeholder="EX: -21.00"
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
            placeholder="EX: -46.00"
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

          {/* <S.ButtonAddNodeId onClick={() => setAddIdNode(!addIdNode)}>
          Adicionar Node Id?{" "}
        </S.ButtonAddNodeId> */}

          {/* {addIdNode && (
          <ContentInputs
            errorUserName={errors.node_id}
            label="ID NODE"
            colorLabel={theme.colors.secondary}
            id="node_id"
            type="text"
            placeholder="ID NODE"
            register={register}
          />
        )} */}

          <S.Button type="submit" value="Enviar" />
        </S.Form>
      </S.Container>
      {pivotAlreadyExists && (
        <ModalWarningAlreadEists
          closeModal={() => setPivotAlreadyExists(false)}
          alert="Já existe um Pivô com esse Id"
          subAlert="Por favor Digite um Pivô diferente"
        />
      )}
    </>
  );
};

export default CreatePivot;
