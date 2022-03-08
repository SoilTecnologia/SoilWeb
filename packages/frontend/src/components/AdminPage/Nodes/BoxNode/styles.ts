import styled from "styled-components";
import { FaEllipsisV } from "react-icons/fa";

export const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  background: ${({ theme }) => theme.colors.primary_gradient};
  border-radius: 0.6rem;
  padding: 0.5rem 7rem 0.5rem 1rem;
  margin: 0.7rem 0;
  transition: all 0.3s linear;

  &:hover {
    cursor: pointer;
    opacity: 0.7;
  }
`;
export const ContentPivotsNodes = styled.div`
  height: max-content;
`;

export const NodeName = styled.p`
  color: ${({ theme }) => theme.colors.offline};
  font-size: 1.8rem;

  span {
    color: ${({ theme }) => theme.colors.secondary};
    margin-left: 0.4rem;
  }
`;
export const IsGprs = styled(NodeName)``;
export const Gateway = styled(NodeName)``;
export const IconMenu = styled(FaEllipsisV)`
  position: absolute;
  top: 10px;
  right: 10px;
`;
