import Logo from "components/globalComponents/Logo";
import FormValidate from "../FormValidate";
import * as S from "./styles";

const MainLogin = () => (
  <S.Container>
    <FormValidate />
    <Logo />
  </S.Container>
);

export default MainLogin;
