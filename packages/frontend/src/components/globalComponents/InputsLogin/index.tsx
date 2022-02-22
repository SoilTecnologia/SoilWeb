import * as S from "./styles";

type props = {
  children: React.ReactNode;
  error: string | undefined;
};

const InputsLogin = ({ children, error }: props) => {
  return (
    <S.ContentInputs>
      {children}
      {error && (
        <S.Alert role="alert">
          <S.Icon></S.Icon>
          <S.TextAlert>{error}</S.TextAlert>
        </S.Alert>
      )}
    </S.ContentInputs>
  );
};

export default InputsLogin;
