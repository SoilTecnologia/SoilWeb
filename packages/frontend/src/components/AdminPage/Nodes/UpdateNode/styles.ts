import styled, { css } from "styled-components";
import { FaRegTimesCircle } from "react-icons/fa";

export const Container = styled.div`
  ${({ theme }) => css`
    min-width: 50rem;
    background: ${theme.colors.primary_gradient};
    padding: 2rem 1rem;
    border-radius: 1rem;
    position: relative;

    display: flex;
    align-items: center;
    justify-content: center;
  `}
`;
export const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const Button = styled.input`
  ${({ theme }) => css`
    width: 30%;
    margin-bottom: 0.3rem;
    margin-top: 0.5rem;
    padding: 0.7rem ${theme.spacings.xsmall};
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
export const IconClosed = styled(FaRegTimesCircle)`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  font-size: 3.4rem;
  color: ${({ theme }) => theme.colors.cancel};

  &:hover {
    opacity: 0.7;
  }
`;
