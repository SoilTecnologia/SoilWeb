import styled, { css } from "styled-components";


export const Container=styled.div`
  display:flex;
  flex-direction: column;
  align-items:center;
`;
export const Box = styled.button`
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  margin: ${({theme})=>theme.spacings.xxsmall};
  background: linear-gradient( ${({theme})=>theme.colors.primary} 90%, ${({theme})=>theme.colors.primary_gradient} 100% );
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
  align-items: center;
  justify-content:center;
  width:max-content;
`;
export const PivotNameWrapper = styled.div`
  background:${({theme})=>theme.colors.secondary};
  padding:${({theme})=>theme.spacings.xxsmall} ${({theme})=>theme.spacings.small};
  align-items: center;
  justify-content:center;
  border-radius: 2.5rem;
`;

export const PivotName = styled.h4`
  color: ${({ theme }) => theme.colors.primary};
  font-family:${({theme})=>theme.font.family.Syncopate_bold};
  font-size:${({theme})=>theme.font.sizes.xlarge};

`;
export const PivotState = styled.div`
  margin: 2rem 0 0 0;
  font-size:${({theme})=>theme.font.sizes.xlarge};
  color:${({theme})=>theme.colors.secondary};
  font-family:${({theme})=>theme.font.family.Montserrat_bold};
`;





