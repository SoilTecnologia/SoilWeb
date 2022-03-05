import { useContextData } from "hooks/useContextData";
import { useState } from "react";

import HandleUsers from "../Users/HandleUsers";
import * as S from "./styles";

export type userOptions = "create" | "list" | null;

const MainAdmin = () => {
  const { setData, stateDefault } = useContextData();
  const [isOptionUser, setIsOptionUser] = useState(false);

  const handleClickListUser = () => {
    setData(stateDefault);
    console.log("hANDLE" + stateDefault);
  };
  const handleClickCreateUser = () => {
    setData({
      ...stateDefault,
      optionUser: "create",
    });
  };

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
        <HandleUsers />
      </S.TabSelect>
    </S.Container>
  );
};

export default MainAdmin;
