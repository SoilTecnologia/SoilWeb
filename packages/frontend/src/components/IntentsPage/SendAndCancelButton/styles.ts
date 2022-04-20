import styled, {css} from "styled-components";
export const Container =styled.div`
  ${({theme})=> css`
    display:flex;
    width:85%;
    align-items:center;
    justify-content:space-evenly;
  `}
`;
export const ConfirmButton=styled.button`
  ${({theme})=> css`
  display:flex;
  padding: ${theme.spacings.xxsmall} ${theme.spacings.small};
  background:${theme.colors.primary} ;
  background: linear-gradient( ${theme.colors.primary} 80%, ${theme.colors.primary_gradient} 100% );
  box-shadow: 5px 5px 15px gray;
  transition: all .3s linear;
  border-radius: 1.5rem;

  &:hover{
    cursor: pointer;
    opacity: 0.85;
  }
  `}
`
export const ResetButton=styled.button`
  ${({theme})=> css`
  display:flex;
  padding: ${theme.spacings.xxsmall} ${theme.spacings.small};
  background: ${theme.colors.cancel} ;
  background: linear-gradient( ${theme.colors.cancel} 80%, darkred 100% );
  box-shadow: 5px 5px 15px gray;
  transition: all .3s linear;
  border-radius: 1.5rem;

  &:hover{
    cursor: pointer;
    opacity: 0.85;
  }
  `}
`;
export const ButtonText = styled.h1`
  ${({theme})=>css`
  font-size: ${theme.font.sizes.xxlarge};
  margin: 5px;
  color: ${theme.colors.secondary};
  font-family: ${theme.font.family.Montserrat_bold};
  `}
`;
