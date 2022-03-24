import { LogoutUser } from "../Logout/LogoutUser";
import * as S from "./styles";

type HeaderProps = {
  text: string;
};

const Header = ({ text }: HeaderProps) => {
  return (
    <S.Container>
      <S.ContentLogout>
        <LogoutUser />

        <S.TextContainer>
          <S.Text>{text}</S.Text>
        </S.TextContainer>
      </S.ContentLogout>
    </S.Container>
  );
};

export default Header;
