import * as S from "./styles";
import { useRef } from "react";

import { useContextActionCrud } from "hooks/useActionsCrud";

import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useForm } from "react-hook-form";

import SelectOptionsComponent from "components/globalComponents/SelectOptionsComponent";
import ContentInputs from "components/globalComponents/ContentInputs";
import { UserCreate } from "utils/models/user";

const schema = Yup.object({
  login: Yup.string().required("Digite seu login"),
  password: Yup.string().required("Digite uma senha"),
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
  } = useForm<UserCreate>({ resolver: yupResolver(schema) });
  const formRef = useRef<HTMLFormElement>(null);
  //Functions
  const onSubmit = handleSubmit(({ user_type, login, password }) => {
    const newUser: UserCreate = {
      user_type,
      login,
      password,
    };
    createUser(newUser);
  });
  return (
    <S.Container>
      <S.Form onSubmit={onSubmit} ref={formRef}>
        <ContentInputs
          errorUserName={errors.login}
          label="LOGIN"
          id="login"
          type="text"
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
