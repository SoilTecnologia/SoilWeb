import styled, { css } from "styled-components";


export const Container=styled.div`
  display:flex;
  flex-direction: column;
  align-items:center;
`;
export const Box = styled.button`
  position: relative;
  width: 68rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: ${({theme})=>theme.spacings.xxsmall};
  background: linear-gradient( ${({theme})=>theme.colors.primary} 90%, ${({theme})=>theme.colors.primary_gradient} 100% );
  padding: ${({theme})=>theme.spacings.small};
  border-radius: 0.9rem;
  transition: all .3s linear;

  &:hover{
      cursor: pointer;
      opacity: 0.85;
    }
`;
export const ContentData = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
export const UserName = styled.h4`
  color: ${({ theme }) => theme.colors.secondary};
  margin: 0.5rem 0;
`;





