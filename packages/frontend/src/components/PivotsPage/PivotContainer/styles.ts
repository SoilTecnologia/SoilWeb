import styled, { css } from "styled-components";

export const Container = styled.div`
  display: flex;
  justify-content: center;
  padding: 15px 10px;
  //align-items: center;
`;
export const Box = styled.button`
  display: flex;
  justify-content: center;
  margin: ${({ theme }) => theme.spacings.xxsmall};
  background: linear-gradient(
    ${({ theme }) => theme.colors.primary} 90%,
    ${({ theme }) => theme.colors.primary_gradient} 100%
  );
  box-shadow: 5px 5px 15px gray;
  padding: ${({ theme }) => theme.spacings.small};
  border-radius: 0.9rem;
  transition: all 0.3s linear;

  &:hover {
    cursor: pointer;
    opacity: 0.85;
  }
  @media (max-width: 1100px) {
    min-width: 60vw;
    max-width: 60vw;
  }
  @media (max-width: 570px) {
    min-width: 60vw;
  }
`;

export const ContentData = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
export const PivotNameWrapper = styled.div`
  background: ${({ theme }) => theme.colors.secondary};
  padding: ${({ theme }) => theme.spacings.xxsmall}
    ${({ theme }) => theme.spacings.small};
  align-items: center;
  justify-content: center;
  border-radius: 2.5rem;
`;

export const PivotName = styled.h4`
  color: ${({ theme }) => theme.colors.primary};
  font-family: ${({ theme }) => theme.font.family.Syncopate_bold};
  font-size: ${({ theme }) => theme.font.sizes.xlarge};

  @media (max-width: 1100px) {
    font-size: ${({ theme }) => theme.font.sizes.large};
  }
  @media (max-width: 570px) {
    font-size: ${({ theme }) => theme.font.sizes.medium};
  }
`;
export const PivotState = styled.div`
  margin: 2rem 0 0 0;
  font-size: ${({ theme }) => theme.font.sizes.xlarge};
  color: ${({ theme }) => theme.colors.secondary};
  font-family: ${({ theme }) => theme.font.family.Montserrat_bold};
`;
