import * as S from "./styles";
import { useRef } from "react";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import ContentInputs from "components/globalComponents/ContentInputs";
import SelectOptionsComponent from "components/globalComponents/SelectOptionsComponent";
import User from "utils/models/user";

const schema = Yup.object({
  userName: Yup.string(),
  farm: Yup.string(),
  role: Yup.string(),
}).required();

type FormDataProps = {
  updateUser: User;
  updateUserData: (user: User) => void;
};
const optionsSelect = [
  {
    label: "ADMINISTRADOR(A)",
    value: "SUDO",
  },
  {
    label: "USUARIO",
    value: "USER",
  },
];
const UpdateUserSelected = ({ updateUser, updateUserData }: FormDataProps) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<User>({ resolver: yupResolver(schema) });
  const formRef = useRef<HTMLFormElement>(null);

  const onSubmit = handleSubmit((data) => {
    const newDataUser: User = {
      user_id: updateUser.user_id,
      user_name: data.user_name ? data.user_name : updateUser.user_name,
      farm: data.farm ? data.farm : updateUser.farm,
      user_type: data.user_type ? data.user_type : updateUser.user_type,
    };
    updateUserData(newDataUser);
  });

  return (
    <S.Form onSubmit={onSubmit} ref={formRef}>
      <ContentInputs
        errorUserName={errors.user_name}
        label="USUARIO"
        id="user_name"
        type="text"
        placeholder={updateUser.user_name}
        register={register}
      />

      <SelectOptionsComponent
        label="FUNÇÂO"
        id="user_type"
        register={register}
        options={optionsSelect}
      />

      <S.Button type="submit" value="Enviar" />
    </S.Form>
  );
};

export default UpdateUserSelected;
