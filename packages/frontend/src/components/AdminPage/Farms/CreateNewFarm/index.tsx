import { yupResolver } from "@hookform/resolvers/yup";
import { defaultError } from "components/AdminPage/Pivots/CreatePivot";
import { MessageError } from "components/AdminPage/Pivots/CreatePivot/styles";
import ContentInputs from "components/globalComponents/ContentInputs";
import ModalWarningAlreadEists from "components/globalComponents/ModalWarningAlreadEists";
import { useContextActionCrud } from "hooks/useActionsCrud";
import { useContextData } from "hooks/useContextData";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FarmCreate, FarmFormCreate } from "utils/models/farm";
import User from "utils/models/user";
import * as Yup from "yup";
import * as S from "./styles";

type errorProps = {
  type: null | "lat" | "lng";
  error: string | null;
};
const schema = Yup.object({
  farm_id: Yup.string().required(),
  farm_name: Yup.string()
    .required("Digite um nome de usuario")
    .min(3, "Minimo de 3 caractéres"),
  farm_city: Yup.string().required("Digite uma cidade"),
  farm_lat: Yup.string().required("Digite a Latitude"),
  farm_lng: Yup.string().required("Digite a Longitude"),
}).required();

const CreateNewFarm = () => {
  //Contexts
  const { createFarm, getOneFarms } = useContextActionCrud();
  const { stateAdmin } = useContextData();

  //States
  const [error, setError] = useState<errorProps>(defaultError);
  const [farmAlreadyExists, setFarmAlreadyExists] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FarmFormCreate>({ resolver: yupResolver(schema) });
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

  const handleDataForm = (
    dataForm: FarmFormCreate,
    user_id: User["user_id"]
  ) => {
    const latForNumber = formatLatAndLong("lat", dataForm.farm_lat);
    const longForNumber = formatLatAndLong("lng", dataForm.farm_lng);

    if (latForNumber && longForNumber) {
      const newFarmUser: FarmCreate = {
        farm_id: dataForm.farm_id,
        user_id: user_id,
        farm_name: dataForm.farm_name,
        farm_city: dataForm.farm_city,
        farm_lat: latForNumber,
        farm_lng: longForNumber,
      };

      return newFarmUser;
    }
  };
  const verifyFarmAlreadyExists = async (farm: FarmCreate) => {
    const farmExists = await getOneFarms(farm.farm_id);
    if (farmExists) {
      setFarmAlreadyExists(true);
    } else {
      createFarm(farm);
    }
  };

  const onSubmit = handleSubmit((data) => {
    error && setError(defaultError);

    const user = stateAdmin.dataUserSelected;
    if (user) {
      const addFarm = handleDataForm(data, user.user_id);
      addFarm && verifyFarmAlreadyExists(addFarm);
    }
  });

  return (
    <S.Container>
      <S.Form onSubmit={onSubmit} ref={formRef}>
        <ContentInputs
          errorUserName={errors.farm_name}
          label="NOME DA FAZENDA"
          id="farm_name"
          type="text"
          placeholder="NOME DA FAZENDA"
          register={register}
        />
        <ContentInputs
          errorUserName={errors.farm_id}
          label="ID DA FAZENDA"
          id="farm_id"
          type="text"
          placeholder="ID DA FAZENDA"
          register={register}
        />
        <ContentInputs
          errorUserName={errors.farm_city}
          label="CIDADE"
          id="farm_city"
          type="text"
          placeholder="CIDADE"
          register={register}
        />
        <ContentInputs
          errorUserName={errors.farm_lat}
          label="LATITUDE"
          id="farm_lat"
          type="text"
          placeholder="LATITUDE"
          register={register}
        />
        {error && error.type === "lat" && (
          <MessageError>{error.error}</MessageError>
        )}
        <ContentInputs
          errorUserName={errors.farm_lng}
          label="LONGITUDE"
          id="farm_lng"
          type="text"
          placeholder="LONGITUDE"
          register={register}
        />
        {error && error.type === "lng" && (
          <MessageError>{error.error}</MessageError>
        )}
        <S.Button type="submit" value="Enviar" />
      </S.Form>
      {farmAlreadyExists && (
        <ModalWarningAlreadEists
          closeModal={() => setFarmAlreadyExists(false)}
          alert="Já existe uma Fazenda com esse Id"
          subAlert="Por favor Digite um Id da Fazenda diferente"
        />
      )}
    </S.Container>
  );
};

export default CreateNewFarm;
