import * as S from "./styles";
import { format } from 'date-fns';

type HeaderProps = {
  text: string | number | undefined,
  subHeaderText?: string | Date,
}

const Header = ({ text, subHeaderText }: HeaderProps) => {

  const dateFormater = () => {
    if (subHeaderText !== 'Nunca foi Atualizado' && subHeaderText) {
      const updatedDate = format(new Date(subHeaderText), "dd/MM/yyyy' às 'kk:mm")
      return updatedDate
    }
    return 'Nunca foi Atualizado'
  }


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
                {dateFormater()}
              </S.SubText>
            </S.LastUpdateWrapper>

          )
        }
      </S.TextContainer>
    </S.Container>
  )
};

export default Header;
