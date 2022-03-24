import { useContextAuth } from "hooks/useLoginAuth";
import Router from "next/router";
import { destroyCookie } from "nookies";
import { useState } from "react";
import ModalDeleteData from "../ModalDeleteData";
import * as S from "./styles";

export const LogoutUser = () => {
  const [logout, setlogout] = useState(false);
  const { setUser } = useContextAuth();

  const NotSignUp = () => setlogout(false);
  const SignUp = () => {
    destroyCookie(null, "soilauth-token");
    destroyCookie(null, "soilauth-usertype");
    destroyCookie(null, "soilauth-userid");
    setUser(null);
    Router.push("/");
  };

  return (
    <>
      <S.Content onClick={() => setlogout(true)} title="Logout">
        <S.Logout />

        <S.TextLogout>SAIR</S.TextLogout>
      </S.Content>
      {logout && (
        <ModalDeleteData
          alertLabel="ENCERRAR SESSÃO"
          callbackNotDelete={NotSignUp}
          callbackDelete={SignUp}
        />
      )}
    </>
  );
};
