import * as S from "./styles";
import { Dispatch, SetStateAction, useRef } from "react";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import ContentInputs from "components/globalComponents/ContentInputs";
import SelectOptionsComponent from "components/globalComponents/SelectOptionsComponent";
import User from "utils/models/user";
import { useContextActionCrud } from "hooks/useActionsCrud";

const schema = Yup.object({
  userName: Yup.string(),
  farm: Yup.string(),
  role: Yup.string(),
}).required();

type FormDataProps = {
  dataUser: User;
  closeModal: () => void;
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
const UpdateUserSelected = ({ dataUser, closeModal }: FormDataProps) => {
  //Contexts

  const { updateUser } = useContextActionCrud();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<User>({ resolver: yupResolver(schema) });
  const formRef = useRef<HTMLFormElement>(null);

  const onSubmit = handleSubmit(async (data) => {
    const newDataUser: User = {
      user_id: dataUser.user_id,
      password: dataUser.password,
      login: data.login ? data.login : dataUser.login,
      user_type: data.user_type ? data.user_type : dataUser.user_type,
    };
    closeModal();
    updateUser(newDataUser);
  });

  return (
    <S.Form onSubmit={onSubmit} ref={formRef}>
      <ContentInputs
        errorUserName={errors.login}
        label="USUARIO"
        id="login"
        type="text"
        placeholder={dataUser.login ? dataUser.login : "USER"}
        register={register}
      />
      <ContentInputs
        errorUserName={errors.password}
        label="SENHA"
        id="password"
        type="text"
        placeholder={"..."}
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
