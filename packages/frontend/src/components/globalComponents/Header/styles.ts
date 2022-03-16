import styled, {css} from "styled-components";

export const Container = styled.div`
  height:14rem;
  background: ${({ theme }) => theme.colors.primary};
  align-items:center;
  justify-content:center;
`;
export const TextContainer=styled.div`
  display:flex;
  height:14rem;
  align-self:center;
  align-items:center;
  justify-content:center;
  flex-direction:column;
`;
export const Text = styled.h1`
  font-size: ${({theme})=>theme.font.sizes.xxbiglarge};
  color: ${({theme})=>theme.colors.secondary};
  font-family: ${({theme})=>theme.font.family.Poppins};
  letter-spacing: 0.3rem;
`;

export const LastUpdateWrapper =styled.div`
  display:flex;
  flex-direction:row;
  justify-content:center;
  align-items:center;
`;

export const LastUpdateText = styled.h1`
  font-size:${({theme})=>theme.font.sizes.xlarge};
  color:${({theme})=>theme.colors.secondary};
  font-family:${({theme})=>theme.font.family.Montserrat_bold};
  font-weight:bold;
  padding:${({theme})=>theme.spacings.xxsmall};
`;

export const SubText = styled.h2`
  font-size:${({theme})=>theme.font.sizes.large};
  color:${({theme})=>theme.colors.secondary};
  font-family:${({theme})=>theme.font.family.Montserrat_light};
`;



