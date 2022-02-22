import styled, { css } from "styled-components";

export const Form = styled.form`
  ${({ theme }) => css`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    margin-bottom: 7rem;

    background: ${theme.colors.secondary};
    padding: ${theme.spacings.large} ${theme.spacings.small};
    border-radius: 2rem;
  `}
`;
export const Inputs = styled.input`
  ${({ theme }) => css`
    width: 80%;
    padding: ${theme.spacings.xxsmall} ${theme.spacings.xsmall};
    font-size: 1.4rem;
    background: ${theme.colors.light};
    border-radius: 0.7rem;
    text-align: start;
    color: ${theme.colors.primary};
    transition: all 0.3s linear;
    ::placeholder {
      color: rgba(155, 155, 155, 0.95);
    }

    @media (min-width: ${theme.media.medium}) {
      width: 24rem;
    }
    @media (min-width: ${theme.media.xmedium}) {
      font-size: ${theme.font.sizes.small};
    }
  `}
`;

export const Button = styled.input`
  ${({ theme }) => css`
    width: 60%;
    margin-bottom: 0.3rem;
    margin-top: 0.5rem;
    padding: 1rem ${theme.spacings.xsmall};
    background: ${theme.colors.primary};
    color: ${theme.colors.secondary};
    font-weight: 700;
    border-radius: 1rem;
    transition: all 0.4s ease-in-out;
  `}
`;

export const Error = styled.p`
  color: ${({ theme }) => theme.colors.cancel};
  margin-bottom: 2rem;
`;
export const TextTech = styled.h3`
  ${({ theme }) => css`
    color: ${theme.colors.off};
  `}
`;
