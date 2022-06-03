import CreateNewUser from 'components/AdminPage/Users/CreateNewUser';
import * as S from "./styles";

const MainCreateUser = () => (
  <S.Container>
    <S.Content>
      <CreateNewUser notLogged />
    </S.Content>
  </S.Container>
);

export default MainCreateUser;
