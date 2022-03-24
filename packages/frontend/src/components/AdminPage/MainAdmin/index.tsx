import ModalDeleteData from "components/globalComponents/ModalDeleteData";
import { useContextActionCrud } from "hooks/useActionsCrud";
import { useContextData } from "hooks/useContextData";
import { useContextAuth } from "hooks/useLoginAuth";
import Router from "next/router";
import { destroyCookie } from "nookies";
import { useEffect, useState } from "react";
import CreateNewUser from "../Users/CreateNewUser";
import SwitchStateUser from "../Users/SwitchStateUser";
import * as S from "./styles";

export type userOptions = "create" | "list" | null;

const MainAdmin = () => {
  const {
    setData,
    stateDefault,
    stateAdmin: { optionUser },
  } = useContextData();
  const { setUser } = useContextAuth();
  const { getAllUser } = useContextActionCrud();

  const [isOptionUser, setIsOptionUser] = useState(false);
  const [logout, setlogout] = useState(false);

  const handleClickListUser = () => {
    setData(stateDefault);
  };
  const handleClickCreateUser = () => {
    setData({
      ...stateDefault,
      optionUser: "create",
    });
  };
  const NotSignUp = () => setlogout(false);
  const SignUp = () => {
    destroyCookie(null, "soilauth-token");
    destroyCookie(null, "soilauth-usertype");
    destroyCookie(null, "soilauth-userid");
    setUser(null);
    Router.push("/");
  };

  useEffect(() => {
    getAllUser();
  }, []);

  return (
    <S.Container>
      <S.ContentLogout>
        <S.TextLogout onClick={() => setlogout(true)}>
          <S.Logout title="Logout" />
          SAIR
        </S.TextLogout>
        {logout && (
          <ModalDeleteData
            alertLabel="ENCERRAR SESSÃO"
            callbackNotDelete={NotSignUp}
            callbackDelete={SignUp}
          />
        )}
        <S.ContentTittle>
          <S.OptionUser
            onClick={() => setIsOptionUser(!isOptionUser)}
            isActive={isOptionUser}
            title="Opções de Usuario"
          >
            USUARIOS
            {isOptionUser && (
              <S.ContentOptionUser>
                <S.OptionCreateUser onClick={handleClickCreateUser}>
                  CRIAR USUARIOS
                </S.OptionCreateUser>
                <S.ListUser onClick={handleClickListUser}>
                  LISTAR USUARIOS
                </S.ListUser>
              </S.ContentOptionUser>
            )}
          </S.OptionUser>
        </S.ContentTittle>
      </S.ContentLogout>

      <S.TabSelect>
        <S.ContentOption>
          {optionUser === "create" ? <CreateNewUser /> : <SwitchStateUser />}
        </S.ContentOption>
      </S.TabSelect>
    </S.Container>
  );
};

export default MainAdmin;
