import { yupResolver } from "@hookform/resolvers/yup";
import ContentInputs from "components/globalComponents/ContentInputs";
import { useContextActionCrud } from "hooks/useActionsCrud";
import { useContextData } from "hooks/useContextData";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { FarmCreate } from "utils/models/farm";
import * as S from "./styles";

import * as Yup from "yup";

const schema = Yup.object({
  farm_name: Yup.string()
    .required("Digite um nome de usuario")
    .min(3, "Minimo de 3 caractéres"),
  farm_city: Yup.string().required("Digite uma cidade"),
  farm_lat: Yup.number().required("Digite a Latitude"),
  farm_lng: Yup.number().required("Digite a Longitude"),
}).required();
const CreateNewFarm = () => {
  //Contexts
  const { createFarm } = useContextActionCrud();
  const { stateAdmin } = useContextData();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FarmCreate>({ resolver: yupResolver(schema) });
  const formRef = useRef<HTMLFormElement>(null);
  const onSubmit = handleSubmit((data) => {
    const newFarmUser: FarmCreate = {
      farm_name: data.farm_name,
      farm_city: data.farm_city,
      farm_lat: data.farm_lat,
      farm_lng: data.farm_lng,
    };
    if (stateAdmin.dataUserSelected) {
      createFarm(newFarmUser, stateAdmin.dataUserSelected.user_id);
    }
  });
  return (
    <S.Container>
      <S.Form onSubmit={onSubmit} ref={formRef}>
        <ContentInputs
          errorUserName={errors.farm_name}
          label="FAZENDA"
          id="farm_name"
          type="text"
          placeholder="FAZENDA"
          register={register}
        />
        <ContentInputs
          errorUserName={errors.farm_city}
          label="FAZENDA"
          id="farm_city"
          type="text"
          placeholder="CIDADE"
          register={register}
        />
        <ContentInputs
          errorUserName={errors.farm_lat}
          label="FAZENDA"
          id="farm_lat"
          type="text"
          placeholder="LATITUDE"
          register={register}
        />
        <ContentInputs
          errorUserName={errors.farm_lng}
          label="FAZENDA"
          id="farm_lng"
          type="text"
          placeholder="LONGITUDE"
          register={register}
        />
        <S.Button type="submit" value="Enviar" />
      </S.Form>
    </S.Container>
  );
};

export default CreateNewFarm;
