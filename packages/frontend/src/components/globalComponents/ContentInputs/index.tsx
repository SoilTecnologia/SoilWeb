/* eslint-disable @typescript-eslint/no-explicit-any */
import { FieldError, UseFormRegister } from "react-hook-form";
import InputsLogin from "../InputsLogin";
import * as S from "./styles";

type contentInputProps = {
  errorUserName: FieldError | undefined;
  label: string;
  id: string;
  type: string;
  placeholder: string;
  register: UseFormRegister<any>;
};

const ContentInputs = ({
  errorUserName,
  label,
  id,
  type,
  placeholder,
  register,
}: contentInputProps) => (
  <InputsLogin error={errorUserName && errorUserName.message}>
    <S.ContentIconInput>
      <S.Label>{label}</S.Label>
      <S.Inputs
        id={id}
        type={type}
        placeholder={placeholder.toUpperCase()}
        {...register(id)}
      />
    </S.ContentIconInput>
  </InputsLogin>
);

export default ContentInputs;
