import styled, { css } from "styled-components";

export const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
`;
export const IconContent = styled.div``;

export const ContentTextModalInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
export const AlertMessage = styled.p`
  ${({ theme }) => css`
    color: ${theme.colors.primary};
  `}
`;
export const SubAlert = styled(AlertMessage)``;
export const Button = styled.button``;
