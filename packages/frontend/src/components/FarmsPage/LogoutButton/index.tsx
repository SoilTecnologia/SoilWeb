import * as S from "./styles";
import { useContextAuth } from "hooks/useLoginAuth";
const LogoutButton = () => {
  const { signOut } = useContextAuth();

  return (
    <S.Button onClick={signOut}>
      <S.Icon />
      <S.Text>
        Sair
      </S.Text>
    </S.Button>
  )
};

export default LogoutButton;
