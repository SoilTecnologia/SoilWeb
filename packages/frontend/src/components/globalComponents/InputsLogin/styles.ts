import styled, { css } from "styled-components";
import { FaExclamationCircle } from "react-icons/fa";

export const ContentInputs = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem 0.6rem;
  margin: 0.6rem 0;
`;

export const Alert = styled.div`
  ${({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.1rem ${theme.spacings.xxsmall};
    color: ${theme.colors.cancel};
    font-size: ${theme.font.sizes.xsmall};
    font-weight: 500;
    border-radius: 0.5rem;
    margin-top: 0.4rem;
  `}
`;
export const Icon = styled(FaExclamationCircle)`
  ${({ theme }) => css`
    background: ${theme.colors.secondary};
    border-radius: 50%;
    font-size: ${theme.font.sizes.small};
    font-weight: 400;
    margin-right: 0.4rem;
  `}
`;
export const TextAlert = styled.p`
  margin-top: 0.4rem;
  color: ${({ theme }) => theme.colors.cancel};
`;
