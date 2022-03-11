import { useContextActionCrud } from "hooks/useActionsCrud";
import { useContextData } from "hooks/useContextData";
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
    usersList,
  } = useContextData();
  const { getAllUser } = useContextActionCrud();

  const [isOptionUser, setIsOptionUser] = useState(false);

  const handleClickListUser = () => {
    setData(stateDefault);
  };
  const handleClickCreateUser = () => {
    setData({
      ...stateDefault,
      optionUser: "create",
    });
  };

  useEffect(() => {
    getAllUser();
  }, []);

  return (
    <S.Container>
      <S.ContentTittle>
        <S.OptionUser
          onClick={() => setIsOptionUser(!isOptionUser)}
          isActive={isOptionUser}
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
      <S.TabSelect>
        <S.ContentOption>
          {optionUser === "create" ? <CreateNewUser /> : <SwitchStateUser />}
        </S.ContentOption>
      </S.TabSelect>
    </S.Container>
  );
};

export default MainAdmin;
