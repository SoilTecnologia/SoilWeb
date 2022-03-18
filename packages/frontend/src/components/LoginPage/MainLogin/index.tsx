import Logo from "components/globalComponents/Logo";
import ModalMessage from "components/globalComponents/ModalMessage";
import { useState } from "react";
import FormValidate from "../FormValidate";
import * as S from "./styles";

const MainLogin = () => {
  const [errorAuth, setErrorAuth] = useState(false);
  return (
    <S.Container>
      <S.WrapperModalAndForm>
        <S.ContentForm>
          <S.ContentLogo>
            <Logo />
          </S.ContentLogo>
          <FormValidate setErrorAuth={setErrorAuth} />
        </S.ContentForm>
        {errorAuth && (
          <S.ContentModal>
            <ModalMessage
              alert="CREDENCIAIS INCORRETAS"
              subAlert="TENTE NOVAMENTE"
              txtButton="FECHAR"
              callbackButtonClick={setErrorAuth}
            >
              <S.IconAttention />
            </ModalMessage>
          </S.ContentModal>
        )}
      </S.WrapperModalAndForm>

      <S.TextTech>TECNOLOGIA</S.TextTech>
      <div style={{ marginTop: "10px" }}></div>
      <S.TextTech>PARA IRRIGAÇÃO</S.TextTech>
    </S.Container>
  );
};

export default MainLogin;
