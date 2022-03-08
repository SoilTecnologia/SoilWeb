import * as S from "./styles";

const Header = (props) => {
  const { Text } = props;

  return (
    <S.Container>
      <S.TextContainer>
        <S.Text>
          {Text}
        </S.Text>
      </S.TextContainer>
    </S.Container>
  )
};

export default Header;
