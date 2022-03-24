import { FaArrowLeft } from "react-icons/fa";
import styled from "styled-components";

export const TextLogout = styled.p`
  color: inherit;
`;
export const Content = styled.div`
  width: max-content;
  display: flex;
  align-items: center;
  justify-content: center;

  margin-left: 2.4rem;
  padding: 0.6rem 1rem;
  border-radius: 1.8rem;

  transition: all 0.3s linear;
  background: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.primary_gradient};

  z-index: 10;

  &:hover {
    cursor: pointer;
    background: ${({ theme }) => theme.colors.primary_gradient};
    color: ${({ theme }) => theme.colors.secondary};
  }
`;
export const Logout = styled(FaArrowLeft)`
  color: inherit;
  font-size: 2.6rem;
  margin-right: 0.6rem;
`;
