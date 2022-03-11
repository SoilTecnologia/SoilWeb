import * as S from "./styles";
import { useRef } from "react";
import * as Yup from "yup";

import { useForm } from "react-hook-form";

import ContentInputs from "components/globalComponents/ContentInputs";
import Farm from "utils/models/farm";
import { useContextActionCrud } from "hooks/useActionsCrud";
import { yupResolver } from "@hookform/resolvers/yup";

type updateFarmProps = {
  farmSelected: Farm;
};
const schema = Yup.object({
  farm_name: Yup.string(),
  farm_city: Yup.string(),
  farm_lat: Yup.number(),
  farm_lng: Yup.number(),
}).required();
const UpdateFarmSelected = ({ farmSelected }: updateFarmProps) => {
  //Contexts
  const { updateFarm } = useContextActionCrud();
  //States
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<Farm>({ resolver: yupResolver(schema) });
  const formRef = useRef<HTMLFormElement>(null);
  //Functions
  const onSubmit = handleSubmit((data) => {
    const newFarm: Farm = {
      ...farmSelected,
      farm_name: data.farm_name ? data.farm_name : farmSelected.farm_name,
      farm_city: data.farm_city ? data.farm_city : farmSelected.farm_city,
      farm_lat: data.farm_lat ? data.farm_lat : farmSelected.farm_lat,
      farm_lng: data.farm_lng ? data.farm_lng : farmSelected.farm_lng,
    };

    updateFarm(newFarm);
  });

  return (
    <S.Form onSubmit={onSubmit} ref={formRef}>
      <ContentInputs
        errorUserName={errors.farm_name}
        label="FAZENDA"
        id="farm_name"
        type="text"
        placeholder={farmSelected.farm_name}
        register={register}
      />
      <ContentInputs
        errorUserName={errors.farm_city}
        label="CIDADE"
        id="farm_city"
        type="text"
        placeholder={farmSelected.farm_city}
        register={register}
      />
      <ContentInputs
        errorUserName={errors.farm_lat}
        label="LATITUDE"
        id="farm_lat"
        type="text"
        placeholder={farmSelected.farm_lat.toString()}
        register={register}
      />
      <ContentInputs
        errorUserName={errors.farm_lng}
        label="LONGITUDE"
        id="farm_lng"
        type="text"
        placeholder={farmSelected.farm_lng.toString()}
        register={register}
      />

      <S.Button type="submit" value="Enviar" />
    </S.Form>
  );
};

export default UpdateFarmSelected;
