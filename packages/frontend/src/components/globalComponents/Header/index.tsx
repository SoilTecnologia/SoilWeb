import * as S from "./styles";

type HeaderProps = {
  text: string;
};

const Header = ({ text }: HeaderProps) => {
  return (
    <S.Container>
      <S.TextContainer>
        <S.Text>{text}</S.Text>
      </S.TextContainer>
    </S.Container>
  );
};

export default Header;
