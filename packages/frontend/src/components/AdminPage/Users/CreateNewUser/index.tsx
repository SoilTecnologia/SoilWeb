import * as S from "./styles";
import { useRef } from "react";

import { useContextActionCrud } from "hooks/useActionsCrud";

import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useForm } from "react-hook-form";

import SelectOptionsComponent from "components/globalComponents/SelectOptionsComponent";
import ContentInputs from "components/globalComponents/ContentInputs";
import User, { UserCreate } from "utils/models/user";

const schema = Yup.object({
  user_name: Yup.string()
    .required("Digite um nome de usuario")
    .min(3, "Minimo de 3 caractéres"),
  login: Yup.string(),
  password: Yup.string(),
  user_type: Yup.string().required("Escolha um função"),
}).required();

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

const CreateNewUser = () => {
  //Contexts
  const { createUser } = useContextActionCrud();

  //states
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<User>({ resolver: yupResolver(schema) });
  const formRef = useRef<HTMLFormElement>(null);
  //Functions
  const onSubmit = handleSubmit((data) => {
    const newDataUser: UserCreate = {
      user_name: data.user_name,
      login: data.login ? data.login : undefined,
      password: data.password ? data.password : undefined,
      user_type: data.user_type,
    };
    createUser(newDataUser);
  });
  return (
    <S.Container>
      <S.Form onSubmit={onSubmit} ref={formRef}>
        <ContentInputs
          errorUserName={errors.user_name}
          label="USUARIO"
          id="user_name"
          type="text"
          placeholder="USERNAME"
          register={register}
        />
        <ContentInputs
          errorUserName={errors.login}
          label="LOGIN"
          id="login"
          type="email"
          placeholder="LOGIN"
          register={register}
        />

        <ContentInputs
          errorUserName={errors.password}
          label="SENHA"
          id="password"
          type="text"
          placeholder="PASSWORD"
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
    </S.Container>
  );
};

export default CreateNewUser;
