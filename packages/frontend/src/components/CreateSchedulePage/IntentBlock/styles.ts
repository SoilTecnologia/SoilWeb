import styled, {css} from "styled-components";


export const Container =styled.div`
  display: flex;
  flex-direction:row;
  justify-content:center;
`;
///left side
export const ScheduleTypeContainer = styled.div`
${({theme})=>css`
  display: flex;
  width:100%;
  flex-direction:column;
  align-items:center;
`}
`;
export const HeaderText = styled.h1`
  ${({ theme }) => css`
    font-size: ${theme.font.sizes.xxlarge};
    color: ${theme.colors.primary};
    font-family: ${theme.font.family.Montserrat_bold};
    padding: 0 ${theme.spacings.xxsmall};
  `}
`;
export const Wrapper=styled.div`
  display:flex;
  flex-direction:column;
  margin-top:2rem;
  align-items:center;
`;

export const RowAlign = styled.div`
  display:flex;
  flex-direction:row;
  justify-content:space-around;
  align-items:center;
`;

export const ScheduleTypeButton= styled.button<{isSelected:boolean}>`

  ${({ theme }) => css`
    display: flex;
    width: 30%;
    min-height:8rem;
    align-self: center;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    padding: 1.5rem ${theme.spacings.xlarge};
    margin: 1.5rem ${theme.spacings.xlarge};
    background: linear-gradient(
      ${theme.colors.primary} 90%,
      ${theme.colors.primary_gradient} 100%
    );
    box-shadow: 5px 5px 15px gray;
    transition: all 0.5s linear;
    border-radius: 1.5rem;

    &:hover {
      cursor: pointer;
      opacity: 0.85;
    }
  `}
  ${({ theme,isSelected }) => !isSelected&&`

    background:${theme.colors.off};

  `}

`;
export const ButtonText = styled.h1`
  ${({ theme }) => css`
    font-size: ${theme.font.sizes.xlarge};
    color: ${theme.colors.secondary};
    font-family: ${theme.font.family.Montserrat_bold};
    padding: 0 ${theme.spacings.xxsmall};
  `}
`;



///right side
export const IntentContainer = styled.div`
${({theme})=>css`
  display: flex;
  width:100%;
  flex-direction:column;
  align-items:center;
  padding:${theme.spacings.xsmall};
  `}
`;



