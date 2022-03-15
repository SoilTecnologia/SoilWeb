import styled, { css } from "styled-components";


export const Container=styled.div`
  display:flex;
  flex-direction: column;
  align-items:center;
`;
export const Box = styled.button`
  display: flex;
  flex-direction:row;
  justify-content:space-between;
  align-items:center;
  position: relative;
  width: 60%;
  margin: ${({theme})=>theme.spacings.xsmall};
  background: linear-gradient( ${({theme})=>theme.colors.primary} 80%, ${({theme})=>theme.colors.primary_gradient} 100% );
  box-shadow: 5px 5px 15px gray;
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
  align-items: flex-start;
  padding: ${({theme})=>theme.spacings.xxsmall};
`;
export const Text = styled.h4`
  color: ${({ theme }) => theme.colors.secondary};
  margin: 0.5rem 0;
  font-size:${({theme})=>theme.font.sizes.xxlarge};
`;





