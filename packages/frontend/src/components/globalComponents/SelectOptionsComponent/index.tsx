/* eslint-disable @typescript-eslint/no-explicit-any */
import { UseFormRegister } from "react-hook-form";
import * as S from "./styles";

type itensOptionSelect = {
  value: string;
  label: string;
};
type selectOptionsProps = {
  label: string;
  id: string;
  register: UseFormRegister<any>;
  options: itensOptionSelect[];
};

const SelectOptionsComponent = ({
  label,
  id,
  register,
  options,
}: selectOptionsProps) => (
  <S.Container>
    <S.Label>{label}</S.Label>
    <S.Select {...register(id)}>
      {options.map((opt, index) => (
        <option key={index} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </S.Select>
  </S.Container>
);

export default SelectOptionsComponent;
