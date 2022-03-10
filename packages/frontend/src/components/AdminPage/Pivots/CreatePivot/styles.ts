import styled, { css } from "styled-components";
import { FaRegTimesCircle } from "react-icons/fa";

export const Container = styled.div`
  min-width: 50vw;
  background: rgba(0, 0, 0, 0.5);
  padding: 3rem 4rem;
  margin-top: 4rem;
  border-radius: 1rem;
  position: relative;
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
export const IconClose = styled(FaRegTimesCircle)`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  font-size: 3.4rem;
  color: ${({ theme }) => theme.colors.cancel};

  &:hover {
    opacity: 0.7;
  }
`;
export const ButtonAddNodeId = styled.div`
  background: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.primary};
  border-radius: 0.6rem;
  padding: 0.7rem 1.4rem;
  transition: all 0.7s linear;
  font-size: 1.4rem;

  margin-bottom: 1.3rem;
  &:hover {
    opacity: 0.7;
  }
`;
