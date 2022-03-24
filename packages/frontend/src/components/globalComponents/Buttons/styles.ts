import styled, { css } from "styled-components";
export const Container = styled.button`
  ${({ theme }) => css`
    width: max-content;

    margin: 0.5rem 1.2rem 0.3rem;
    padding: 0.7rem ${theme.spacings.small};
    background: ${theme.colors.primary};
    color: ${theme.colors.secondary};
    font-weight: 700;
    border-radius: 1rem;
    transition: all 0.3s linear;

    &:hover {
      cursor: pointer;
      opacity: 0.8;
    }
  `}
`;
