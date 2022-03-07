import * as S from "./styles";
import { Dispatch, SetStateAction, useRef } from "react";

import InputsLogin from "components/globalComponents/InputsLogin";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useContextAuth } from "hooks/useLoginAuth";

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
type FormDataProps = {
  setErrorAuth: Dispatch<SetStateAction<boolean>>;
};

const FormValidate = ({ setErrorAuth }: FormDataProps) => {
  //Contexts

  const { signIn } = useContextAuth();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({ resolver: yupResolver(schema) });
  const formRef = useRef<HTMLFormElement>(null);

  const onSubmit = handleSubmit(async (data) => {
    const response = await signIn(data.user, data.password);
    !response && setErrorAuth(true);
  });

  return (
    <S.Form onSubmit={onSubmit} ref={formRef}>
      <InputsLogin error={errors.user && errors.user.message}>
        <S.ContentIconInput>
          <S.IconUser />
          <S.Inputs
            id="user"
            type="text"
            placeholder="Digite seu usuário"
            {...register("user", {
              required: "Por favor digite seu nome de usuário",
            })}
          />
        </S.ContentIconInput>
      </InputsLogin>

      <InputsLogin error={errors.password && errors.password.message}>
        <S.ContentIconInput>
          <S.IconPassword />
          <S.Inputs
            id="password"
            type="password"
            placeholder="Digite sua senha"
            {...register("password", {
              required: "Por favor digite sua senha",
            })}
          />
        </S.ContentIconInput>
      </InputsLogin>
      <S.Button type="submit" value="Enviar" />
    </S.Form>
  );
};

export default FormValidate;
