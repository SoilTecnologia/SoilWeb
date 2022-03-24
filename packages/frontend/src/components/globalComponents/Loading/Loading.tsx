import Logo from "../Logo";
import * as S from "./styles";

export const Loading = () => (
  <S.LoadContent>
    <S.ContentData>
      <Logo />
      <S.TextLoading>Carregando Informações...</S.TextLoading>
    </S.ContentData>
  </S.LoadContent>
);
