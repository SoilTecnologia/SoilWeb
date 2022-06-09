import styled, {css} from "styled-components";
export const Container =styled.div`
${({theme})=> css`
  display:flex;
  margin:35px;
`}
`;
export const PercentView = styled.div`
${({theme})=>css`

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding:${theme.spacings.small};
`}
`;
export const PercentButtons = styled.button`
${({theme})=>css`
  display:flex;
  padding: ${theme.spacings.xxsmall};
  margin: 10px;
  background-color: ${theme.colors.primary};
  justify-content: center;
  align-items: center;
  background: linear-gradient( ${theme.colors.primary} 90%, ${theme.colors.primary_gradient} 100% );
  box-shadow: 5px 5px 15px gray;
  transition: all .3s linear;

  &:hover{
    cursor: pointer;
    opacity: 0.85;
  }
  `}
`;
export const PercentButtonText = styled.h1`
${({theme})=>css`
  font-size: ${theme.font.sizes.xxlarge};
  margin: 5px;
  color: ${theme.colors.secondary};
  font-family: ${theme.font.family.Montserrat_bold};
  `}
`;
export const PercentInput = styled.input`
  min-height:60px;
  min-width:150px;
  border-radius: 4px;
  border:1px solid black;
  padding:8px;
  text-align: center;
  font-size: 16px;
`;
