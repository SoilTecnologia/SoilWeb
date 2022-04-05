import * as S from "./styles";
import { format } from 'date-fns';
import { ReactChild } from "react";

type HeaderProps = {
  text: string | number | undefined,
  subHeaderText?: string | Date,
  children?: ReactChild
}

const Header = ({ text, subHeaderText, children }: HeaderProps) => {

  const dateFormater = () => {
    if (subHeaderText !== 'Nunca foi Atualizado' && subHeaderText) {
       const updatedDate = format(new Date(subHeaderText), "dd/MM/yyyy' às 'kk:mm")
       return updatedDate
    }
    return 'Nunca foi Atualizado'
  }


  return (
    <S.Container>
      {children && (
        <S.ChildrenContainer>
          {children}
        </S.ChildrenContainer>
      )}
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
