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
`;
export const Text = styled.h1`
  font-size: ${({theme})=>theme.font.sizes.xxlarge};
  color: ${({theme})=>theme.colors.secondary};
  font-family: ${({theme})=>theme.font.family.Poppins};
  letter-spacing: 0.3rem;
`;
