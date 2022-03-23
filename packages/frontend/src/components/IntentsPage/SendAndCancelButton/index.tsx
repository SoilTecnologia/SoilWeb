import * as S from "./styles";

const SendAndCancelButton = () => {


  return (
    <S.Container>
      <S.ResetButton>
        <S.ButtonText>
          Cancelar
        </S.ButtonText>

      </S.ResetButton>
      <S.ConfirmButton>
        <S.ButtonText>
          Confirmar
        </S.ButtonText>
      </S.ConfirmButton>
    </S.Container>
  )
};

export default SendAndCancelButton;
