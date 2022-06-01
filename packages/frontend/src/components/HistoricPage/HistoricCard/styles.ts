import styled, {css} from "styled-components";
export const Card = styled.div`
 ${({theme})=> css`
    display:flex;
    flex-direction:column;
    width:80%;
    background: linear-gradient( ${theme.colors.primary} 80%, ${theme.colors.primary_gradient} 100% );
    margin:10px;
    align-items:center;
    border-radius:22.5px;
    padding: 20px;


 `}
`;
export const ExapandButton = styled.button`
 ${({theme})=> css`
    display:flex;
    margin:10px;
    align-items:center;
    border-radius:22.5px;
    background: ${theme.colors.primary};
    cursor: pointer;
 `}
`;
export const Wrapper = styled.div`
  ${({theme})=> css`
   display:flex;
    flex-direction:column;
    align-items:center;
  `}
`;
export const StatusWrapper = styled.div`
  ${({theme})=> css`
   display:flex;
    flex-direction:row;
    width:100%;
    justify-content:space-between;
  `}
`;
export const Text = styled.div`
  ${({theme})=> css`
    font-size:${theme.font.sizes.medium};
    color:${theme.colors.secondary};
    margin:${theme.spacings.xsmall};
    font-family:${theme.font.family.Montserrat_bold};
  `}
`;
export const Status = styled.div`
  ${({theme})=> css`
    display:flex;
    flex-direction:row;
  `}
`;
export const ImageContainer= styled.div`
${({theme})=> css`
  width:50px;
  height:50px;
  margin: 0 ${theme.spacings.xxsmall};
`}
`;


export const PercentChart=styled.div`
  display:flex;

  width:50% ;
  align-self:flex-start;
`
