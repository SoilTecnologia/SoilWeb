import * as S from "./styles";
import { useRef } from "react";

import InputsLogin from "components/globalComponents/InputsLogin";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

const schema = Yup.object({
  user: Yup.string()
    .required("Por favor digite um nome de usuário")
    .min(3, "O nome deve ter mais de 3 letras"),
  password: Yup.string()
    .required("Por favor digite uma senha")
    .min(6, "A senha deve ter pelo menos 6 caracteres"),
}).required();

type FormData = {
  user: string;
  password: string;
};

const FormValidate = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({ resolver: yupResolver(schema) });
  const formRef = useRef<HTMLFormElement>(null);

  const onSubmit = handleSubmit(() => console.log(""));

  return (
    <S.Form onSubmit={onSubmit} ref={formRef}>
      <S.TextTech>TECNOLOGIA PARA IRRIGAÇÃO</S.TextTech>

      <InputsLogin error={errors.user && errors.user.message}>
        <S.Inputs
          id="user"
          type="text"
          placeholder="Digite seu usuário"
          {...register("user", {
            required: "Por favor digite seu nome de usuário",
          })}
        />
      </InputsLogin>

      <InputsLogin error={errors.password && errors.password.message}>
        <S.Inputs
          id="password"
          type="password"
          placeholder="Digite sua senha"
          {...register("password", {
            required: "Por favor digite sua senha",
          })}
        />
      </InputsLogin>
      <S.Button type="submit" value="Enviar" />
    </S.Form>
  );
};

export default FormValidate;
