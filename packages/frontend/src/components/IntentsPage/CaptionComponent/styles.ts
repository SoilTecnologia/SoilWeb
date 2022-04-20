import styled, {css} from "styled-components";
export const Container =styled.div`
 ${({theme})=> css`
  display:flex;
  width:100%;
  flex-direction:column;
  align-items:center;
 `}
`;
export const Text= styled.h1`
 ${({theme})=> css`
  font-size: ${theme.font.sizes.xlarge};
  font-family: ${theme.font.family.Montserrat_bold};
  color: ${theme.colors.primary};
  margin:0 5px;
`}
`
export const CaptionWrapper = styled.div`
  display:flex;
  width:100%;
  flex-direction:row;
  align-items:center;
  justify-content:space-evenly;
  margin:5px;
`;


export const CaptionAlignment = styled.div`
 display:flex;
  flex-direction:row;
`;


export const WetDot = styled.div`
${({theme})=> css`
  height: ${theme.font.sizes.xlarge};
  width: ${theme.font.sizes.xlarge};
  background:${theme.colors.wet};
  border-radius:100%;

  `}
`
export const DryDot = styled.div`
${({theme})=> css`
  height: ${theme.font.sizes.xlarge};
  width: ${theme.font.sizes.xlarge};
  background:${theme.colors.dry};
  border-radius:100%;

  `}
`
export const OffDot = styled.div`
${({theme})=> css`
  height: ${theme.font.sizes.xlarge};
  width: ${theme.font.sizes.xlarge};
  background:${theme.colors.off};
  border-radius:100%;

  `}
`
export const OfflineDot = styled.div`
${({theme})=> css`
  height: ${theme.font.sizes.xlarge};
  width: ${theme.font.sizes.xlarge};
  background:${theme.colors.offline};
  border-radius:100%;

  `}
`
