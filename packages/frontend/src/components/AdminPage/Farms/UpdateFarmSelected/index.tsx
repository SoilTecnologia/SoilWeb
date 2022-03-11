import * as S from "./styles";
import { useRef, useState } from "react";
import * as Yup from "yup";

import { useForm } from "react-hook-form";

import ContentInputs from "components/globalComponents/ContentInputs";
import Farm, { FarmFormCreate } from "utils/models/farm";
import { useContextActionCrud } from "hooks/useActionsCrud";
import { yupResolver } from "@hookform/resolvers/yup";
import { defaultError } from "components/AdminPage/Pivots/CreatePivot";
import { MessageError } from "components/AdminPage/Pivots/CreatePivot/styles";

type updateFarmProps = {
  farmSelected: Farm;
  closeModal: () => void;
};
type errorProps = {
  type: null | "lat" | "lng";
  error: string | null;
};
const schema = Yup.object({
  farm_name: Yup.string(),
  farm_city: Yup.string(),
  farm_lat: Yup.string(),
  farm_lng: Yup.string(),
}).required();

const UpdateFarmSelected = ({ farmSelected, closeModal }: updateFarmProps) => {
  //Contexts
  const { updateFarm } = useContextActionCrud();
  //States
  const [error, setError] = useState<errorProps>(defaultError);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FarmFormCreate>({ resolver: yupResolver(schema) });
  const formRef = useRef<HTMLFormElement>(null);
  //Functions
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

  const handleDataForm = (dataForm: FarmFormCreate) => {
    const latNotNull = dataForm.farm_lat
      ? dataForm.farm_lat
      : farmSelected.farm_lat;
    const lngNotNull = dataForm.farm_lng
      ? dataForm.farm_lng
      : farmSelected.farm_lng;
    const latForNumber = formatLatAndLong("lat", latNotNull.toString());
    const longForNumber = formatLatAndLong("lng", lngNotNull.toString());

    if (latForNumber && longForNumber) {
      const newFarm: Farm = {
        ...farmSelected,
        farm_name: dataForm.farm_name
          ? dataForm.farm_name
          : farmSelected.farm_name,
        farm_city: dataForm.farm_city
          ? dataForm.farm_city
          : farmSelected.farm_city,
        farm_lat: latForNumber,
        farm_lng: longForNumber,
      };
      return newFarm;
    }
  };
  const onSubmit = handleSubmit((data) => {
    const addFarm = handleDataForm(data);
    if (addFarm) {
      closeModal();
      updateFarm(addFarm);
    }
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
      {error && error.type === "lat" && (
        <MessageError>{error.error}</MessageError>
      )}
      <ContentInputs
        errorUserName={errors.farm_lng}
        label="LONGITUDE"
        id="farm_lng"
        type="text"
        placeholder={farmSelected.farm_lng.toString()}
        register={register}
      />
      {error && error.type === "lng" && (
        <MessageError>{error.error}</MessageError>
      )}
      <S.Button type="submit" value="Enviar" />
    </S.Form>
  );
};

export default UpdateFarmSelected;
