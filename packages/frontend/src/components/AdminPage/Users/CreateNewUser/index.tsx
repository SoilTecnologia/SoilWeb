import { yupResolver } from "@hookform/resolvers/yup";
import ContentInputs from "components/globalComponents/ContentInputs";
import SelectOptionsComponent from "components/globalComponents/SelectOptionsComponent";
import { useContextActionCrud } from "hooks/useActionsCrud";
import  Router  from 'next/router';
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { UserCreate } from "utils/models/user";
import * as Yup from "yup";
import * as S from "./styles";

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

type createPros = {
  notLogged?: boolean
}
const CreateNewUser = ({notLogged}: createPros) => {
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
  const onSubmit = handleSubmit(async (data) => {
    createUser({
      user_type: data.user_type,
      login: data.login?.toLowerCase(),
      password: data.password,
    }, notLogged);

    if(notLogged) Router.push("/")
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
