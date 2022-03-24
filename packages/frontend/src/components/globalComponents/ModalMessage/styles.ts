import styled, { css } from "styled-components";

export const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;

  background: ${({ theme }) => theme.colors.secondary};
  padding: 4rem 8rem;
  border-radius: 1rem;
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
export const Button = styled.button`
  margin: 0 1rem;
`;

export const ContentButtons = styled.div`
  width: 50%;
  display: flex;
  align-items: space-evenly;
  justify-content: space-around;
  margin: 3rem 1rem;

  padding: 0 2rem;
`;
