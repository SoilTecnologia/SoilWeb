import styled, {css} from "styled-components";

export const CurrentStateWrapper = styled.div`
  display:flex;
  align-self:stretch;
  flex-direction:column;
  justify-content:center;
`
export const RowAlignment=styled.div`
display:flex;
justify-content:center;
align-self:stretch;
  flex-direction:row;
`
export const FailStateWrapper = styled.div`
${({theme})=> css`
  display:flex;
  flex-direction:column;
  align-items:center;
  margin:${theme.spacings.xsmall};
`}
`
export const ImageContainer= styled.div`
${({theme})=> css`
  width:70px;
  height:70px;
  margin: 0 ${theme.spacings.xxsmall};
`}
`;
export const StateText=styled.h1`
${({theme})=> css`
  font-size:${theme.font.sizes.large};
  color:${theme.colors.cancel};
  font-family:${theme.font.family.Montserrat_bold};
`}
`

export const Percent = styled.h1`
${({theme})=> css`
  text-align:center;
  align-self:center;
  font-size:${theme.font.sizes.xxlarge};
  color:${theme.colors.primary};
  font-family:${theme.font.family.Montserrat_bold};
`}
`;


