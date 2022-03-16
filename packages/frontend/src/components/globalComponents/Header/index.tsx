import * as S from "./styles";

type HeaderProps = {
  text: string | number | undefined,
  subHeaderText?: string | number | undefined,
}

const Header = ({ text, subHeaderText }: HeaderProps) => {

  return (
    <S.Container>
      <S.TextContainer>
        <S.Text>
          {text}
        </S.Text>
        {subHeaderText
          && (
              <S.LastUpdateWrapper>
                <S.LastUpdateText>
                  Última Atualização:
                </S.LastUpdateText>
                <S.SubText>
                  {subHeaderText}
                </S.SubText>
              </S.LastUpdateWrapper>

          )
        }
      </S.TextContainer>
    </S.Container>
  )
};

export default Header;
