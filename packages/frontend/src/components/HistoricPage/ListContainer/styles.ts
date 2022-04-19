import styled, {css} from "styled-components";
export const Container = styled.div`
 ${({theme})=> css`
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
 `}
`;

export const HistoricList = styled.button`
 ${({theme})=> css`
    display:flex;
    flex-direction:column;
    width:80%;
    background:${theme.colors.primary};
    margin:10px;
    justify-content:center;
 `}
`;
export const Wrapper = styled.div`
  ${({theme})=> css`
   display:flex;
    flex-direction:column;
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
export const InitialStatus = styled.div`
  ${({theme})=> css`

  `}
`;
export const StopIcon = styled.div`
  ${({theme})=> css`

  `}
`;
