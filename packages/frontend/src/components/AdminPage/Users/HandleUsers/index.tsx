import { useContextData } from "hooks/useContextData";
import CreateNewUser from "../CreateNewUser";
import SwitchStateUser from "../SwitchStateUser";
import * as S from "./styles";

const HandleUsers = () => {
  const {
    stateAdmin: { optionUser },
  } = useContextData();
  return (
    <S.Container>
      {optionUser === "create" ? <CreateNewUser /> : <SwitchStateUser />}
    </S.Container>
  );
};

export default HandleUsers;
