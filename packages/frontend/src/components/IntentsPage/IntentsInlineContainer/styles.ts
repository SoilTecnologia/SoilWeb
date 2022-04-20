import styled, {css} from "styled-components";
export const IntentsAlignment=styled.div`
${({theme})=>css`
  display:flex;
  width:100%;
  flex-direction:row;
  justify-content: space-around;
  align-items:center;
  //margin: 30px;
  `}
`;
export const IntentWrapper= styled.div`
${({theme})=>css`
  display:flex;
  flex-direction:column;
  align-self:center;
  align-items:center;
  justify-content:center;

  `}
`;
export const IntentName = styled.h1`
${({theme})=> css`
  text-align:center;
  align-self:center;
  font-size:${theme.font.sizes.xxlarge};
  color:${theme.colors.primary};
  font-family:${theme.font.family.Montserrat_bold};
`}
`;
