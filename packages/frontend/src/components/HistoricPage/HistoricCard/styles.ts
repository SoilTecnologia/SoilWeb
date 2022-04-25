import styled, {css} from "styled-components";
export const Card = styled.button`
 ${({theme})=> css`
    display:flex;
    flex-direction:row;
    width:80%;
    background:${theme.colors.primary} ;
    background: linear-gradient( ${theme.colors.primary} 80%, ${theme.colors.primary_gradient} 100% );
    margin:10px;
    align-items:center;
    justify-content:space-between;
    border-radius:22.5px;
    padding: 20px;;
    &:hover{
    cursor: pointer;
    opacity: 0.85;
  }

 `}
`;
export const Wrapper = styled.div`
  ${({theme})=> css`
   display:flex;
    flex-direction:column;
    align-items:center;
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
